#!/usr/bin/env python3
"""
Hermes Status Page — Opción B: Web Local
Sirve una página HTML con métricas en tiempo real.
Acceso protegido con contraseña básica.

Uso:
  python3 status_page.py [puerto]
  # Default: puerto 9876

Variables de entorno:
  HERMES_HOME=/hermes-home
  STATUS_PAGE_PASSWORD=mi_contraseña_segura
  STATUS_PAGE_PORT=9876
"""

import json
import os
import re
import sys
import time
import base64
from datetime import datetime, timezone, timedelta
from http.server import HTTPServer, BaseHTTPRequestHandler
from threading import Lock

# ─── CONFIGURACIÓN ───────────────────────────────────────────────
HOME_DIR = os.environ.get("HERMES_HOME", "/hermes-home")
STATE_FILE = os.path.join(HOME_DIR, "gateway_state.json")
LOG_DIR = os.path.join(HOME_DIR, "logs")
GATEWAY_LOG = os.path.join(LOG_DIR, "gateway.log")
ERROR_LOG = os.path.join(LOG_DIR, "errors.log")
AGENT_LOG = os.path.join(LOG_DIR, "agent.log")
HISTORY_DIR = os.path.join(HOME_DIR, "monitor_history")

PORT = int(os.environ.get("STATUS_PAGE_PORT", "9876"))
PASSWORD = os.environ.get("STATUS_PAGE_PASSWORD", "")

# ─── HISTORIAL DE MÉTRICAS ──────────────────────────────────────
history_lock = Lock()
metric_history = {"timestamps": [], "data": []}


def save_metric(data: dict):
    """Guarda métricas en historial JSON."""
    os.makedirs(HISTORY_DIR, exist_ok=True)
    entry = {"ts": datetime.now(timezone.utc).isoformat(), **data}
    with history_lock:
        metric_history["timestamps"].append(entry["ts"])
        metric_history["data"].append(entry)
        cutoff = datetime.now(timezone.utc) - timedelta(hours=24)
        while metric_history["timestamps"] and datetime.fromisoformat(metric_history["timestamps"][0]).replace(tzinfo=timezone.utc) < cutoff:
            metric_history["timestamps"].pop(0)
            metric_history["data"].pop(0)
    if len(metric_history["data"]) % 5 == 0:
        with open(os.path.join(HISTORY_DIR, "metrics.jsonl"), "a") as f:
            f.write(json.dumps(entry) + "\n")


