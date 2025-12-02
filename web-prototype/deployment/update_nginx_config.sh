#!/bin/bash
# 在服务器上执行的nginx.conf更新脚本

NGINX_CONF_PATH="$1"
NEW_SERVER_BLOCK="$2"
DOMAIN="$3"

# 备份原文件
if [ -f "$NGINX_CONF_PATH" ]; then
    cp "$NGINX_CONF_PATH" "${NGINX_CONF_PATH}.backup.$(date +%Y%m%d_%H%M%S)"
fi

# 如果文件不存在，创建基本结构
if [ ! -f "$NGINX_CONF_PATH" ]; then
    mkdir -p "$(dirname "$NGINX_CONF_PATH")"
    cat > "$NGINX_CONF_PATH" << 'EOF'
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    sendfile on;
    keepalive_timeout 65;
}
EOF
fi

# 删除旧的配置块
sed -i "/# 智能飞机杯控制原型 - ${DOMAIN}/,/^    }$/d" "$NGINX_CONF_PATH"

# 在http块的最后一个}之前插入新配置
# 找到最后一个}（在http块内）
LAST_CLOSE_BRACE=$(grep -n "^}$" "$NGINX_CONF_PATH" | tail -1 | cut -d: -f1)

if [ -n "$LAST_CLOSE_BRACE" ]; then
    # 在最后一个}之前插入
    sed -i "${LAST_CLOSE_BRACE}i\\
${NEW_SERVER_BLOCK}
" "$NGINX_CONF_PATH"
else
    # 如果没有找到}，追加到文件末尾
    echo "$NEW_SERVER_BLOCK" >> "$NGINX_CONF_PATH"
    echo "}" >> "$NGINX_CONF_PATH"
fi

echo "nginx.conf已更新"


