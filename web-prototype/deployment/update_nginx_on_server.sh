#!/bin/bash
# 在服务器上执行的nginx.conf更新脚本

NGINX_CONF_PATH="$1"
DOMAIN="$2"
VERSION="$3"

# 新的server块配置
NEW_SERVER_BLOCK="# 智能飞机杯控制原型 - ${DOMAIN}
    # 版本: ${VERSION}
    server {
        listen 8080;
        server_name ${DOMAIN};
        
        root /var/www/sextoy-prototype/current;
        index index.html;
        
        gzip on;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;
        gzip_min_length 1000;
        
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Content-Type' always;
        
        location ~ ^/(v\\d+\\.\\d+\\.\\d+)/(.*)\$ {
            alias /var/www/sextoy-prototype/versions/\$1/\$2;
            try_files \$uri \$uri/ /versions/\$1/index.html;
        }
        
        location / {
            try_files \$uri \$uri/ /index.html;
        }
        
        location ~* \\.(jpg|jpeg|png|gif|ico|css|js|mp4|mov|webp)\$ {
            expires 30d;
            add_header Cache-Control \"public, immutable\";
        }
        
        location = /favicon.ico {
            log_not_found off;
            access_log off;
            return 204;
        }
        
        location = /sw.js {
            add_header Cache-Control \"no-cache, no-store, must-revalidate\";
            add_header Pragma \"no-cache\";
            add_header Expires \"0\";
        }
    }"

# 备份
if [ -f "$NGINX_CONF_PATH" ]; then
    cp "$NGINX_CONF_PATH" "${NGINX_CONF_PATH}.backup.$(date +%Y%m%d_%H%M%S)"
fi

# 如果文件不存在，创建
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

# 删除旧的配置块（如果存在）
sed -i "/# 智能飞机杯控制原型 - ${DOMAIN}/,/^    }$/d" "$NGINX_CONF_PATH"

# 在http块的最后一个}之前插入新配置
# 找到最后一个}（在http块内）
LAST_LINE=$(wc -l < "$NGINX_CONF_PATH")
# 在倒数第二行（最后的}之前）插入
sed -i "$((LAST_LINE - 1))a\\
${NEW_SERVER_BLOCK}
" "$NGINX_CONF_PATH"

echo "nginx.conf已更新: $NGINX_CONF_PATH"


