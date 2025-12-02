#!/bin/bash

# Docker Nginx配置辅助脚本
# 用于设置Docker Nginx的volume挂载，使容器可以访问宿主机文件

set -e

# 配置
SERVER_IP="8.136.36.194"
SERVER_USER="root"
SERVER_PASSWORD="Feelnova#2020515"
REMOTE_BASE_PATH="/var/www/sextoy-prototype"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

ssh_exec() {
    sshpass -p "$SERVER_PASSWORD" ssh -o StrictHostKeyChecking=no \
        $SERVER_USER@$SERVER_IP "$1"
}

print_info "=========================================="
print_info "Docker Nginx Volume挂载配置"
print_info "=========================================="
echo ""

print_info "检测当前Docker Nginx容器..."

# 自动检测Nginx容器
NGINX_CONTAINER=$(ssh_exec "docker ps --format '{{.Names}}' | grep -i nginx | head -n1" | tr -d '\r\n')

if [ -z "$NGINX_CONTAINER" ]; then
    print_error "未找到运行中的Nginx容器"
    print_info "当前运行的容器："
    ssh_exec "docker ps"
    exit 1
fi

print_success "找到Nginx容器: $NGINX_CONTAINER"

# 检查当前挂载
print_info "检查当前容器挂载..."
ssh_exec "docker inspect $NGINX_CONTAINER --format '{{json .Mounts}}' | python3 -m json.tool 2>/dev/null || docker inspect $NGINX_CONTAINER --format '{{json .Mounts}}'"

echo ""
print_warning "有两种方式使Docker Nginx访问文件："
echo ""
echo "方法1: Volume挂载（推荐，需要重启容器）"
echo "方法2: 使用docker cp复制配置文件（不需要挂载文件）"
echo ""

read -p "选择方法 (1/2): " method

if [ "$method" == "1" ]; then
    print_info "配置Volume挂载..."
    echo ""
    print_warning "需要重新创建Docker容器以添加volume挂载"
    print_info "请手动执行以下步骤："
    echo ""
    echo "1. 停止当前容器:"
    echo "   docker stop $NGINX_CONTAINER"
    echo ""
    echo "2. 查看当前容器配置:"
    echo "   docker inspect $NGINX_CONTAINER"
    echo ""
    echo "3. 重新创建容器并添加volume挂载:"
    echo "   docker run -d \\"
    echo "     --name ${NGINX_CONTAINER}_new \\"
    echo "     -v $REMOTE_BASE_PATH:$REMOTE_BASE_PATH:ro \\"
    echo "     -p 8080:8080 -p 8443:8443 \\"
    echo "     [其他原有参数] \\"
    echo "     [nginx镜像]"
    echo ""
    echo "4. 或者使用docker-compose.yml配置（推荐）"
    echo ""
    
elif [ "$method" == "2" ]; then
    print_info "使用docker cp方式（不需要volume挂载）"
    print_success "配置完成！部署脚本会自动使用docker cp复制配置文件"
    echo ""
    print_info "注意："
    echo "  - 文件需要映射到容器内的相同路径"
    echo "  - 或者修改Nginx配置中的root路径"
    echo ""
fi

print_info "生成docker-compose.yml示例..."

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUTPUT_FILE="$SCRIPT_DIR/docker-compose.example.yml"

COMPOSE_YAML="version: '3.8'

services:
  nginx:
    image: nginx:alpine
    container_name: nginx-gateway
    restart: unless-stopped
    ports:
      - \"8080:8080\"
      - \"8443:8443\"
    volumes:
      # 挂载项目文件（只读）
      - $REMOTE_BASE_PATH:$REMOTE_BASE_PATH:ro
      # 挂载Nginx配置
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      # 挂载SSL证书（如果有）
      - ./nginx/ssl:/etc/nginx/ssl:ro
      # 日志目录
      - ./nginx/logs:/var/log/nginx
    networks:
      - web

networks:
  web:
    driver: bridge
"

echo "$COMPOSE_YAML" > "$OUTPUT_FILE"
print_success "已生成 docker-compose.example.yml 示例文件"
print_info "文件位置: $OUTPUT_FILE"

