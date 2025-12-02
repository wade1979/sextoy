#!/bin/bash

# 部署脚本 - 将智能飞机杯控制原型部署到云端服务器
# 使用方法: ./deploy.sh [version]
# 例如: ./deploy.sh v1.0.0

set -e  # 遇到错误立即退出

# ==================== 配置区域 ====================
SERVER_IP="8.136.36.194"
SERVER_USER="root"
SERVER_PASSWORD="Feelnova#2020515"
DOMAIN="prototype.feelnova-ai.com"
LOCAL_PATH=".."
REMOTE_BASE_PATH="/var/www/sextoy-prototype"
VERSION="${1:-v1.0.0}"  # 默认版本号，可以从命令行参数传入

# 注意：Docker和Nginx配置需要手动完成

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ==================== 辅助函数 ====================
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 检查本地文件是否存在
check_local_files() {
    print_info "检查本地文件..."
    
    if [ ! -d "$LOCAL_PATH" ]; then
        print_error "本地目录不存在: $LOCAL_PATH"
        exit 1
    fi
    
    if [ ! -f "$LOCAL_PATH/index.html" ]; then
        print_error "找不到主文件: $LOCAL_PATH/index.html"
        exit 1
    fi
    
    print_success "本地文件检查通过"
}

# 安装必要的工具
install_sshpass() {
    if ! command -v sshpass &> /dev/null; then
        print_info "安装 sshpass..."
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            if command -v brew &> /dev/null; then
                brew install hudochenkov/sshpass/sshpass
            else
                print_error "请先安装 Homebrew，然后运行: brew install hudochenkov/sshpass/sshpass"
                exit 1
            fi
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            # Linux
            sudo apt-get update && sudo apt-get install -y sshpass
        else
            print_error "不支持的操作系统，请手动安装 sshpass"
            exit 1
        fi
    fi
}

# 检查SSH连接
check_ssh_connection() {
    print_info "检查SSH连接..."
    
    if sshpass -p "$SERVER_PASSWORD" ssh -o StrictHostKeyChecking=no -o ConnectTimeout=5 \
        $SERVER_USER@$SERVER_IP "echo 'Connection successful'" > /dev/null 2>&1; then
        print_success "SSH连接成功"
        return 0
    else
        print_error "无法连接到服务器，请检查："
        print_error "  1. 服务器IP地址是否正确: $SERVER_IP"
        print_error "  2. 网络连接是否正常"
        print_error "  3. 服务器是否允许SSH连接"
        exit 1
    fi
}

# 在服务器上执行命令（带密码）
ssh_exec() {
    sshpass -p "$SERVER_PASSWORD" ssh -o StrictHostKeyChecking=no \
        $SERVER_USER@$SERVER_IP "$1"
}

# 在服务器上执行命令（交互式，用于需要交互的场景）
ssh_exec_interactive() {
    ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "$1"
}

# 复制文件到服务器
scp_copy() {
    local source="$1"
    local dest="$2"
    
    sshpass -p "$SERVER_PASSWORD" scp -o StrictHostKeyChecking=no -r "$source" \
        $SERVER_USER@$SERVER_IP:"$dest"
}

# 在服务器上准备目录结构
prepare_server_directories() {
    print_info "准备服务器目录结构..."
    
    ssh_exec "
        # 创建基础目录
        mkdir -p $REMOTE_BASE_PATH/versions
        mkdir -p $REMOTE_BASE_PATH/current
        
        # 创建版本目录
        mkdir -p $REMOTE_BASE_PATH/versions/$VERSION
        
        # 设置权限
        chmod -R 755 $REMOTE_BASE_PATH
        
        echo '目录结构准备完成'
    "
    
    print_success "服务器目录准备完成"
}

# 上传文件到服务器
upload_files() {
    print_info "上传文件到服务器 (版本: $VERSION)..."
    
    # 创建临时目录
    TEMP_DIR=$(mktemp -d)
    
    # 复制文件到临时目录（排除不需要的文件）
    rsync -av --exclude='node_modules' \
          --exclude='.git' \
          --exclude='*.log' \
          --exclude='.DS_Store' \
          --exclude='.server.pid' \
          "$LOCAL_PATH/" "$TEMP_DIR/"
    
    # 上传到服务器
    print_info "正在上传文件（这可能需要几分钟，取决于文件大小）..."
    
    sshpass -p "$SERVER_PASSWORD" rsync -avz --progress \
        --exclude='node_modules' \
        --exclude='.git' \
        --exclude='*.log' \
        --exclude='.DS_Store' \
        "$LOCAL_PATH/" \
        $SERVER_USER@$SERVER_IP:"$REMOTE_BASE_PATH/versions/$VERSION/"
    
    # 清理临时目录
    rm -rf "$TEMP_DIR"
    
    print_success "文件上传完成"
}

