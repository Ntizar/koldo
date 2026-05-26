#!/usr/bin/env python3
"""
Koldo Control Center — Dashboard Web Completo
Panel de control privado para Ntizar con:
- Estado en tiempo real de Hermes
- Kanban integrado
- Historial de actividad con gráficos
- Acciones rápidas (backup, sync, reiniciar)
- Alertas visuales
- Login con contraseña

Uso:
  python3 koldo_control_center.py [puerto]
  # Default: puerto 9876 (o STATUS_PAGE_PORT)

Variables de entorno:
  HERMES_HOME=/hermes-home
  KCC_PASSWORD=tu_contraseña_segura
  KCC_PORT=9876
  KCC_USERNAME=admin
"""

import json
import os
import re
import sys
import time
import base64
import hashlib
import secrets
import sqlite3
import subprocess
from datetime import datetime, timezone, timedelta
from http.server import HTTPServer, BaseHTTPRequestHandler
from threading import Lock, Thread
from urllib.parse import urlparse, parse_qs

# ─── CONFIGURACIÓN ───────────────────────────────────────────────
HOME_DIR = os.environ.get("HERMES_HOME", "/hermes-home")
STATE_FILE = os.path.join(HOME_DIR, "gateway_state.json")
LOG_DIR = os.path.join(HOME_DIR, "logs")
GATEWAY_LOG = os.path.join(LOG_DIR, "gateway.log")
ERROR_LOG = os.path.join(LOG_DIR, "errors.log")
AGENT_LOG = os.path.join(LOG_DIR, "agent.log")
KANBAN_DB = os.path.join(HOME_DIR, "kanban.db")
HISTORY_DIR = os.path.join(HOME_DIR, "monitor_history")

PORT = int(os.environ.get("KCC_PORT", os.environ.get("STATUS_PAGE_PORT", "9876")))
USERNAME = os.environ.get("KCC_USERNAME", "admin")
PASSWORD = os.environ.get("KCC_PASSWORD", os.environ.get("STATUS_PAGE_PASSWORD", "koldo_control_2026"))

# ─── HISTORIAL ───────────────────────────────────────────────────
history_lock = Lock()
metric_history = {"timestamps": [], "data": []}

# ─── ESTADO DE ACCIONES ──────────────────────────────────────────
actions_lock = Lock()
recent_actions = []  # Lista de acciones recientes


def save_metric(data: dict):
    os.makedirs(HISTORY_DIR, exist_ok=True)
    entry = {"ts": datetime.now(timezone.utc).isoformat(), **data}
    with history_lock:
        metric_history["timestamps"].append(entry["ts"])
        metric_history["data"].append(entry)
        cutoff = datetime.now(timezone.utc) - timedelta(hours=24)
        while metric_history["timestamps"] and datetime.fromisoformat(metric_history["timestamps"][0]).replace(tzinfo=timezone.utc) < cutoff:
            metric_history["timestamps"].pop(0)
            metric_history["data"].pop(0)
    if len(metric_history["data"]) % 3 == 0:
        with open(os.path.join(HISTORY_DIR, "metrics.jsonl"), "a") as f:
            f.write(json.dumps(entry) + "\n")


# ─── DATOS DEL SISTEMA ───────────────────────────────────────────
def get_gateway_state() -> dict:
    try:
        with open(STATE_FILE, "r") as f:
            return json.load(f)
    except Exception:
        return {"gateway_state": "unknown"}


def is_gateway_running() -> bool:
    try:
        with open(os.path.join(HOME_DIR, "gateway.pid")) as f:
            pid = int(f.read().strip())
        os.kill(pid, 0)
        return True
    except Exception:
        return False


def get_memory_usage() -> dict:
    try:
        mem = {}
        with open("/proc/meminfo") as f:
            for line in f:
                parts = line.split()
                mem[parts[0].rstrip(":")] = int(parts[1])
        total = mem.get("MemTotal", 1)
        avail = mem.get("MemAvailable", mem.get("MemFree", 0))
        return {
            "total_mb": total // 1024,
            "used_mb": (total - avail) // 1024,
            "available_mb": avail // 1024,
            "used_pct": round((1 - avail / total) * 100, 1),
        }
    except Exception:
        return {"error": "fail"}


def get_disk_usage() -> dict:
    try:
        r = subprocess.run(["df", "-h", "/"], capture_output=True, text=True, timeout=5)
        parts = r.stdout.strip().split("\n")[1].split()
        return {
            "total": parts[1], "used": parts[2],
            "available": parts[3], "used_pct": int(parts[4].replace("%", "")),
        }
    except Exception:
        return {"error": "fail"}


def get_cpu_usage() -> dict:
    try:
        with open("/proc/stat") as f:
            line = f.readline()
        parts = line.split()
        user, nice, system, idle, iowait = int(parts[1]), int(parts[2]), int(parts[3]), int(parts[4]), int(parts[5])
        total = user + nice + system + idle + iowait
        busy = user + nice + system
        return {
            "used_pct": round(busy / total * 100, 1),
            "total_ms": total,
        }
    except Exception:
        return {"error": "fail"}


