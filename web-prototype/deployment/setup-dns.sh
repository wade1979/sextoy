#!/bin/bash

# DNS配置提示脚本
# 这个脚本不直接修改DNS，而是提供配置说明

# 配置
DOMAIN="prototype.feelnova-ai.com"
SERVER_IP="8.136.36.194"

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

echo ""
print_info "=========================================="
print_info "DNS配置指南"
print_info "=========================================="
echo ""

print_info "需要在DNS服务商处添加以下记录："
echo ""
echo "记录类型: A"
echo "主机记录: prototype"
echo "记录值: $SERVER_IP"
echo "TTL: 600 (或默认值)"
echo ""

print_warning "常见DNS服务商配置步骤："
echo ""
echo "1. 阿里云DNS:"
echo "   - 登录阿里云控制台"
echo "   - 进入云解析DNS"
echo "   - 找到域名 feelnova-ai.com"
echo "   - 添加A记录: prototype -> $SERVER_IP"
echo ""
echo "2. 腾讯云DNS:"
echo "   - 登录腾讯云控制台"
echo "   - 进入DNSPod"
echo "   - 找到域名 feelnova-ai.com"
echo "   - 添加记录: 主机记录=prototype, 记录类型=A, 记录值=$SERVER_IP"
echo ""
echo "3. Cloudflare:"
echo "   - 登录Cloudflare控制台"
echo "   - 选择域名 feelnova-ai.com"
echo "   - DNS -> Records -> Add record"
echo "   - Type: A, Name: prototype, Content: $SERVER_IP"
echo ""

print_info "验证DNS配置："
echo ""
echo "配置完成后，可以使用以下命令验证："
echo "  nslookup $DOMAIN"
echo "  dig $DOMAIN"
echo "  ping $DOMAIN"
echo ""

print_warning "注意："
echo "  - DNS配置可能需要几分钟到几小时生效（取决于TTL）"
echo "  - 全球生效可能需要更长时间"
echo ""


