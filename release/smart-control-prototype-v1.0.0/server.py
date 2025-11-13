#!/usr/bin/env python3
"""
智能飞机杯控制原型 - 开发服务器管理脚本

快速开始:
    # Starts the development server on port 8080
    python3 server.py

用法:
    # 启动服务器
    python3 server.py start
    或
    python3 server.py
    
    # 停止服务器
    python3 server.py stop
    
    # 查看状态
    python3 server.py status
    
    # 查看帮助
    python3 server.py help

功能:
    - 自动检查端口占用
    - PID文件管理（自动保存和清理）
    - 优雅停止服务器
    - 端口冲突智能处理

详细说明请查看: README_SERVER.md
"""

import http.server
import socketserver
import webbrowser
import os
import sys
import subprocess
import signal
from pathlib import Path

# 配置
PORT = 8080
HOST = '0.0.0.0'  # 监听所有网络接口，允许通过IP地址访问
PID_FILE = '.server.pid'

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """自定义HTTP请求处理器，添加CORS支持"""
    
    def do_GET(self):
        # 处理favicon.ico请求，避免404错误
        if self.path.startswith('/favicon.ico'):
            self.send_response(204)  # No Content
            self.end_headers()
            return
        # 处理其他GET请求
        super().do_GET()
    
    def end_headers(self):
        # 添加CORS头，用于MQTT测试
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        # 处理预检请求
        self.send_response(200)
        self.end_headers()
    
    def copyfile(self, source, outputfile):
        """重写文件复制方法，优雅处理客户端断开连接"""
        try:
            super().copyfile(source, outputfile)
        except BrokenPipeError:
            # 客户端在传输完成前断开连接（如刷新页面、关闭标签）
            # 这是正常情况，不需要记录错误
            pass
        except OSError as e:
            # 其他系统错误，只在非BrokenPipeError时记录
            if e.errno != 32:  # 32是BrokenPipeError的errno
                raise
    
    def log_message(self, format, *args):
        """重写日志方法，避免某些请求导致错误，并过滤favicon.ico请求"""
        try:
            # 过滤favicon.ico请求，避免日志中的404错误
            if args and '/favicon.ico' in str(args[0]):
                return
            super().log_message(format, *args)
        except (UnicodeEncodeError, OSError) as e:
            # 忽略编码错误和系统错误，避免中断服务器
            pass
    
    def handle_one_request(self):
        """重写请求处理方法，捕获BrokenPipeError"""
        try:
            super().handle_one_request()
        except BrokenPipeError:
            # 客户端断开连接，这是正常情况（如刷新页面）
            # 不记录错误，静默处理
            pass
        except OSError as e:
            # 检查是否是BrokenPipeError (errno 32)
            if e.errno == 32:
                # 客户端断开连接，静默处理
                pass
            else:
                # 其他OSError，正常抛出
                raise
    
    def log_error(self, format, *args):
        """重写错误日志方法，优雅处理错误"""
        try:
            # 过滤掉BrokenPipeError的错误日志
            if args:
                # 检查是否是BrokenPipeError相关
                error_msg = str(args[0]) if args else ""
                if "Broken pipe" in error_msg or "BrokenPipeError" in error_msg:
                    # 不记录BrokenPipeError，这是正常情况
                    return
            super().log_error(format, *args)
        except (UnicodeEncodeError, OSError):
            # 忽略编码错误
            pass

def get_pid_file_path():
    """获取PID文件路径"""
    script_dir = Path(__file__).parent
    return script_dir / '.server.pid'

def get_server_pid():
    """读取服务器进程ID"""
    pid_file = get_pid_file_path()
    if pid_file.exists():
        try:
            with open(pid_file, 'r') as f:
                return int(f.read().strip())
        except (ValueError, IOError):
            return None
    return None

def save_server_pid(pid):
    """保存服务器进程ID"""
    pid_file = get_pid_file_path()
    try:
        with open(pid_file, 'w') as f:
            f.write(str(pid))
    except IOError as e:
        print(f"警告: 无法保存PID文件: {e}")

def remove_pid_file():
    """删除PID文件"""
    pid_file = get_pid_file_path()
    if pid_file.exists():
        try:
            pid_file.unlink()
        except IOError:
            pass

def is_port_in_use(port):
    """检查端口是否被占用"""
    import socket
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        try:
            s.bind(('0.0.0.0', port))  # 检查所有接口
            return False
        except OSError:
            return True

