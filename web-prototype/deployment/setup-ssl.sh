#!/bin/bash

# SSL证书配置脚本 - 为域名配置HTTPS
# 使用方法: ./setup-ssl.sh

set -e

# 配置
SERVER_IP="8.136.36.194"
SERVER_USER="root"
SERVER_PASSWORD="Feelnova#2020515"
DOMAIN="prototype.feelnova-ai.com"

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

# SSH执行命令
ssh_exec() {
    sshpass -p "$SERVER_PASSWORD" ssh -o StrictHostKeyChecking=no \
        $SERVER_USER@$SERVER_IP "$1"
}

print_info "=========================================="
print_info "配置HTTPS证书 (Let's Encrypt)"
print_info "=========================================="
echo ""

print_warning "前置条件检查："
echo "  1. 域名 $DOMAIN 必须已解析到服务器IP: $SERVER_IP"
echo "  2. 8080端口必须对外开放（HTTP用于验证）"
echo "  3. 如果使用Let's Encrypt，需要临时开放80端口用于验证"
echo ""
read -p "确认已满足以上条件？(y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_error "请先配置DNS解析，然后再运行此脚本"
    exit 1
fi

print_info "在服务器上安装Certbot..."

ssh_exec "
    # 更新系统
    apt-get update
    
    # 安装Certbot和Nginx插件
    apt-get install -y certbot python3-certbot-nginx
    
    echo 'Certbot安装完成'
"

print_info "申请SSL证书..."
print_warning "注意: Let's Encrypt需要80端口进行验证，但应用使用8080端口"
print_info "建议手动配置SSL证书或使用DNS验证方式"

ssh_exec "
    # 为域名申请证书（使用nginx插件）
    # 注意：如果Nginx不在标准80端口，可能需要手动配置或使用DNS验证
    certbot certonly --standalone -d $DOMAIN --non-interactive --agree-tos --email admin@feelnova-ai.com --preferred-challenges http
    
    echo '证书申请完成'
    echo '请手动配置Nginx使用8443端口和SSL证书'
"

print_info "配置自动续期..."

ssh_exec "
    # 测试自动续期
    certbot renew --dry-run
    
    echo '自动续期配置完成'
"

print_success "=========================================="
print_success "SSL证书申请完成！"
print_success "=========================================="
echo ""
print_info "访问地址:"
echo "  - HTTPS: https://$DOMAIN:8443/"
echo ""
print_warning "后续步骤:"
echo "  1. 在Nginx配置中添加SSL配置（listen 8443 ssl）"
echo "  2. 指向证书路径: /etc/letsencrypt/live/$DOMAIN/"
echo "  3. 重载Nginx配置"
echo ""
print_warning "注意:"
echo "  - 证书将在到期前自动续期"
echo "  - 如需手动续期: ssh到服务器运行 'certbot renew'"
echo ""

