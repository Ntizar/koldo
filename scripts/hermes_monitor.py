#!/usr/bin/env python3
"""
Hermes Monitor — Opción A: Telegram Bot Monitor
Monitorea el estado de Hermes y envía alertas por Telegram.
Solo usa Python stdlib. Sin dependencias externas.

Uso:
  python3 hermes_monitor.py              # Modo daemon
  python3 hermes_monitor.py status       # Estado rápido
  python3 hermes_monitor.py dashboard    # Dashboard completo
  python3 hermes_monitor.py alert        # Forzar check de alertas
  python3 hermes_monitor.py health       # Health check (exit 0/1)
"""

import json
import os
import re
import subprocess
import sys
import time
import urllib.request
import urllib.error
from datetime import datetime, timezone
from http.client import HTTPConnection

# ─── CONFIGURACIÓN ───────────────────────────────────────────────
HOME_DIR = os.environ.get("HERMES_HOME", "/hermes-home")
STATE_FILE = os.path.join(HOME_DIR, "gateway_state.json")
LOG_DIR = os.path.join(HOME_DIR, "logs")
GATEWAY_LOG = os.path.join(LOG_DIR, "gateway.log")
ERROR_LOG = os.path.join(LOG_DIR, "errors.log")
AGENT_LOG = os.path.join(LOG_DIR, "agent.log")

# Telegram Bot config (set via env vars)
TELEGRAM_BOT_TOKEN = os.environ.get("HERMES_MONITOR_BOT_TOKEN", "")
TELEGRAM_CHAT_ID = os.environ.get("HERMES_MONITOR_CHAT_ID", "")

# Thresholds
CPU_WARN = 80       # % CPU
MEM_WARN = 85       # % RAM
DISK_WARN = 85      # % disk
RESPONSE_TIME_WARN = 30  # seconds
ERRORS_PER_HOUR_WARN = 10
CHECK_INTERVAL = 60  # seconds