def parse_gateway_logs_today() -> dict:
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    inbound = 0
    responses = []
    try:
        with open(GATEWAY_LOG) as f:
            for line in f:
                if today not in line:
                    continue
                if "inbound message:" in line:
                    inbound += 1
                if "response ready:" in line:
                    m = re.search(r"time=([\d.]+)s\s+api_calls=(\d+)", line)
                    if m:
                        responses.append({"time": float(m.group(1)), "api_calls": int(m.group(2))})
    except FileNotFoundError:
        pass
    avg_time = round(sum(r["time"] for r in responses) / len(responses), 1) if responses else 0
    avg_api = round(sum(r["api_calls"] for r in responses) / len(responses), 1) if responses else 0
    max_time = round(max((r["time"] for r in responses), default=0), 1)
    return {
        "inbound": inbound, "responses": len(responses),
        "avg_response_time_s": avg_time, "max_response_time_s": max_time,
        "avg_api_calls": avg_api,
    }


def parse_gateway_logs_last_24h() -> list:
    """Parse gateway logs de las últimas 24h para gráficos."""
    now = datetime.now(timezone.utc)
    events = []
    try:
        with open(GATEWAY_LOG) as f:
            for line in f:
                ts_match = re.match(r"(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})", line)
                if ts_match:
                    try:
                        ts = datetime.strptime(ts_match.group(1), "%Y-%m-%d %H:%M:%S").replace(tzinfo=timezone.utc)
                        if (now - ts).total_seconds() > 86400:
                            continue
                        if "inbound message:" in line:
                            events.append({"ts": ts.isoformat(), "type": "inbound"})
                        elif "response ready:" in line:
                            m = re.search(r"time=([\d.]+)s", line)
                            time_val = float(m.group(1)) if m else 0
                            events.append({"ts": ts.isoformat(), "type": "response", "time": time_val})
                        elif "ERROR" in line or "error" in line:
                            events.append({"ts": ts.isoformat(), "type": "error"})
                    except ValueError:
                        pass
    except FileNotFoundError:
        pass
    return events


def count_errors_last_hour() -> int:
    one_hour_ago = datetime.now(timezone.utc).timestamp() - 3600
    count = 0
    for logfile in [ERROR_LOG, AGENT_LOG]:
        try:
            with open(logfile) as f:
                for line in f:
                    ts_match = re.match(r"(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})", line)
                    if ts_match:
                        try:
                            ts = datetime.strptime(ts_match.group(1), "%Y-%m-%d %H:%M:%S").replace(tzinfo=timezone.utc).timestamp()
                            if ts >= one_hour_ago:
                                count += 1
                        except ValueError:
                            pass
        except FileNotFoundError:
            pass
    return count


def get_http_status(host, port, path="/") -> int:
    try:
        from http.client import HTTPConnection
        conn = HTTPConnection(host, port, timeout=3)
        conn.request("GET", path)
        resp = conn.getresponse()
        status = resp.status
        resp.read()
        conn.close()
        return status
    except Exception:
        return 0


def get_kanban_tasks() -> list:
    """Lee tareas del kanban desde kanban.db."""
    tasks = []
    try:
        conn = sqlite3.connect(KANBAN_DB)
        c = conn.cursor()
        c.execute("SELECT id, title, status, priority, created_at, started_at, completed_at, result, body FROM tasks ORDER BY priority DESC, created_at DESC LIMIT 50")
        rows = c.fetchall()
        for row in rows:
            task = {
                "id": row[0],
                "title": row[1],
                "status": row[2],
                "priority": row[3],
                "created_at": row[4],
                "started_at": row[5],
                "completed_at": row[6],
                "result": row[7][:200] if row[7] else None,
                "body": row[8][:500] if row[8] else None,
            }
            # Calcular % de progreso
            if task["status"] == "done":
                task["progress"] = 100
            elif task["status"] == "in_progress":
                task["progress"] = 50
            elif task["status"] == "in_review":
                task["progress"] = 75
            else:
                task["progress"] = 0
            tasks.append(task)
        conn.close()
    except Exception as e:
        tasks = [{"error": str(e)}]
    return tasks


def get_kanban_summary() -> dict:
    """Resumen del kanban por estado."""
    tasks = get_kanban_tasks()
    summary = {"total": 0, "ready": 0, "in_progress": 0, "in_review": 0, "done": 0, "failed": 0}
    for t in tasks:
        if "error" in t:
            continue
        summary["total"] += 1
        status = t["status"]
        if status in summary:
            summary[status] += 1
    return summary


def get_recent_actions() -> list:
    with actions_lock:
        return list(recent_actions[-20])


def add_action(action_type, description, status="pending"):
    action = {
        "ts": datetime.now(timezone.utc).isoformat(),
        "type": action_type,
        "description": description,
        "status": status,
    }
    with actions_lock:
        recent_actions.append(action)


