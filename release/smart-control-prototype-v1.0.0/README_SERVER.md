# 服务器管理脚本使用说明

## 简介

`server.py` 是智能飞机杯控制原型的开发服务器管理脚本，提供启动、停止、状态查询等功能。

## 功能特性

- ✅ 启动/停止服务器
- ✅ 自动检查端口占用
- ✅ PID文件管理（自动保存和清理）
- ✅ 优雅停止（先SIGTERM，后SIGKILL）
- ✅ 状态查询
- ✅ 端口冲突处理

## 使用方法

### 1. 启动服务器

```bash
# 方法1: 直接运行（默认启动）
python3 server.py

# 方法2: 明确指定start参数
python3 server.py start
```

启动后会：
- 检查端口是否被占用
- 切换到 `web-prototype` 目录
- 启动HTTP服务器（端口8080）
- 自动在浏览器打开演示页面
- 保存进程ID到 `.server.pid`

### 2. 停止服务器

```bash
python3 server.py stop
```

停止时会：
- 读取PID文件获取进程ID
- 发送SIGTERM信号优雅停止
- 如果未响应，发送SIGKILL强制停止
- 自动清理PID文件

### 3. 查看服务器状态

```bash
python3 server.py status
```

会显示：
- 服务器是否运行
- 进程ID（如果运行中）
- 服务器地址
- 如何停止服务器

### 4. 查看帮助

```bash
python3 server.py help
```

或使用简写：

```bash
python3 server.py --help
python3 server.py -h
```

## 开发提示

### 清除Service Worker缓存

如果遇到页面显示旧内容的问题（例如使用 `localhost` 和 `127.0.0.1` 看到不同的内容），这是因为Service Worker缓存导致的。

**解决方法：**

1. **清除浏览器缓存和Service Worker**
   - Chrome/Edge: 开发者工具 (F12) → Application → Service Workers → 点击 "Unregister"
   - Safari: 开发者工具 → 存储 → Service Worker → 删除
   - Firefox: 开发者工具 → 应用程序 → Service Workers → 注销

2. **强制刷新页面**
   - Windows/Linux: `Ctrl + Shift + R` 或 `Ctrl + F5`
   - macOS: `Cmd + Shift + R`

3. **清除所有缓存**
   - Chrome: 开发者工具 → Application → Clear storage → Clear site data
   - 或使用无痕模式测试新功能

4. **禁用Service Worker（开发时）**
   - Chrome开发者工具 → Application → Service Workers → 勾选 "Bypass for network"

**注意：** `localhost` 和 `127.0.0.1` 在浏览器中被视为不同的域名，各自有独立的Service Worker缓存。建议开发时固定使用其中一个地址。

## 常见问题

### Q1: 端口被占用怎么办？

如果启动时提示端口被占用：

1. **检查是否有其他服务器在运行**
   ```bash
   python3 server.py status
   ```

2. **如果有运行的服务器，停止它**
   ```bash
   python3 server.py stop
   ```

3. **如果没有找到PID文件，手动停止**
   ```bash
   # 查找占用端口的进程
   lsof -ti:8080 | xargs kill -9
   # 或
   kill -9 $(lsof -ti:8080)
   ```

### Q2: 如何修改端口？

编辑 `server.py` 文件，修改以下变量：

```python
PORT = 8080  # 改为你想要的端口号
```

### Q3: PID文件是什么？

`.server.pid` 文件用于记录服务器进程ID，用于后续停止服务器。该文件会在：
- 服务器启动时自动创建
- 服务器停止时自动删除

如果该文件残留，可以手动删除：

```bash
rm .server.pid
```

### Q4: 如何在后台运行？

推荐使用系统工具在后台运行：

```bash
# Linux/macOS
nohup python3 server.py start > server.log 2>&1 &

# 使用 screen
screen -S sextoy python3 server.py start

# 使用 tmux
tmux new -s sextoy -d python3 server.py start
```

## 技术说明

### 架构

- 使用 Python 标准库 `http.server` 提供HTTP服务
- 使用 `socket` 检测端口占用
- 使用 `os.kill` 发送信号控制进程
- 使用 PID 文件管理进程状态

### 自定义请求处理器

`CustomHTTPRequestHandler` 添加了CORS支持，用于：
- MQTT通信测试
- 跨域请求处理
- 预检请求（OPTIONS）支持

### 服务器配置

- **端口**: 8080
- **主机**: localhost
- **服务目录**: `web-prototype/`
- **PID文件**: `.server.pid`（项目根目录）

## 服务地址

启动后可以访问：

- 🌐 **演示页面**: http://localhost:8080/demo.html
- 📱 **主应用**: http://localhost:8080/index.html
- 📄 **用户流程**: http://localhost:8080/USER_FLOW.html

## 兼容性

### 操作系统

- ✅ macOS
- ✅ Linux
- ✅ Windows (PowerShell)

### Python版本

- ✅ Python 3.6+
- 推荐 Python 3.8+

## 替代方案

如果你更喜欢原来的 `start_server.py`，它仍然可以正常使用：

```bash
python3 start_server.py
```

但是它不支持 `stop` 命令，只能通过 `Ctrl+C` 停止。

## 贡献

如果有问题或建议，欢迎提出Issue或Pull Request。