# ─── TELEGRAM API ────────────────────────────────────────────────
def tg_send(message: str, parse_mode: str = "HTML") -> bool:
    """Envía un mensaje por Telegram usando solo stdlib."""
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        print(f"[SKIP] Telegram no configurado (token={bool(TELEGRAM_BOT_TOKEN)}, chat_id={bool(TELEGRAM_CHAT_ID)})")
        return False
    try:
        url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
        data = {
            "chat_id": TELEGRAM_CHAT_ID,
            "text": message,
            "parse_mode": parse_mode,
        }
        req = urllib.request.Request(
            url,
            data=json.dumps(data).encode(),
            headers={"Content-Type": "application/json"},
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            return resp.status == 200
    except Exception as e:
        print(f"[ERROR] Telegram send failed: {e}")
        return False


# ─── ESTADO DEL GATEWAY ──────────────────────────────────────────
def get_gateway_state() -> dict:
    """Lee gateway_state.json."""
    try:
        with open(STATE_FILE, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return {"gateway_state": "unknown", "error": "state file not found"}
    except json.JSONDecodeError:
        return {"gateway_state": "corrupted", "error": "invalid JSON"}


def is_gateway_running() -> bool:
    """Verifica si el gateway está vivo via PID."""
    try:
        pid_file = os.path.join(HOME_DIR, "gateway.pid")
        with open(pid_file) as f:
            content = f.read().strip()
        # PID file may be just a number or JSON {"pid": N, ...}
        if content.startswith("{"):
            pid = json.loads(content).get("pid", 0)
        else:
            pid = int(content)
        os.kill(pid, 0)
        return True
    except (FileNotFoundError, ValueError, ProcessLookupError, json.JSONDecodeError):
        return False


# ─── RECURSOS DEL SISTEMA ────────────────────────────────────────
def get_cpu_usage() -> float:
    """Calcula CPU usada del sistema desde /proc/stat."""
    try:
        with open("/proc/stat") as f:
            line = f.readline()
        parts = line.split()
        idle = int(parts[4]) + int(parts[5])  # idle + iowait
        total = sum(int(x) for x in parts[1:])
        return round((1 - idle / total) * 100, 1)
    except Exception:
        return -1


def get_memory_usage() -> dict:
    """Lee /proc/meminfo."""
    try:
        mem = {}
        with open("/proc/meminfo") as f:
            for line in f:
                parts = line.split()
                key = parts[0].rstrip(":")
                mem[key] = int(parts[1])  # kB
        total = mem.get("MemTotal", 1)
        available = mem.get("MemAvailable", mem.get("MemFree", 0))
        used_pct = round((1 - available / total) * 100, 1)
        return {
            "total_mb": total // 1024,
            "used_mb": (total - available) // 1024,
            "available_mb": available // 1024,
            "used_pct": used_pct,
        }
    except Exception as e:
        return {"error": str(e)}


def get_disk_usage() -> dict:
    """Lee df del root filesystem."""
    try:
        result = subprocess.run(
            ["df", "-h", "/"], capture_output=True, text=True, timeout=5
        )
        lines = result.stdout.strip().split("\n")
        if len(lines) >= 2:
            parts = lines[1].split()
            return {
                "total": parts[1],
                "used": parts[2],
                "available": parts[3],
                "used_pct": int(parts[4].replace("%", "")),
            }
    except Exception:
        pass
    return {"error": "df failed"}


# ─── LOG PARSING ─────────────────────────────────────────────────
def parse_gateway_logs_today() -> dict:
    """Parsea gateway.log para métricas del día actual."""
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    inbound = 0
    responses = []
    try:
        with open(GATEWAY_LOG, "r") as f:
            for line in f:
                if today not in line:
                    continue
                if "inbound message:" in line:
                    inbound += 1
                if "response ready:" in line:
                    m = re.search(r"time=([\d.]+)s\s+api_calls=(\d+)", line)
                    if m:
                        responses.append({
                            "time": float(m.group(1)),
                            "api_calls": int(m.group(2)),
                        })
    except FileNotFoundError:
        pass

    avg_time = round(sum(r["time"] for r in responses) / len(responses), 1) if responses else 0
    avg_api = round(sum(r["api_calls"] for r in responses) / len(responses), 1) if responses else 0
    max_time = round(max((r["time"] for r in responses), default=0), 1)

    return {
        "inbound": inbound,
        "responses": len(responses),
        "avg_response_time_s": avg_time,
        "max_response_time_s": max_time,
        "avg_api_calls": avg_api,
    }


def count_errors_last_hour() -> int:
    """Cuenta warnings/errors en los logs de la última hora."""
    one_hour_ago = datetime.now(timezone.utc).timestamp() - 3600
    count = 0
    for logfile in [ERROR_LOG, AGENT_LOG]:
        try:
            with open(logfile, "r") as f:
                for line in f:
                    ts_match = re.match(r"(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})", line)
                    if ts_match:
                        ts_str = ts_match.group(1)
                        try:
                            ts = datetime.strptime(ts_str, "%Y-%m-%d %H:%M:%S").replace(tzinfo=timezone.utc).timestamp()
                            if ts >= one_hour_ago:
                                count += 1
                        except ValueError:
                            pass
        except FileNotFoundError:
            pass
    return count


# ─── PORT CHECKING ───────────────────────────────────────────────
def get_http_status(host: str, port: int, path: str = "/") -> int:
    """Obtiene el código HTTP de un servicio."""
    try:
        conn = HTTPConnection(host, port, timeout=5)
        conn.request("GET", path)
        resp = conn.getresponse()
        status = resp.status
        resp.read()
        conn.close()
        return status
    except Exception:
        return 0


# ─── DASHBOARD ───────────────────────────────────────────────────
def build_dashboard() -> str:
    """Construye el mensaje de dashboard completo."""
    gw = get_gateway_state()
    pid_alive = is_gateway_running()
    cpu = get_cpu_usage()
    mem = get_memory_usage()
    disk = get_disk_usage()
    logs = parse_gateway_logs_today()
    errors_1h = count_errors_last_hour()

    gw_state = gw.get("gateway_state", "unknown")
    tg_state = "unknown"
    tg_error = None
    if "platforms" in gw:
        tg = gw["platforms"].get("telegram", {})
        tg_state = tg.get("state", "unknown")
        tg_error = tg.get("error_message")

    # Puertos
    gw_status = get_http_status("localhost", 8787)
    nan_status = get_http_status("localhost", 3500)

    # Emojis según estado
    gw_emoji = "🟢" if gw_state == "running" else "🔴"
    tg_emoji = "🟢" if tg_state == "connected" else "🔴"
    gw_port_emoji = "🟢" if gw_status == 200 else "🔴"
    nan_emoji = "🟢" if nan_status == 200 else "🔴"

    mem_bar = "█" * int(mem.get("used_pct", 0) / 5) + "░" * (20 - int(mem.get("used_pct", 0) / 5))
    disk_bar = "█" * int(disk.get("used_pct", 0) / 5) + "░" * (20 - int(disk.get("used_pct", 0) / 5))

    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")

    msg = f"""🤖 <b>HERMES STATUS DASHBOARD</b>
📅 {now}

<b>📡 GATEWAY</b> {gw_emoji}
  Estado: <code>{gw_state}</code>
  PID vivo: <code>{"✅ Sí" if pid_alive else "❌ No"}</code>
  Puerto 8787: <code>{gw_port_emoji} {gw_status}</code>

<b>💬 TELEGRAM</b> {tg_emoji}
  Estado: <code>{tg_state}</code>
  {"❌ Error: " + tg_error if tg_error else "✅ Sin errores"}

<b>📊 HOY</b>
  Mensajes entrantes: <code>{logs['inbound']}</code>
  Respuestas: <code>{logs['responses']}</code>
  Tiempo promedio: <code>{logs['avg_response_time_s']}s</code>
  Máximo: <code>{logs['max_response_time_s']}s</code>
  API calls/promedio: <code>{logs['avg_api_calls']}</code>

<b>⚡ RECURSOS</b>
  CPU: <code>{cpu}%</code>
  RAM: <code>{mem.get('used_mb', '?')}/{mem.get('total_mb', '?')} MB</code> <code>{mem_bar}</code> <code>{mem.get('used_pct', '?')}%</code>
  Disco: <code>{disk.get('used', '?')}/{disk.get('total', '?')}</code> <code>{disk_bar}</code> <code>{disk.get('used_pct', '?')}%</code>

<b>🔧 SERVICIOS</b>
  Gateway (8787): <code>{gw_port_emoji} {gw_status}</code>
  NaN Dashboard (3500): <code>{nan_emoji} {nan_status}</code>

<b>⚠️ ERRORES (1h)</b> <code>{errors_1h}</code>
"""
    return msg


# ─── ALERTAS ─────────────────────────────────────────────────────
def check_alerts() -> list:
    """Verifica condiciones de alerta y devuelve mensajes."""
    alerts = []
    gw = get_gateway_state()
    pid_alive = is_gateway_running()
    mem = get_memory_usage()
    disk = get_disk_usage()
    errors_1h = count_errors_last_hour()
    logs = parse_gateway_logs_today()

    if not pid_alive or gw.get("gateway_state") != "running":
        alerts.append("🔴 <b>CRÍTICO:</b> Gateway caído o PID no existe!")

    tg_state = "unknown"
    if "platforms" in gw:
        tg = gw["platforms"].get("telegram", {})
        tg_state = tg.get("state", "unknown")
    if tg_state != "connected":
        alerts.append(f"🔴 <b>CRÍTICO:</b> Telegram desconectado (estado: {tg_state})")

    if mem.get("used_pct", 0) > MEM_WARN:
        alerts.append(f"🟡 <b>ALERTA:</b> RAM al {mem['used_pct']}% ({mem['used_mb']}/{mem['total_mb']} MB)")

    if disk.get("used_pct", 0) > DISK_WARN:
        alerts.append(f"🟡 <b>ALERTA:</b> Disco al {disk['used_pct']}% ({disk['used']}/{disk['total']})")

    if errors_1h > ERRORS_PER_HOUR_WARN:
        alerts.append(f"🟡 <b>ALERTA:</b> {errors_1h} errores en la última hora")

    if logs["max_response_time_s"] > RESPONSE_TIME_WARN:
        alerts.append(f"🟡 <b>ALERTA:</b> Tiempo de respuesta máximo hoy: {logs['max_response_time_s']}s")

    # Puertos
    gw_status = get_http_status("localhost", 8787)
    if gw_status != 200:
        alerts.append(f"🟡 <b>ALERTA:</b> Gateway no responde en puerto 8787 (HTTP {gw_status})")

    nan_status = get_http_status("localhost", 3500)
    if nan_status != 200:
        alerts.append(f"🟡 <b>ALERTA:</b> NaN Dashboard no responde en puerto 3500 (HTTP {nan_status})")

    return alerts


# ─── MODO DAEMON ─────────────────────────────────────────────────
def run_daemon():
    """Modo daemon: checkea cada CHECK_INTERVAL segundos."""
    print(f"🚀 Hermes Monitor Daemon iniciado")
    print(f"   Intervalo: {CHECK_INTERVAL}s")
    print(f"   CPU_WARN={CPU_WARN}% MEM_WARN={MEM_WARN}% DISK_WARN={DISK_WARN}%")

    # Envía mensaje de inicio
    tg_send(
        "🤖 <b>Hermes Monitor</b>\n✅ Daemon iniciado correctamente\n📊 Check cada "
        f"{CHECK_INTERVAL}s\n🔔 Alertas activas"
    )

    last_alerts = set()
    while True:
        try:
            # Check de alertas
            alerts = check_alerts()
            if alerts:
                alert_msg = "⚠️ <b>ALERTAS HERMES</b>\n\n" + "\n".join(alerts)
                tg_send(alert_msg)
                current_key = tuple(alerts)
                if current_key != last_alerts:
                    last_alerts = current_key
                    print(f"  ⚠️ Alertas enviadas: {len(alerts)}")

            # Dashboard cada 5 minutos
            if int(time.time()) % 300 < CHECK_INTERVAL:
                dashboard = build_dashboard()
                tg_send(dashboard)

        except Exception as e:
            print(f"[ERROR] Check failed: {e}")

        time.sleep(CHECK_INTERVAL)


# ─── MAIN ────────────────────────────────────────────────────────
def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "daemon"

    if mode == "status":
        gw = get_gateway_state()
        print(json.dumps(gw, indent=2))
    elif mode == "dashboard":
        msg = build_dashboard()
        print(msg)
    elif mode == "alert":
        alerts = check_alerts()
        if alerts:
            for a in alerts:
                print(a)
            tg_send("⚠️ <b>ALERTA MANUAL</b>\n\n" + "\n".join(alerts))
        else:
            print("✅ Todo normal")
    elif mode == "health":
        gw_status = get_http_status("localhost", 8787)
        nan_status = get_http_status("localhost", 3500)
        pid_alive = is_gateway_running()
        print(f"gateway_pid_alive={pid_alive}")
        print(f"gateway_http={gw_status}")
        print(f"nan_http={nan_status}")
        sys.exit(0 if (gw_status == 200 and pid_alive) else 1)
    elif mode == "daemon":
        run_daemon()
    else:
        print(f"Uso: {sys.argv[0]} [status|dashboard|alert|health|daemon]")
        sys.exit(1)


if __name__ == "__main__":
    main()