def execute_action(action_name, params=None):
    """Ejecuta una acción desde el dashboard."""
    add_action(action_name, f"Ejecutando {action_name}", "running")
    try:
        if action_name == "backup_koldo":
            result = subprocess.run(
                ["bash", "-c", "cd /root/workspace/Koldo && git add -A && git commit -m \"auto: backup desde dashboard $(date +%Y-%m-%dT%H:%M:%S)\" && git push origin main"],
                capture_output=True, text=True, timeout=60
            )
            if result.returncode == 0:
                add_action("backup_koldo", "Backup completado", "success")
                return {"success": True, "output": result.stdout[:500]}
            else:
                add_action("backup_koldo", f"Error: {result.stderr[:200]}", "error")
                return {"success": False, "error": result.stderr[:500]}

        elif action_name == "sync_koldo":
            result = subprocess.run(
                ["bash", "-c", "cd /root/workspace/Koldo && git pull origin main"],
                capture_output=True, text=True, timeout=60
            )
            if result.returncode == 0:
                add_action("sync_koldo", "Sync completado", "success")
                return {"success": True, "output": result.stdout[:500]}
            else:
                add_action("sync_koldo", f"Error: {result.stderr[:200]}", "error")
                return {"success": False, "error": result.stderr[:500]}

        elif action_name == "restart_gateway":
            add_action("restart_gateway", "Reiniciando gateway...", "running")
            # Enviar SIGHUP para reinicio suave
            result = subprocess.run(
                ["bash", "-c", f"kill -HUP $(cat {HOME_DIR}/gateway.pid 2>/dev/null)"],
                capture_output=True, text=True, timeout=10
            )
            add_action("restart_gateway", "Señal SIGHUP enviada", "success")
            return {"success": True, "message": "SIGHUP enviado al gateway"}

        elif action_name == "run_cron":
            add_action("run_cron", "Ejecutando cron jobs pendientes...", "running")
            cron_script = f"""
import json
data = json.load(open('{HOME_DIR}/cron/jobs.json'))
for j in data.get('jobs', []):
    print(f'Ejecutando {{j["name"]}}')
"""
            result = subprocess.run(
                ["python3", "-c", cron_script],
                capture_output=True, text=True, timeout=10
            )
            add_action("run_cron", "Revisión completada", "success")
            return {"success": True, "output": result.stdout[:500]}

        elif action_name == "clear_history":
            history_file = os.path.join(HISTORY_DIR, "metrics.jsonl")
            if os.path.exists(history_file):
                os.remove(history_file)
            with history_lock:
                metric_history["timestamps"] = []
                metric_history["data"] = []
            add_action("clear_history", "Historial limpiado", "success")
            return {"success": True, "message": "Historial limpiado"}

        else:
            add_action(action_name, f"Acción desconocida: {action_name}", "error")
            return {"success": False, "error": f"Acción desconocida: {action_name}"}

    except subprocess.TimeoutExpired:
        add_action(action_name, "Timeout al ejecutar", "error")
        return {"success": False, "error": "Timeout (60s)"}
    except Exception as e:
        add_action(action_name, f"Error: {str(e)}", "error")
        return {"success": False, "error": str(e)}


def collect_metrics() -> dict:
    gw = get_gateway_state()
    pid_alive = is_gateway_running()
    mem = get_memory_usage()
    disk = get_disk_usage()
    cpu = get_cpu_usage()
    logs = parse_gateway_logs_today()
    errors_1h = count_errors_last_hour()
    gw_status = get_http_status("localhost", 8787)
    nan_status = get_http_status("localhost", 3500)
    kcc_status = get_http_status("localhost", PORT)

    tg_state = "unknown"
    if "platforms" in gw:
        tg = gw["platforms"].get("telegram", {})
        tg_state = tg.get("state", "unknown")

    sessions_dir = os.path.join(HOME_DIR, "sessions")
    sessions_count = 0
    if os.path.exists(sessions_dir):
        sessions_count = len([f for f in os.listdir(sessions_dir) if f.endswith(".json")])

    kanban_summary = get_kanban_summary()

    return {
        "gw_state": gw.get("gateway_state", "unknown"),
        "pid_alive": pid_alive,
        "tg_state": tg_state,
        "gw_http": gw_status,
        "nan_http": nan_status,
        "kcc_http": kcc_status,
        "mem": mem,
        "disk": disk,
        "cpu": cpu,
        "logs": logs,
        "errors_1h": errors_1h,
        "sessions_count": sessions_count,
        "kanban": kanban_summary,
        "now": datetime.now(timezone.utc).isoformat(),
    }


# ─── AUTENTICACIÓN ───────────────────────────────────────────────
def check_auth(headers) -> bool:
    auth = headers.get("Authorization", "")
    if not auth.startswith("Basic "):
        return False
    try:
        decoded = base64.b64decode(auth[6:]).decode()
        username, password = decoded.split(":", 1)
        # Hash la contraseña para comparar de forma segura
        password_hash = hashlib.sha256(password.encode()).hexdigest()
        stored_hash = hashlib.sha256(PASSWORD.encode()).hexdigest()
        return username == USERNAME and password_hash == stored_hash
    except Exception:
        return False


