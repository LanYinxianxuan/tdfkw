#!/usr/bin/env python3
"""
TDFKW 服务器监控小服务
极轻量 HTTP 服务，部署在 MC 服务器上，读取 /proc 提供系统指标。
用法: python3 monitor-agent.py
端口: 9100
鉴权: Authorization: Bearer <token>
"""
import http.server
import json
import os
import re
import socket
import struct
import subprocess
import sys
import time
from urllib.parse import urlparse

# ===== 配置 =====
PORT = int(os.environ.get("MONITOR_PORT", 9100))
TOKEN = os.environ.get("MONITOR_TOKEN", "tdfkw-monitor-secret")
RCON_HOST = os.environ.get("RCON_HOST", "127.0.0.1")
RCON_PORT = int(os.environ.get("RCON_PORT", 25575))
RCON_PASSWORD = os.environ.get("RCON_PASSWORD", "a53092520110")

# ===== RCON 客户端 =====
class RconClient:
    """极简 RCON 客户端，无外部依赖"""
    PACKET_AUTH = 3
    PACKET_COMMAND = 2

    def __init__(self, host, port, password):
        self.host = host
        self.port = port
        self.password = password
        self.sock = None
        self.request_id = 0

    def connect(self, timeout=5):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.settimeout(timeout)
        self.sock.connect((self.host, self.port))
        # 认证
        self._send(self.PACKET_AUTH, self.password)
        # 读响应
        resp_id, resp_type, _ = self._recv()
        if resp_id == -1:
            self.sock.close()
            return False
        return True

    def command(self, cmd):
        self.request_id += 1
        self._send(self.PACKET_COMMAND, cmd)
        _, _, body = self._recv()
        return body

    def _send(self, ptype, body):
        data = body.encode("utf-8") + b"\x00\x00"
        packet = struct.pack("<iii", 10 + len(data), self.request_id, ptype) + data
        self.sock.sendall(packet)

    def _recv(self):
        try:
            header = self._recv_exact(12)
            if not header:
                return -1, 0, ""
            length, rid, rtype = struct.unpack("<iii", header)
            data = self._recv_exact(length - 8)
            body = data[:-2].decode("utf-8", errors="replace") if data else ""
            return rid, rtype, body
        except Exception:
            return -1, 0, ""

    def _recv_exact(self, n):
        data = b""
        while len(data) < n:
            try:
                chunk = self.sock.recv(n - len(data))
            except socket.timeout:
                return None
            if not chunk:
                return None
            data += chunk
        return data

    def close(self):
        if self.sock:
            self.sock.close()


# ===== 系统指标读取（/proc） =====
def get_cpu():
    """CPU 使用率，读取 /proc/stat"""
    try:
        with open("/proc/stat") as f:
            line = f.readline()
        cols = line.split()
        if len(cols) < 5:
            return None
        user, nice, system, idle = int(cols[1]), int(cols[2]), int(cols[3]), int(cols[4])
        total = user + nice + system + idle
        used = user + nice + system
        return {"percent": round(used / total * 100, 1) if total > 0 else 0, "total": total, "used": used}
    except Exception:
        return None


def get_memory():
    """内存使用，读取 /proc/meminfo"""
    mem = {}
    try:
        with open("/proc/meminfo") as f:
            for line in f:
                m = re.match(r"(\w+):\s+(\d+)", line)
                if m:
                    mem[m.group(1)] = int(m.group(2))
        total = mem.get("MemTotal", 0)
        available = mem.get("MemAvailable", 0)
        used = total - available
        return {
            "total_kb": total,
            "used_kb": used,
            "available_kb": available,
            "percent": round(used / total * 100, 1) if total > 0 else 0,
        }
    except Exception:
        return None


def get_disk():
    """磁盘使用，读取挂载在 / 的分区"""
    try:
        stat = os.statvfs("/")
        total = stat.f_frsize * stat.f_blocks
        available = stat.f_frsize * stat.f_bavail
        used = total - available
        return {
            "total_gb": round(total / (1024**3), 1),
            "used_gb": round(used / (1024**3), 1),
            "available_gb": round(available / (1024**3), 1),
            "percent": round(used / total * 100, 1) if total > 0 else 0,
        }
    except Exception:
        return None


def get_load():
    """系统负载"""
    try:
        with open("/proc/loadavg") as f:
            parts = f.read().split()
        return {"load1": float(parts[0]), "load5": float(parts[1]), "load15": float(parts[2])}
    except Exception:
        return None


def get_network():
    """网络流量，读取 /proc/net/dev"""
    try:
        with open("/proc/net/dev") as f:
            lines = f.readlines()[2:]  # 跳过标题
        rx_total = 0
        tx_total = 0
        for line in lines:
            cols = line.split()
            if len(cols) >= 10:
                iface = cols[0].rstrip(":")
                if iface == "lo":
                    continue
                rx_total += int(cols[1])
                tx_total += int(cols[9])
        return {"rx_bytes": rx_total, "tx_bytes": tx_total, "rx_mb": round(rx_total / (1024**2), 1), "tx_mb": round(tx_total / (1024**2), 1)}
    except Exception:
        return None


