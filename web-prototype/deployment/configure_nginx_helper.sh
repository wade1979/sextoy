#!/bin/bash
# 辅助脚本：更新nginx.conf，添加新的server块

NGINX_CONF_PATH="$1"
NEW_SERVER_BLOCK="$2"
DOMAIN="$3"

# 检查nginx.conf是否存在
if [ ! -f "$NGINX_CONF_PATH" ]; then
    echo "创建新的nginx.conf文件..."
    mkdir -p "$(dirname "$NGINX_CONF_PATH")"
    cat > "$NGINX_CONF_PATH" << 'NGINX_BASE'
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    sendfile on;
    keepalive_timeout 65;
    
}
NGINX_BASE
fi

# 备份原文件
cp "$NGINX_CONF_PATH" "${NGINX_CONF_PATH}.backup.$(date +%Y%m%d_%H%M%S)"

# 删除旧的配置块（如果存在）
sed -i "/# 智能飞机杯控制原型 - ${DOMAIN}/,/^}$/d" "$NGINX_CONF_PATH"

# 在http块的最后一个}之前插入新配置
# 找到最后一个}（http块的结束）
if grep -q "^}$" "$NGINX_CONF_PATH"; then
    # 在最后一个}之前插入新配置
    sed -i "\$s/^}/$NEW_SERVER_BLOCK\n}/" "$NGINX_CONF_PATH"
else
    # 如果文件格式不对，追加到文件末尾
    echo "$NEW_SERVER_BLOCK" >> "$NGINX_CONF_PATH"
    echo "}" >> "$NGINX_CONF_PATH"
fi

echo "nginx.conf已更新"