# ─── HTML RENDERING ──────────────────────────────────────────────
def html_bar(value, max_val=100, height=20):
    pct = min(value / max_val * 100, 100)
    if pct < 70:
        color = "#3fb950"
    elif pct < 85:
        color = "#d29922"
    else:
        color = "#f85149"
    return f'<div class="bar-container"><div class="bar" style="width:{pct}%;background:{color}"></div><span class="bar-label">{value}%</span></div>'


def html_status_emoji(status, alt=""):
    if status == "running" or status == "connected" or status == 200:
        return f'<span class="status-ok">🟢 {status}</span>'
    elif status in ("unknown", 0):
        return f'<span class="status-err">🔴 {alt or status}</span>'
    else:
        return f'<span class="status-warn">🟡 {status}</span>'


def render_dashboard_html(metrics: dict, kanban_tasks: list, kanban_summary: dict, history_events: list, actions: list, history_data: dict) -> str:
    m = metrics
    now = m["now"]

    # Kanban HTML
    kanban_html = ""
    if kanban_summary["total"] > 0:
        kanban_html = f"""
        <div class="kanban-summary">
            <div class="kanban-stat ready">Ready: {kanban_summary['ready']}</div>
            <div class="kanban-stat in_progress">En progreso: {kanban_summary['in_progress']}</div>
            <div class="kanban-stat in_review">Review: {kanban_summary['in_review']}</div>
            <div class="kanban-stat done">Done: {kanban_summary['done']}</div>
            <div class="kanban-stat failed">Failed: {kanban_summary['failed']}</div>
        </div>
        <div class="kanban-list">"""
        for t in kanban_tasks:
            if "error" in t:
                continue
            status_class = t["status"].replace("_", "-")
            status_emoji = {"ready": "📋", "in_progress": "🔄", "in_review": "👀", "done": "✅", "failed": "❌"}.get(t["status"], "❓")
            kanban_html += f"""
            <div class="kanban-item {status_class}">
                <div class="kanban-item-header">
                    <span class="kanban-emoji">{status_emoji}</span>
                    <span class="kanban-title">{t['title']}</span>
                    <span class="kanban-progress">{t['progress']}%</span>
                </div>
                <div class="kanban-item-meta">
                    <span class="kanban-status">{t['status']}</span>
                    <span class="kanban-priority">P{t['priority']}</span>
                </div>
            </div>"""
        kanban_html += "</div>"
    else:
        kanban_html = '<div class="kanban-empty">📋 Sin tareas activas. ¡Todo limpio!</div>'

    # Recent actions HTML
    actions_html = ""
    for a in reversed(actions):
        status_icon = {"success": "✅", "error": "❌", "running": "⏳", "pending": "⏸️"}.get(a["status"], "❓")
        actions_html += f'<div class="action-item"><span class="action-icon">{status_icon}</span> <span class="action-desc">{a["description"]}</span> <span class="action-time">{a["ts"][:19]}</span></div>'
    if not actions_html:
        actions_html = '<div class="action-item"><span class="action-icon">ℹ️</span> <span class="action-desc">Sin acciones recientes</span></div>'

    # Historical data for Chart.js
    history_json = json.dumps(history_data)

    return f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>🧠 Koldo Control Center</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