# ─── FUNCIONES DE DATOS ──────────────────────────────────────────
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
        import subprocess
        r = subprocess.run(["df", "-h", "/"], capture_output=True, text=True, timeout=5)
        parts = r.stdout.strip().split("\n")[1].split()
        return {
            "total": parts[1], "used": parts[2],
            "available": parts[3], "used_pct": int(parts[4].replace("%", "")),
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


def collect_metrics() -> dict:
    gw = get_gateway_state()
    pid_alive = is_gateway_running()
    mem = get_memory_usage()
    disk = get_disk_usage()
    logs = parse_gateway_logs_today()
    errors_1h = count_errors_last_hour()
    gw_status = get_http_status("localhost", 8787)
    nan_status = get_http_status("localhost", 3500)

    tg_state = "unknown"
    if "platforms" in gw:
        tg = gw["platforms"].get("telegram", {})
        tg_state = tg.get("state", "unknown")

    sessions_dir = os.path.join(HOME_DIR, "sessions")
    sessions_count = 0
    if os.path.exists(sessions_dir):
        sessions_count = len([f for f in os.listdir(sessions_dir) if f.endswith(".json")])

    return {
        "gw_state": gw.get("gateway_state", "unknown"),
        "pid_alive": pid_alive,
        "tg_state": tg_state,
        "gw_http": gw_status,
        "nan_http": nan_status,
        "mem": mem,
        "disk": disk,
        "logs": logs,
        "errors_1h": errors_1h,
        "sessions_count": sessions_count,
        "now": datetime.now(timezone.utc).isoformat(),
    }


# ─── HTML RENDERING ──────────────────────────────────────────────
def html_bar(value, max_val=100):
    pct = min(value / max_val * 100, 100)
    if pct < 70:
        color = "#4caf50"
    elif pct < 85:
        color = "#ff9800"
    else:
        color = "#f44336"
    return f'<div style="background:#333;border-radius:4px;height:20px;overflow:hidden;width:200px"><div style="background:{color};height:100%;width:{pct}%"></div></div>'


def render_html(metrics: dict) -> str:
    m = metrics
    gw_emoji = "🟢" if m["gw_state"] == "running" else "🔴"
    tg_emoji = "🟢" if m["tg_state"] == "connected" else "🔴"
    gw_port = "🟢" if m["gw_http"] == 200 else "🔴"
    nan_port = "🟢" if m["nan_http"] == 200 else "🔴"

    return f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>🤖 Hermes Status</title>
<style>
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  body {{ font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; background:#0d1117; color:#c9d1d9; padding:20px; }}
  .container {{ max-width:900px; margin:0 auto; }}
  h1 {{ color:#58a6ff; margin-bottom:5px; font-size:24px; }}
  .subtitle {{ color:#8b949e; margin-bottom:20px; font-size:14px; }}
  .grid {{ display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:16px; margin-bottom:20px; }}
  .card {{ background:#161b22; border:1px solid #30363d; border-radius:8px; padding:16px; }}
  .card h2 {{ font-size:16px; color:#58a6ff; margin-bottom:12px; border-bottom:1px solid #21262d; padding-bottom:8px; }}
  .row {{ display:flex; justify-content:space-between; margin:6px 0; font-size:14px; }}
  .label {{ color:#8b949e; }}
  .value {{ font-family:monospace; font-weight:bold; }}
  .bar {{ margin:8px 0; }}
  .refresh {{ color:#8b949e; font-size:12px; text-align:center; }}
  .status-ok {{ color:#4caf50; }} .status-err {{ color:#f44336; }} .status-warn {{ color:#ff9800; }}
</style>
<meta http-equiv="refresh" content="30">
</head>
<body>
<div class="container">
  <h1>🤖 Hermes Status Page</h1>
  <p class="subtitle">Última actualización: {m['now']} · Auto-refresh cada 30s</p>

  <div class="grid">
    <div class="card">
      <h2>📡 Gateway</h2>
      <div class="row"><span class="label">Estado</span><span class="value {'status-ok' if m['gw_state']=='running' else 'status-err'}">{gw_emoji} {m['gw_state']}</span></div>
      <div class="row"><span class="label">PID vivo</span><span class="value {'status-ok' if m['pid_alive'] else 'status-err'}">{'✅ Sí' if m['pid_alive'] else '❌ No'}</span></div>
      <div class="row"><span class="label">Puerto 8787</span><span class="value {'status-ok' if m['gw_http']==200 else 'status-err'}">{gw_port} HTTP {m['gw_http']}</span></div>
    </div>

    <div class="card">
      <h2>💬 Telegram</h2>
      <div class="row"><span class="label">Estado</span><span class="value {'status-ok' if m['tg_state']=='connected' else 'status-err'}">{tg_emoji} {m['tg_state']}</span></div>
    </div>

    <div class="card">
      <h2>📊 Hoy</h2>
      <div class="row"><span class="label">Mensajes entrantes</span><span class="value">{m['logs']['inbound']}</span></div>
      <div class="row"><span class="label">Respuestas</span><span class="value">{m['logs']['responses']}</span></div>
      <div class="row"><span class="label">Tiempo promedio</span><span class="value">{m['logs']['avg_response_time_s']}s</span></div>
      <div class="row"><span class="label">Tiempo máximo</span><span class="value {'status-warn' if m['logs']['max_response_time_s']>30 else 'status-ok'}">{m['logs']['max_response_time_s']}s</span></div>
      <div class="row"><span class="label">API calls/prom</span><span class="value">{m['logs']['avg_api_calls']}</span></div>
    </div>

    <div class="card">
      <h2>⚡ Recursos</h2>
      <div class="row"><span class="label">RAM</span><span class="value">{m['mem'].get('used_mb','?')}/{m['mem'].get('total_mb','?')} MB</span></div>
      <div class="bar">{html_bar(m['mem'].get('used_pct',0))} <span class="value {'status-warn' if m['mem'].get('used_pct',0)>80 else 'status-ok'}">{m['mem'].get('used_pct','?')}%</span></div>
      <div class="row"><span class="label">Disco</span><span class="value">{m['disk'].get('used','?')}/{m['disk'].get('total','?')}</span></div>
      <div class="bar">{html_bar(m['disk'].get('used_pct',0))} <span class="value {'status-warn' if m['disk'].get('used_pct',0)>80 else 'status-ok'}">{m['disk'].get('used_pct','?')}%</span></div>
    </div>

    <div class="card">
      <h2>🔧 Servicios</h2>
      <div class="row"><span class="label">Gateway :8787</span><span class="value {'status-ok' if m['gw_http']==200 else 'status-err'}">{gw_port} {m['gw_http']}</span></div>
      <div class="row"><span class="label">NaN Dashboard :3500</span><span class="value {'status-ok' if m['nan_http']==200 else 'status-err'}">{nan_port} {m['nan_http']}</span></div>
      <div class="row"><span class="label">Sesiones activas</span><span class="value">{m['sessions_count']}</span></div>
      <div class="row"><span class="label">Errores (1h)</span><span class="value {'status-warn' if m['errors_1h']>10 else 'status-ok'}">{m['errors_1h']}</span></div>
    </div>
  </div>

  <p class="refresh">🔄 Actualización automática cada 30 segundos</p>
</div>
</body>
</html>"""


# ─── HTTP HANDLER ────────────────────────────────────────────────
class StatusHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/health":
            metrics = collect_metrics()
            self.send_response(200 if metrics["gw_state"] == "running" else 503)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"status": metrics["gw_state"], "ts": metrics["now"]}).encode())
            return

        if self.path == "/metrics.json":
            metrics = collect_metrics()
            save_metric(metrics)
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(metrics).encode())
            return

        if self.path == "/history.json":
            with history_lock:
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"timestamps": metric_history["timestamps"], "data": metric_history["data"][-100:]}).encode())
            return

        # Página principal — con auth
        if PASSWORD:
            auth = self.headers.get("Authorization", "")
            if not auth.startswith("Basic "):
                self.send_response(401)
                self.send_header("WWW-Authenticate", 'Basic realm="Hermes Status"')
                self.end_headers()
                return
            try:
                decoded = base64.b64decode(auth[6:]).decode()
                if decoded != f"admin:{PASSWORD}":
                    self.send_response(401)
                    self.end_headers()
                    return
            except Exception:
                self.send_response(401)
                self.end_headers()
                return

        metrics = collect_metrics()
        save_metric(metrics)
        html = render_html(metrics)
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.end_headers()
        self.wfile.write(html.encode())

    def log_message(self, format, *args):
        pass  # Suppress access logs


def run_server():
    print(f"🌐 Hermes Status Page en http://0.0.0.0:{PORT}")
    if PASSWORD:
        print(f"   🔒 Protegido con contraseña")
    else:
        print(f"   ⚠️  SIN contraseña — solo accesible localmente")
    server = HTTPServer(("0.0.0.0", PORT), StatusHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n👋 Servidor detenido")
        server.server_close()


if __name__ == "__main__":
    run_server()
