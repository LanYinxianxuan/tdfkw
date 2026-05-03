-- 注册码表：存储预生成的注册码及其状态
CREATE TABLE IF NOT EXISTS registerCodes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL,
  expires_at DATETIME NOT NULL,
  is_used INTEGER DEFAULT 0
);

-- 用户表：存储注册成功的用户信息
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  qq TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  email TEXT UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 邮箱验证码表：存储临时发送的 OTP
CREATE TABLE IF NOT EXISTS email_verifications (
  email TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  qq TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  expires_at DATETIME NOT NULL
);

-- 插入测试注册码
INSERT OR IGNORE INTO registerCodes (code, expires_at, is_used) VALUES ('1', '2099-12-31T23:59:59.000Z', 0);