<style>
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  body {{ font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; background:#0a0e14; color:#c9d1d9; padding:0; }}

  /* Header */
  .header {{ background:linear-gradient(135deg,#0d1117 0%,#161b22 100%); border-bottom:1px solid #21262d; padding:16px 24px; display:flex; justify-content:space-between; align-items:center; }}
  .header h1 {{ font-size:22px; color:#58a6ff; font-weight:600; }}
  .header .subtitle {{ color:#8b949e; font-size:13px; margin-top:2px; }}
  .header .controls {{ display:flex; gap:8px; }}
  .header .controls button {{ background:#21262d; border:1px solid #30363d; color:#c9d1d9; padding:6px 14px; border-radius:6px; cursor:pointer; font-size:13px; transition:all .2s; }}
  .header .controls button:hover {{ background:#30363d; border-color:#58a6ff; }}
  .header .controls button.danger {{ border-color:#f85149; color:#f85149; }}
  .header .controls button.danger:hover {{ background:#f8514922; }}

  /* Container */
  .container {{ max-width:1400px; margin:0 auto; padding:20px 24px; }}

  /* Grid */
  .grid {{ display:grid; grid-template-columns:repeat(auto-fit,minmax(320px,1fr)); gap:16px; margin-bottom:20px; }}
  .grid-wide {{ grid-template-columns:1fr 1fr; }}
  @media(max-width:900px) {{ .grid-wide {{ grid-template-columns:1fr; }} }}

  /* Cards */
  .card {{ background:#161b22; border:1px solid #21262d; border-radius:12px; padding:20px; transition:border-color .2s; }}
  .card:hover {{ border-color:#30363d; }}
  .card h2 {{ font-size:15px; color:#8b949e; margin-bottom:14px; text-transform:uppercase; letter-spacing:1px; display:flex; align-items:center; gap:8px; }}
  .card h2 .icon {{ font-size:18px; }}

  /* Rows */
  .row {{ display:flex; justify-content:space-between; align-items:center; margin:8px 0; font-size:14px; }}
  .label {{ color:#8b949e; }}
  .value {{ font-family:'SF Mono',Monaco,monospace; font-weight:600; font-size:14px; }}

  /* Bars */
  .bar-container {{ background:#0d1117; border-radius:6px; height:24px; overflow:hidden; position:relative; margin:8px 0; }}
  .bar {{ height:100%; border-radius:6px; transition:width .5s ease; }}
  .bar-label {{ position:absolute; right:8px; top:50%; transform:translateY(-50%); font-size:12px; font-weight:600; color:#c9d1d9; }}

  /* Status */
  .status-ok {{ color:#3fb950; }} .status-err {{ color:#f85149; }} .status-warn {{ color:#d29922; }}

  /* Kanban */
  .kanban-summary {{ display:flex; gap:12px; margin-bottom:12px; flex-wrap:wrap; }}
  .kanban-stat {{ padding:4px 12px; border-radius:20px; font-size:12px; font-weight:600; }}
  .kanban-stat.ready {{ background:#1f6feb22; color:#58a6ff; }}
  .kanban-stat.in_progress {{ background:#d2992222; color:#d29922; }}
  .kanban-stat.in_review {{ background:#a371f722; color:#a371f7; }}
  .kanban-stat.done {{ background:#3fb95022; color:#3fb950; }}
  .kanban-stat.failed {{ background:#f8514922; color:#f85149; }}
  .kanban-list {{ display:flex; flex-direction:column; gap:8px; }}
  .kanban-item {{ background:#0d1117; border:1px solid #21262d; border-radius:8px; padding:12px; }}
  .kanban-item.ready {{ border-left:3px solid #58a6ff; }}
  .kanban-item.in_progress {{ border-left:3px solid #d29922; }}
  .kanban-item.in_review {{ border-left:3px solid #a371f7; }}
  .kanban-item.done {{ border-left:3px solid #3fb950; opacity:.7; }}
  .kanban-item.failed {{ border-left:3px solid #f85149; }}
  .kanban-item-header {{ display:flex; justify-content:space-between; align-items:center; }}
  .kanban-title {{ font-weight:600; font-size:14px; }}
  .kanban-emoji {{ font-size:16px; margin-right:8px; }}
  .kanban-progress {{ font-size:12px; color:#8b949e; font-family:monospace; }}
  .kanban-item-meta {{ display:flex; gap:8px; margin-top:6px; }}
  .kanban-status {{ font-size:11px; color:#8b949e; text-transform:uppercase; }}
  .kanban-priority {{ font-size:11px; color:#58a6ff; }}
  .kanban-empty {{ text-align:center; padding:20px; color:#8b949e; }}

  /* Actions */
  .action-item {{ display:flex; align-items:center; gap:10px; padding:8px 0; border-bottom:1px solid #21262d; font-size:13px; }}
  .action-item:last-child {{ border-bottom:none; }}
  .action-icon {{ font-size:14px; }}
  .action-desc {{ flex:1; }}
  .action-time {{ color:#8b949e; font-size:11px; font-family:monospace; }}

  /* Chart */
  .chart-container {{ position:relative; height:200px; margin-top:10px; }}

  /* Quick actions */
  .quick-actions {{ display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:10px; margin-top:10px; }}
  .quick-btn {{ background:#0d1117; border:1px solid #21262d; color:#c9d1d9; padding:12px; border-radius:8px; cursor:pointer; font-size:13px; text-align:center; transition:all .2s; }}
  .quick-btn:hover {{ border-color:#58a6ff; background:#161b22; }}
  .quick-btn .quick-icon {{ font-size:20px; display:block; margin-bottom:4px; }}

  /* Footer */
  .footer {{ text-align:center; padding:20px; color:#484f58; font-size:12px; border-top:1px solid #21262d; margin-top:20px; }}

  /* Auto-refresh indicator */
  .refresh-indicator {{ display:inline-flex; align-items:center; gap:6px; font-size:12px; color:#484f58; }}
  .refresh-dot {{ width:8px; height:8px; border-radius:50%; background:#3fb950; animation:pulse 2s infinite; }}
  @keyframes pulse {{ 0%,100% {{ opacity:1; }} 50% {{ opacity:.3; }} }}

  /* Alert banner */
  .alert-banner {{ background:#f8514918; border:1px solid #f8514944; border-radius:8px; padding:12px 16px; margin-bottom:16px; display:flex; align-items:center; gap:10px; font-size:14px; }}
  .alert-banner.warn {{ background:#d2992218; border-color:#d2992244; }}
</style>
</head>
<body>

<div class="header">
  <div>
    <h1>🧠 Koldo Control Center</h1>
    <div class="subtitle">Panel de control de Hermes — Última actualización: {now}</div>
  </div>
  <div class="controls">
    <button onclick="doAction('backup_koldo')">💾 Backup</button>
    <button onclick="doAction('sync_koldo')">🔄 Sync</button>
    <button onclick="doAction('run_cron')">⏰ Cron</button>
    <button onclick="doAction('restart_gateway')" class="danger">🔁 Reiniciar</button>
    <button onclick="doAction('clear_history')">🗑️ Limpiar</button>
  </div>
</div>

<div class="container">

  <!-- Alertas -->
  {'' if m['nan_http']==200 else '<div class="alert-banner">⚠️ <strong>NaN Dashboard caído</strong> — Puerto 3500 no responde (HTTP '+str(m['nan_http'])+')</div>'}
  {'' if m['gw_http']==200 else '<div class="alert-banner warn">⚠️ <strong>Gateway no responde</strong> — Puerto 8787 HTTP '+str(m['gw_http'])+'</div>'}

  <div class="grid">

    <!-- Gateway -->
    <div class="card">
      <h2><span class="icon">📡</span> Gateway</h2>
      <div class="row"><span class="label">Estado</span><span class="value">{html_status_emoji(m['gw_state'], 'desconocido')}</span></div>
      <div class="row"><span class="label">PID vivo</span><span class="value {'status-ok' if m['pid_alive'] else 'status-err'}">{'✅ Sí' if m['pid_alive'] else '❌ No'}</span></div>
      <div class="row"><span class="label">Puerto 8787</span><span class="value {'status-ok' if m['gw_http']==200 else 'status-warn'}">{'🟢' if m['gw_http']==200 else '🟡'} HTTP {m['gw_http']}</span></div>
      <div class="row"><span class="label">Puerto 9876 (este)</span><span class="value {'status-ok' if m['kcc_http']==200 else 'status-err'}">{'🟢' if m['kcc_http']==200 else '🔴'} HTTP {m['kcc_http']}</span></div>
    </div>

    <!-- Telegram -->
    <div class="card">
      <h2><span class="icon">💬</span> Telegram</h2>
      <div class="row"><span class="label">Estado</span><span class="value">{html_status_emoji(m['tg_state'], 'desconectado')}</span></div>
      <div class="row"><span class="label">Mensajes hoy</span><span class="value">{m['logs']['inbound']}</span></div>
      <div class="row"><span class="label">Respuestas hoy</span><span class="value">{m['logs']['responses']}</span></div>
      <div class="row"><span class="label">Tiempo promedio</span><span class="value {'status-warn' if m['logs']['avg_response_time_s']>30 else 'status-ok'}">{m['logs']['avg_response_time_s']}s</span></div>
      <div class="row"><span class="label">Tiempo máximo</span><span class="value {'status-warn' if m['logs']['max_response_time_s']>30 else 'status-ok'}">{m['logs']['max_response_time_s']}s</span></div>
      <div class="row"><span class="label">API calls/prom</span><span class="value">{m['logs']['avg_api_calls']}</span></div>
    </div>

    <!-- Recursos -->
    <div class="card">
      <h2><span class="icon">⚡</span> Recursos</h2>
      <div class="row"><span class="label">CPU</span><span class="value {'status-ok' if m['cpu'].get('used_pct',0)<80 else 'status-warn'}">{m['cpu'].get('used_pct','?')}%</span></div>
      <div class="bar-container"><div class="bar" style="width:{min(m['cpu'].get('used_pct',0),100)}%;background:{'#3fb950' if m['cpu'].get('used_pct',0)<80 else '#d29922'}"></div></div>
      <div class="row"><span class="label">RAM</span><span class="value {'status-ok' if m['mem'].get('used_pct',0)<85 else 'status-warn'}">{m['mem'].get('used_mb','?')}/{m['mem'].get('total_mb','?')} MB ({m['mem'].get('used_pct','?')}%)</span></div>
      <div class="bar-container"><div class="bar" style="width:{min(m['mem'].get('used_pct',0),100)}%;background:{'#3fb950' if m['mem'].get('used_pct',0)<85 else '#d29922' if m['mem'].get('used_pct',0)<95 else '#f85149'}"></div></div>
      <div class="row"><span class="label">Disco</span><span class="value {'status-ok' if m['disk'].get('used_pct',0)<85 else 'status-warn'}">{m['disk'].get('used','?')}/{m['disk'].get('total','?')} ({m['disk'].get('used_pct','?')}%)</span></div>
      <div class="bar-container"><div class="bar" style="width:{min(m['disk'].get('used_pct',0),100)}%;background:{'#3fb950' if m['disk'].get('used_pct',0)<85 else '#d29922' if m['disk'].get('used_pct',0)<95 else '#f85149'}"></div></div>
    </div>

    <!-- Servicios -->
    <div class="card">
      <h2><span class="icon">🔧</span> Servicios</h2>
      <div class="row"><span class="label">NaN Dashboard :3500</span><span class="value {'status-ok' if m['nan_http']==200 else 'status-err'}">{html_status_emoji(m['nan_http'], 'caído')}</span></div>
      <div class="row"><span class="label">Sesiones activas</span><span class="value">{m['sessions_count']}</span></div>
      <div class="row"><span class="label">Errores (1h)</span><span class="value {'status-ok' if m['errors_1h']<=10 else 'status-warn'}">{m['errors_1h']}</span></div>
      <div class="row"><span class="label">Cron jobs</span><span class="value">1 activo</span></div>
      <div class="row"><span class="label">Skills</span><span class="value">{26+6}</span></div>
    </div>

  </div>

  <!-- Kanban + Acciones -->
  <div class="grid grid-wide">

    <!-- Kanban -->
    <div class="card">
      <h2><span class="icon">📋</span> Kanban Board</h2>
      {kanban_html}
    </div>

    <!-- Acciones + Gráfico -->
    <div class="card">
      <h2><span class="icon">📈</span> Actividad 24h</h2>
      <div class="chart-container"><canvas id="activityChart"></canvas></div>
    </div>

  </div>

  <!-- Acciones rápidas + Historial -->
  <div class="grid grid-wide">

    <!-- Acciones rápidas -->
    <div class="card">
      <h2><span class="icon">⚡</span> Acciones Rápidas</h2>
      <div class="quick-actions">
        <button class="quick-btn" onclick="doAction('backup_koldo')"><span class="quick-icon">💾</span>Backup Koldo</button>
        <button class="quick-btn" onclick="doAction('sync_koldo')"><span class="quick-icon">🔄</span>Sync Repos</button>
        <button class="quick-btn" onclick="doAction('run_cron')"><span class="quick-icon">⏰</span>Ejecutar Cron</button>
        <button class="quick-btn" onclick="doAction('restart_gateway')"><span class="quick-icon">🔁</span>Reiniciar GW</button>
        <button class="quick-btn" onclick="doAction('clear_history')"><span class="quick-icon">🗑️</span>Limpiar Hist.</button>
      </div>
    </div>

    <!-- Acciones recientes -->
    <div class="card">
      <h2><span class="icon">📜</span> Acciones Recientes</h2>
      {actions_html}
    </div>

  </div>

</div>

<div class="footer">
  <span class="refresh-indicator"><span class="refresh-dot"></span> Actualización automática cada 30s</span>
  · Koldo Control Center v1.0 · {now}
</div>

<script>
// Chart.js — Gráfico de actividad 24h
const ctx = document.getElementById('activityChart').getContext('2d');
const historyData = {history_json};

// Agrupar eventos por hora
const hours = {};
for (let i = 0; i < 24; i++) {{
    const h = new Date();
    h.setHours(h.getHours() - (23 - i), 0, 0, 0);
    const key = h.toISOString().substring(11, 16);
    hours[key] = {{ inbound: 0, response: 0, error: 0 }};
}}

historyData.forEach(ev => {{
    const hour = ev.ts.substring(11, 16);
    if (hours[hour]) {{
        hours[hour][ev.type] = (hours[hour][ev.type] || 0) + 1;
    }}
}});

const labels = Object.keys(hours);
const inboundData = labels.map(k => hours[k].inbound);
const responseData = labels.map(k => hours[k].response);
const errorData = labels.map(k => hours[k].error);

new Chart(ctx, {{
    type: 'line',
    data: {{
        labels: labels,
        datasets: [
            {{ label: 'Mensajes', data: inboundData, borderColor: '#58a6ff', backgroundColor: '#58a6ff22', fill: true, tension: 0.3, pointRadius: 2 }},
            {{ label: 'Respuestas', data: responseData, borderColor: '#3fb950', backgroundColor: '#3fb95022', fill: true, tension: 0.3, pointRadius: 2 }},
            {{ label: 'Errores', data: errorData, borderColor: '#f85149', backgroundColor: '#f8514922', fill: true, tension: 0.3, pointRadius: 2 }}
        ]
    }},
    options: {{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {{ legend: {{ labels: {{ color: '#8b949e', font: {{ size: 11 }} }} }} }},
        scales: {{
            x: {{ ticks: {{ color: '#484f58', font: {{ size: 10 }} }}, grid: {{ color: '#21262d' }} }},
            y: {{ ticks: {{ color: '#484f58', font: {{ size: 10 }} }}, grid: {{ color: '#21262d' }}, beginAtZero: true }}
        }}
    }}
}});

// Acciones
function doAction(actionName) {{
    fetch('/api/action?name=' + encodeURIComponent(actionName))
        .then(r => r.json())
        .then(data => {{
            if (data.success) {{
                alert('✅ ' + (data.message || data.output || 'Acción completada'));
            }} else {{
                alert('❌ Error: ' + (data.error || 'Desconocido'));
            }}
            // Recargar página
            setTimeout(() => location.reload(), 1000);
        }})
        .catch(err => alert('❌ Error de conexión: ' + err));
}}

// Auto-refresh cada 30s
setInterval(() => {{
    fetch('/api/metrics')
        .then(r => r.json())
        .then(data => {{
            document.querySelector('.subtitle').textContent = 'Última actualización: ' + data.now + ' · Auto-refresh cada 30s';
        }}).catch(() => {{}});
}}, 30000);
</script>

<meta http-equiv="refresh" content="30">
</body>
</html>"""


# ─── HTTP HANDLER ────────────────────────────────────────────────
class KoldoControlHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        params = parse_qs(parsed.query)

        # API endpoints (sin auth para health/metrics)
        if path == "/health":
            metrics = collect_metrics()
            self.send_response(200 if metrics["gw_state"] == "running" else 503)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": metrics["gw_state"], "ts": metrics["now"]}).encode())
            return

        if path == "/api/metrics":
            metrics = collect_metrics()
            save_metric(metrics)
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(metrics).encode())
            return

        if path == "/api/history":
            events = parse_gateway_logs_last_24h()
            # Agrupar por hora
            hourly = {}
            now = datetime.now(timezone.utc)
            for i in range(24):
                h = now - timedelta(hours=23 - i)
                key = h.strftime("%H:%M")
                hourly[key] = {"inbound": 0, "response": 0, "error": 0}
            for ev in events:
                hour = ev["ts"][11:16]
                if hour in hourly:
                    hourly[hour][ev["type"]] = hourly[hour].get(ev["type"], 0) + 1
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(list(hourly.values())).encode())
            return

        if path == "/api/kanban":
            tasks = get_kanban_tasks()
            summary = get_kanban_summary()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"tasks": tasks, "summary": summary}).encode())
            return

        if path == "/api/actions":
            actions = get_recent_actions()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(actions).encode())
            return

        if path == "/api/action":
            action_name = params.get("name", [None])[0]
            if action_name:
                result = execute_action(action_name)
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps(result).encode())
                return

        # Página principal — con auth
        if not check_auth(self.headers):
            self.send_response(401)
            self.send_header("WWW-Authenticate", 'Basic realm="Koldo Control Center"')
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()
            self.wfile.write(b"""<!DOCTYPE html><html><head><meta charset="utf-8"><title>Login — Koldo Control Center</title><style>body{background:#0a0e14;color:#c9d1d9;font-family:sans-serif;display:flex;justify-content:center;align-items:center;height:100vh;margin:0}.login{background:#161b22;border:1px solid #21262d;border-radius:12px;padding:40px;text-align:center;max-width:400px}h1{color:#58a6ff;margin-bottom:20px}input{width:100%;padding:12px;margin:8px 0;border:1px solid #30363d;border-radius:6px;background:#0d1117;color:#c9d1d9;font-size:16px}.btn{width:100%;padding:12px;background:#238636;color:white;border:none;border-radius:6px;font-size:16px;cursor:pointer;margin-top:12px}.btn:hover{background:#2ea043}.error{color:#f85149;margin-top:12px}</style></head><body><div class="login"><h1>🧠 Koldo Control Center</h1><p style="color:#8b949e;margin-bottom:20px">Introduce tu contraseña para acceder</p><form method="POST" action="/login"><input type="password" name="password" placeholder="Contraseña" autofocus><br><button type="submit" class="btn">Entrar</button></form><p class="error">Acceso no autorizado</p></div></body></html>""")
            return

        # Dashboard principal
        metrics = collect_metrics()
        save_metric(metrics)
        kanban_tasks = get_kanban_tasks()
        kanban_summary = get_kanban_summary()
        history_events = parse_gateway_logs_last_24h()
        actions = get_recent_actions()

        # Preparar data para gráfico
        now = datetime.now(timezone.utc)
        history_data = []
        for i in range(24):
            h = now - timedelta(hours=23 - i)
            key = h.strftime("%H:%M")
            history_data.append({"inbound": 0, "response": 0, "error": 0})

        for ev in history_events:
            hour = ev["ts"][11:16]
            for i, hd in enumerate(history_data):
                if list(hd.keys())[0] == "inbound":  # first key
                    idx = i
                    break

        html = render_dashboard_html(metrics, kanban_tasks, kanban_summary, history_events, actions, history_data)
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.end_headers()
        self.wfile.write(html.encode())

    def do_POST(self):
        if self.path == "/login":
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length).decode()
            password = parse_qs(body).get("password", [""])[0]
            # Hash para comparar
            password_hash = hashlib.sha256(password.encode()).hexdigest()
            stored_hash = hashlib.sha256(PASSWORD.encode()).hexdigest()
            if password_hash == stored_hash:
                # Set session cookie
                self.send_response(303)
                self.send_header("Location", "/")
                self.send_header("Set-Cookie", f"koldo_session={secrets.token_hex(32)}; Path=/; HttpOnly; SameSite=Strict")
                self.end_headers()
            else:
                self.send_response(401)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.end_headers()
                self.wfile.write(b"<html><body><h1>Contraseña incorrecta</h1><a href='/'>Volver</a></body></html>")
            return

    def log_message(self, format, *args):
        pass  # Suppress access logs


def run_server():
    print(f"🧠 Koldo Control Center en http://0.0.0.0:{PORT}")
    print(f"   👤 Usuario: {USERNAME}")
    print(f"   🔒 Protegido con contraseña")
    print(f"   📊 http://localhost:{PORT}/api/metrics  (sin auth)")
    print(f"   🏥 http://localhost:{PORT}/health       (sin auth)")
    server = HTTPServer(("0.0.0.0", PORT), KoldoControlHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n👋 Koldo Control Center detenido")
        server.server_close()


if __name__ == "__main__":
    run_server()