def get_uptime():
    """系统运行时间"""
    try:
        with open("/proc/uptime") as f:
            secs = float(f.read().split()[0])
        days = int(secs // 86400)
        hours = int((secs % 86400) // 3600)
        mins = int((secs % 3600) // 60)
        return {"seconds": int(secs), "display": f"{days}d {hours}h {mins}m"}
    except Exception:
        return None


# ===== MC 服务器状态 =====
def get_mc_process():
    """检查 MC 服务器 Java 进程，读取 data 目录下的 server.properties"""
    try:
        result = subprocess.run(
            ["pgrep", "-f", "java.*minecraft|java.*server.jar|java.*fabric|java.*paper|java.*spigot"],
            capture_output=True, text=True, timeout=5,
        )
        pids = [p for p in result.stdout.strip().split("\n") if p]
        return len(pids) > 0
    except Exception:
        return None


def get_rcon_status():
    """通过 RCON 获取 MC 服务器 TPS 和玩家列表"""
    rcon = RconClient(RCON_HOST, RCON_PORT, RCON_PASSWORD)
    try:
        if not rcon.connect(timeout=5):
            return {"error": "RCON 连接失败（认证错误或端口未开放）"}

        # 获取 TPS
        tps_result = rcon.command("tps")
        tps = None
        # 解析 TPS 输出: "TPS from last 1m, 5m, 15m: 20.0, 20.0, 20.0"
        tps_match = re.search(r"(\d+\.?\d*),\s*(\d+\.?\d*),\s*(\d+\.?\d*)", tps_result)
        if tps_match:
            tps = {
                "1m": float(tps_match.group(1)),
                "5m": float(tps_match.group(2)),
                "15m": float(tps_match.group(3)),
            }

        # 获取玩家列表
        list_result = rcon.command("list")
        players = []
        player_count = 0
        max_players = 0
        # 解析 "There are X of a max of Y players online: player1, player2"
        list_match = re.search(r"There are (\d+) of a max of (\d+) players online(?::\s*(.*))?", list_result)
        if list_match:
            player_count = int(list_match.group(1))
            max_players = int(list_match.group(2))
            if list_match.group(3):
                players = [p.strip() for p in list_match.group(3).split(",") if p.strip()]

        rcon.close()
        return {
            "tps": tps,
            "players_online": player_count,
            "players_max": max_players,
            "players": players,
        }
    except socket.timeout:
        return {"error": "RCON 连接超时"}
    except ConnectionRefusedError:
        return {"error": "RCON 端口未开放（请在 server.properties 中启用 enable-rcon）"}
    except Exception as e:
        return {"error": str(e)}
    finally:
        try:
            rcon.close()
        except Exception:
            pass


# ===== HTTP 服务 =====
class MonitorHandler(http.server.BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        pass  # 静默日志

    def _check_auth(self):
        auth = self.headers.get("Authorization", "")
        if not auth.startswith("Bearer "):
            return False
        return auth[7:] == TOKEN

    def _send_json(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", len(body))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Authorization, Content-Type")
        self.end_headers()

    def do_GET(self):
        path = urlparse(self.path).path

        if path == "/system":
            if not self._check_auth():
                return self._send_json({"error": "未授权"}, 401)

            cpu = get_cpu()
            mem = get_memory()
            disk = get_disk()
            load = get_load()
            net = get_network()
            uptime = get_uptime()

            # CPU 需要两次采样取差值，这里只做一次快照
            cpu1 = get_cpu()
            time.sleep(0.1)
            cpu2 = get_cpu()
            if cpu1 and cpu2:
                total_delta = cpu2["total"] - cpu1["total"]
                used_delta = cpu2["used"] - cpu1["used"]
                cpu_percent = round(used_delta / total_delta * 100, 1) if total_delta > 0 else 0.0
            else:
                cpu_percent = cpu1["percent"] if cpu1 else None

            self._send_json({
                "cpu": {"percent": cpu_percent},
                "memory": mem,
                "disk": disk,
                "load": load,
                "network": net,
                "uptime": uptime,
            })

        elif path == "/minecraft":
            if not self._check_auth():
                return self._send_json({"error": "未授权"}, 401)

            process_alive = get_mc_process()
            rcon = get_rcon_status() if process_alive else None

            self._send_json({
                "process_alive": process_alive,
                "rcon": rcon,
                "host": RCON_HOST,
                "port": RCON_PORT,
            })

        elif path == "/health":
            self._send_json({"status": "ok", "timestamp": time.time()})

        else:
            self._send_json({"error": "Not Found"}, 404)


if __name__ == "__main__":
    server = http.server.HTTPServer(("0.0.0.0", PORT), MonitorHandler)
    print(f"[monitor-agent] 监听 0.0.0.0:{PORT}")
    print(f"[monitor-agent] TOKEN={'*' * 8}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n[monitor-agent] 退出")
        server.shutdown()