# 创建版本符号链接
create_version_link() {
    print_info "创建版本符号链接..."
    
    # 先检查并处理current（可能是目录）
    print_info "检查current状态..."
    CURRENT_TYPE=$(ssh_exec "
        cd $REMOTE_BASE_PATH
        if [ -L current ]; then
            echo 'symlink'
        elif [ -d current ]; then
            echo 'directory'
        elif [ -f current ]; then
            echo 'file'
        else
            echo 'not_exists'
        fi
    " | tr -d '\r\n')
    
    if [ "$CURRENT_TYPE" = "directory" ]; then
        print_warning "检测到current是目录，正在备份并删除..."
        ssh_exec "
            cd $REMOTE_BASE_PATH
            BACKUP_NAME=\"current.backup.\$(date +%Y%m%d_%H%M%S)\"
            mv current \"\$BACKUP_NAME\" 2>/dev/null || rm -rf current
            echo '目录已备份或删除'
        "
    elif [ "$CURRENT_TYPE" = "symlink" ] || [ "$CURRENT_TYPE" = "file" ]; then
        print_info "删除旧的current（符号链接或文件）..."
        ssh_exec "
            cd $REMOTE_BASE_PATH
            rm -f current
        "
    fi
    
    # 创建新版本链接
    print_info "创建新版本符号链接..."
    ssh_exec "
        cd $REMOTE_BASE_PATH
        
        # 确保versions目录存在
        if [ ! -d \"versions/$VERSION\" ]; then
            echo '错误: 版本目录不存在: versions/$VERSION'
            exit 1
        fi
        
        # 创建符号链接
        ln -s versions/$VERSION current
        
        # 验证链接是否创建成功
        if [ -L current ] && [ -d current ]; then
            echo '符号链接创建成功'
            ls -la current | head -1
        else
            echo '错误: 符号链接创建失败'
            exit 1
        fi
    "
    
    if [ $? -eq 0 ]; then
        print_success "版本链接创建完成"
    else
        print_error "版本链接创建失败"
        exit 1
    fi
}

# 设置文件权限
set_permissions() {
    print_info "设置文件权限..."
    
    ssh_exec "
        # 设置通用权限
        chmod -R 755 $REMOTE_BASE_PATH
        
        # 确保资源目录可读
        find $REMOTE_BASE_PATH -type f -exec chmod 644 {} \;
        find $REMOTE_BASE_PATH -type d -exec chmod 755 {} \;
        
        echo '权限设置完成'
    "
    
    print_success "文件权限设置完成"
}

# 注意：Docker和Nginx配置需要手动完成，此脚本只负责文件上传

# 显示部署信息
show_deployment_info() {
    print_success "=========================================="
    print_success "部署完成！"
    print_success "=========================================="
    echo ""
    print_info "服务器信息:"
    echo "  - 服务器IP: $SERVER_IP"
    echo "  - 域名: $DOMAIN"
    echo "  - 版本: $VERSION"
    echo ""
    print_info "文件位置:"
    echo "  - 版本文件: $REMOTE_BASE_PATH/versions/$VERSION/"
    echo "  - 当前链接: $REMOTE_BASE_PATH/current -> versions/$VERSION"
    echo ""
    print_warning "后续步骤（需要手动完成）:"
    echo "  1. 配置Web服务器（Nginx/Apache等）指向: $REMOTE_BASE_PATH/current"
    echo "  2. 如果使用Docker，确保有volume挂载: $REMOTE_BASE_PATH"
    echo "  3. 配置域名和端口（建议使用8080/8443避免ICP备案）"
    echo "  4. 测试访问应用"
    echo ""
    print_info "文件上传完成，请手动配置Web服务器"
    echo ""
}

# ==================== 主部署流程 ====================
main() {
    echo ""
    print_info "=========================================="
    print_info "开始部署智能飞机杯控制原型"
    print_info "=========================================="
    echo ""
    
    # 1. 检查本地文件
    check_local_files
    
    # 2. 安装必要工具
    install_sshpass
    
    # 3. 检查SSH连接
    check_ssh_connection
    
    # 4. 准备服务器目录
    prepare_server_directories
    
    # 5. 上传文件
    upload_files
    
    # 6. 创建版本链接
    create_version_link
    
    # 7. 设置权限
    set_permissions
    
    # 8. 显示部署信息
    show_deployment_info
    
    print_success "所有步骤完成！"
}

# 运行主函数
main