def start_server():
    """启动开发服务器"""
    # 检查端口是否被占用
    if is_port_in_use(PORT):
        pid = get_server_pid()
        if pid and is_process_running(pid):
            print(f"❌ 端口 {PORT} 已被占用")
            print(f"服务器可能正在运行中 (PID: {pid})")
            print("💡 提示: 使用 'python3 server.py stop' 停止服务器")
            sys.exit(1)
        else:
            print(f"⚠️  端口 {PORT} 被占用，但找不到服务器进程")
            print(f"💡 提示: 尝试手动结束占用端口的进程")
            print(f"   命令: lsof -ti:{PORT} | xargs kill -9")
            print(f"   或:   kill -9 $(lsof -ti:{PORT})")
            sys.exit(1)
    
    # 检查web-prototype目录是否存在
    script_dir = Path(__file__).parent
    web_prototype_dir = script_dir / 'web-prototype'
    
    if not web_prototype_dir.exists():
        print(f"❌ 错误: 找不到 {web_prototype_dir} 目录")
        print("请确保从项目根目录运行此脚本")
        sys.exit(1)
    
    # 切换到web-prototype目录
    os.chdir(web_prototype_dir)
    
    # 获取本机IP地址用于显示
    import socket
    try:
        # 连接到外部地址（不实际发送数据）来获取本机IP
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('8.8.8.8', 80))  # 连接到公共DNS
        local_ip = s.getsockname()[0]
        s.close()
    except:
        local_ip = 'localhost'
    
    print("🚀 正在启动智能飞机杯控制原型服务器...")
    print(f"📁 服务目录: {web_prototype_dir}")
    print(f"🌐 本地访问: http://localhost:{PORT}")
    if local_ip != 'localhost':
        print(f"📱 网络访问: http://{local_ip}:{PORT}")
    print(f"📱 演示页面: http://{local_ip}:{PORT}/demo.html")
    print(f"🎮 主应用: http://{local_ip}:{PORT}/index.html")
    print(f"⏹️  停止服务器: python3 server.py stop")
    print("-" * 60)
    
    # 启动服务器
    try:
        with socketserver.TCPServer((HOST, PORT), CustomHTTPRequestHandler) as httpd:
            # 保存进程ID
            save_server_pid(os.getpid())
            
            # 尝试自动打开浏览器
            try:
                webbrowser.open(f'http://{HOST}:{PORT}/demo.html')
                print("🌐 已在浏览器中打开演示页面")
            except:
                pass
            
            print(f"✅ 服务器已启动，正在监听端口 {PORT}...")
            print("   (按 Ctrl+C 停止服务器)")
            
            try:
                httpd.serve_forever()
            except KeyboardInterrupt:
                print("\n")
                print("🛑 正在停止服务器...")
            except Exception as e:
                print(f"\n⚠️  服务器运行时出错: {e}")
                print("正在停止服务器...")
    except Exception as e:
        print(f"❌ 启动服务器失败: {e}")
        sys.exit(1)
    finally:
        # 清理PID文件
        remove_pid_file()
        print("✅ 服务器已停止")

def is_process_running(pid):
    """检查进程是否正在运行"""
    try:
        # 发送信号0来检查进程是否存在
        os.kill(pid, 0)
        return True
    except OSError:
        return False

def stop_server():
    """停止开发服务器"""
    pid = get_server_pid()
    
    if not pid:
        # 检查端口是否被占用
        if is_port_in_use(PORT):
            print(f"⚠️  找不到PID文件，但端口 {PORT} 被占用")
            print(f"💡 尝试使用以下命令手动停止:")
            print(f"   lsof -ti:{PORT} | xargs kill -9")
            print(f"   或:   kill -9 $(lsof -ti:{PORT})")
            sys.exit(1)
        else:
            print("ℹ️  服务器未运行")
            sys.exit(0)
    
    if not is_process_running(pid):
        print(f"⚠️  PID {pid} 对应的进程不存在")
        print("服务器可能已经停止")
        remove_pid_file()
        sys.exit(0)
    
    # 尝试优雅停止
    try:
        print(f"🛑 正在停止服务器 (PID: {pid})...")
        os.kill(pid, signal.SIGTERM)
        
        # 等待进程结束
        import time
        for i in range(10):
            time.sleep(0.2)
            if not is_process_running(pid):
                break
        
        if is_process_running(pid):
            print("⚠️  进程未响应，强制终止...")
            os.kill(pid, signal.SIGKILL)
        
        remove_pid_file()
        print("✅ 服务器已停止")
        
    except ProcessLookupError:
        print("⚠️  进程不存在，可能已经停止")
        remove_pid_file()
    except PermissionError:
        print(f"❌ 没有权限停止进程 {pid}")
        print("请使用 sudo 或检查权限")
        sys.exit(1)
    except Exception as e:
        print(f"❌ 停止服务器失败: {e}")
        sys.exit(1)

def show_status():
    """显示服务器状态"""
    pid = get_server_pid()
    
    if not pid:
        if is_port_in_use(PORT):
            print("⚠️  状态未知")
            print(f"   端口 {PORT} 被占用，但找不到PID文件")
            print("   服务器可能不是通过此脚本启动的")
        else:
            print("ℹ️  服务器未运行")
        sys.exit(0)
    
    if is_process_running(pid):
        print(f"✅ 服务器正在运行")
        print(f"   PID: {pid}")
        print(f"   地址: http://{HOST}:{PORT}")
        print(f"   停止: python3 server.py stop")
    else:
        print("⚠️  PID文件存在，但进程不存在")
        print(f"   PID: {pid}")
        print("   正在清理PID文件...")
        remove_pid_file()

def show_help():
    """显示帮助信息"""
    print(__doc__)

def main():
    """主函数"""
    if len(sys.argv) < 2:
        # 没有参数时，默认启动服务器
        start_server()
    else:
        command = sys.argv[1].lower()
        
        if command == 'start':
            start_server()
        elif command == 'stop':
            stop_server()
        elif command == 'status':
            show_status()
        elif command in ['help', '--help', '-h']:
            show_help()
        else:
            print(f"❌ 未知命令: {command}")
            print()
            show_help()
            sys.exit(1)

if __name__ == '__main__':
    main()

