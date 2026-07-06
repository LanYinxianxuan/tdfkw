# 服务器监控接口

## GET /api/monitor/minecraft

Minecraft 服务器基本状态（公开接口，代理自 [mcsrvstat.us](https://api.mcsrvstat.us/)）。

**成功响应：**
```json
{
  "success": true,
  "data": {
    "online": true,
    "hostname": "mc.tangdoufangkuaiwu.top",
    "ip": "110.42.36.214",
    "port": 25565,
    "version": "1.20.4",
    "motd": "A Minecraft Server",
    "players_online": 5,
    "players_max": 20,
    "players": ["Player1", "Player2"],
    "fetched_at": "2026-07-06T15:28:54.439Z"
  }
}
```

**离线时：**
```json
{
  "success": true,
  "data": {
    "online": false,
    "error": "upstream_unavailable",
    "hostname": "mc.tangdoufangkuaiwu.top"
  }
}
```

## GET /api/monitor/system

系统指标（**需登录**）。代理自 Minecraft 服务器上的 `monitor-agent.py`。

**前提条件：** 需在 `.dev.vars`（本地）或 Cloudflare Secrets（生产）中配置 `MONITOR_HOST` 和 `MONITOR_TOKEN`。

**成功响应：**
```json
{
  "success": true,
  "data": {
    "cpu": { "percent": 12.5 },
    "memory": {
      "used_kb": 4194304,
      "total_kb": 8388608,
      "percent": 50.0
    },
    "disk": {
      "used_gb": "25.3",
      "total_gb": "100.0",
      "percent": 25.3
    },
    "load": { "load1": 0.5, "load5": 0.3, "load15": 0.2 },
    "network": { "rx_mb": "120.5", "tx_mb": "45.2" },
    "uptime": { "seconds": 864000, "display": "10d 0h 0m" }
  }
}
```

**未配置时：**
```json
{
  "success": true,
  "data": { "node_only": true, "message": "MONITOR_HOST 未配置" }
}
```

## GET /api/monitor/minecraft-local

Minecraft RCON 状态（**需登录**）。通过 `monitor-agent.py` 的 RCON 获取 TPS、玩家进程等信息。

**成功响应：**
```json
{
  "success": true,
  "data": {
    "mc_alive": true,
    "tps": "20.0",
    "players": ["Player1", "Player2", ...]
  }
}
```

## GET /api/monitor/health

网站自身健康检查（公开）。

**成功响应：**
```json
{
  "success": true,
  "data": {
    "api": "ok",
    "database": "ok",
    "timestamp": "2026-07-06T15:28:54.499Z"
  }
}
```

**数据库异常时：**
```json
{
  "success": true,
  "data": {
    "api": "ok",
    "database": "error",
    "db_error": "SQLITE_CORRUPT: ..."
  }
}
```
