# 部署指南 - 公网服务器部署

本指南将帮助你将智能飞机杯控制原型部署到公网服务器上。

## 📋 项目结构说明

这是一个**纯前端项目**，包含：
- ✅ HTML文件 (`index.html`, `demo.html`)
- ✅ CSS样式文件 (`styles.css`)
- ✅ JavaScript逻辑文件 (`app.js`, `mqtt.js`, `characters.js`, `idols.js` 等)
- ✅ 静态资源文件夹 (`resource/` - 包含图片、视频等)
- ✅ Service Worker (`sw.js`) - 用于PWA功能

**无需后端服务器**，但需要：
- HTTP服务器（用于提供静态文件）
- HTTPS（推荐，某些Web API需要安全上下文）

---

## 🚀 部署方式

### 方式一：使用 Nginx（推荐）

#### 1. 上传文件到服务器

```bash
# 在服务器上创建目录
sudo mkdir -p /var/www/sextoy-prototype

# 上传 web-prototype 目录下的所有文件
# 可以使用 scp、rsync 或 Git 等方式上传
scp -r web-prototype/* user@your-server.com:/var/www/sextoy-prototype/
```

#### 2. 配置 Nginx

创建 Nginx 配置文件：

```bash
sudo nano /etc/nginx/sites-available/sextoy-prototype
```

添加以下配置：

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 替换为你的域名或IP
    
    # 如果需要HTTPS，取消注释以下部分
    # listen 443 ssl http2;
    # ssl_certificate /path/to/your/certificate.crt;
    # ssl_certificate_key /path/to/your/private.key;
    
    root /var/www/sextoy-prototype;
    index index.html;
    
    # 启用gzip压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_min_length 1000;
    
    # CORS支持（如果API需要）
    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'Content-Type' always;
    
    # 处理所有路由到index.html（单页应用）
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 缓存静态资源
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|mp4|mov|webp)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    # 特殊处理 favicon.ico（避免404错误）
    location = /favicon.ico {
        log_not_found off;
        access_log off;
    }
    
    # 处理Service Worker（不能缓存）
    location = /sw.js {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }
    
    # 日志文件
    access_log /var/log/nginx/sextoy-prototype-access.log;
    error_log /var/log/nginx/sextoy-prototype-error.log;
}
```

#### 3. 启用站点

```bash
# 创建符号链接
sudo ln -s /etc/nginx/sites-available/sextoy-prototype /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启Nginx
sudo systemctl restart nginx
```

#### 4. 设置文件权限

```bash
# 设置正确的文件所有者
sudo chown -R www-data:www-data /var/www/sextoy-prototype

# 设置文件权限
sudo chmod -R 755 /var/www/sextoy-prototype
```

---

### 方式二：使用 Apache

#### 1. 上传文件到服务器

```bash
sudo mkdir -p /var/www/sextoy-prototype
# 上传文件...
```

#### 2. 配置 Apache

创建 Apache 虚拟主机配置：

```bash
sudo nano /etc/apache2/sites-available/sextoy-prototype.conf
```

添加以下配置：

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /var/www/sextoy-prototype
    
    # 启用重写引擎（用于SPA路由）
    <Directory /var/www/sextoy-prototype>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
        
        # 重写规则：所有请求都指向index.html
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
    
    # CORS支持
    Header always set Access-Control-Allow-Origin "*"
    Header always set Access-Control-Allow-Methods "GET, POST, OPTIONS"
    Header always set Access-Control-Allow-Headers "Content-Type"
    
    # 启用gzip压缩
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
    </IfModule>
    
    # 缓存静态资源
    <IfModule mod_expires.c>
        ExpiresActive On
        ExpiresByType image/jpg "access plus 30 days"
        ExpiresByType image/jpeg "access plus 30 days"
        ExpiresByType image/png "access plus 30 days"
        ExpiresByType image/gif "access plus 30 days"
        ExpiresByType video/mp4 "access plus 30 days"
        ExpiresByType video/quicktime "access plus 30 days"
        ExpiresByType text/css "access plus 30 days"
        ExpiresByType application/javascript "access plus 30 days"
    </IfModule>
    
    ErrorLog ${APACHE_LOG_DIR}/sextoy-prototype-error.log
    CustomLog ${APACHE_LOG_DIR}/sextoy-prototype-access.log combined
</VirtualHost>
```

#### 3. 启用必要的模块和站点

```bash
# 启用必要的模块
sudo a2enmod rewrite
sudo a2enmod headers
sudo a2enmod expires
sudo a2enmod deflate

# 启用站点
sudo a2ensite sextoy-prototype.conf

# 测试配置
sudo apache2ctl configtest

# 重启Apache
sudo systemctl restart apache2
```

---

### 方式三：使用 Node.js 静态服务器（简单快速）

适合快速测试或小型项目：

#### 1. 安装 serve

```bash
npm install -g serve
```

#### 2. 上传文件并运行

```bash
cd /var/www/sextoy-prototype
serve -s . -l 8080
```

#### 3. 使用 PM2 保持运行

```bash
# 安装 PM2
npm install -g pm2

# 使用 PM2 运行
pm2 serve /var/www/sextoy-prototype 8080 --name sextoy-prototype --spa

# 设置开机自启
pm2 startup
pm2 save
```

---

## 🔒 HTTPS 配置（强烈推荐）

某些Web API（如语音识别、Service Worker）需要HTTPS才能正常工作。

### 使用 Let's Encrypt（免费SSL证书）

```bash
# 安装 Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx
# 或 Apache
sudo apt-get install certbot python3-certbot-apache

# 为 Nginx 获取证书
sudo certbot --nginx -d your-domain.com

# 为 Apache 获取证书
sudo certbot --apache -d your-domain.com

# 自动续期（已自动配置）
sudo certbot renew --dry-run
```

---

## 📁 目录结构

部署后的目录结构应该是：

```
/var/www/sextoy-prototype/
├── index.html          # 主页面
├── demo.html          # 演示页面
├── styles.css         # 样式文件
├── app.js             # 主应用逻辑
├── mqtt.js            # MQTT客户端
├── characters.js      # 角色数据
├── idols.js           # 偶像数据
├── manifest.json      # PWA清单
├── sw.js              # Service Worker
├── resource/          # 静态资源
│   ├── ai/           # AI角色资源
│   └── idol/         # 偶像资源
└── ...
```

---

## ⚙️ 配置检查清单

部署前请确认：

- [ ] 所有文件已上传到服务器
- [ ] 文件权限设置正确（755）
- [ ] Web服务器配置正确
- [ ] CORS头已配置（如果需要）
- [ ] HTTPS已配置（推荐）
- [ ] 域名DNS已解析到服务器IP
- [ ] 防火墙已开放80和443端口

---

## 🔍 故障排查

### 1. 页面404错误

- 检查文件是否已上传
- 检查Nginx/Apache配置中的`root`路径是否正确
- 检查文件权限

### 2. 资源文件加载失败（图片、视频）

- 检查`resource/`目录是否存在
- 检查文件路径大小写（Linux区分大小写）
- 检查文件权限

### 3. CORS错误

- 确认CORS头已正确配置
- 检查浏览器控制台的错误信息

### 4. Service Worker注册失败

- 确认使用HTTPS（或localhost）
- 检查`sw.js`文件是否存在
- 检查文件权限

### 5. 语音识别不工作

- 某些浏览器需要HTTPS才能使用语音API
- 检查浏览器是否支持Web Speech API

---

## 🚀 快速部署脚本

部署脚本位于 `web-prototype/deployment/deploy.sh`，使用方法：

```bash
cd web-prototype/deployment
chmod +x deploy.sh
./deploy.sh
```

或指定版本：

```bash
cd web-prototype/deployment
./deploy.sh v1.0.0
```

---

## 🔌 MQTT WebSocket 配置（可选）

如果你的应用需要使用MQTT功能连接到设备，需要配置WebSocket代理。

### Nginx WebSocket 代理配置

在你的Nginx配置中添加：

```nginx
# MQTT WebSocket代理
location /mqtt {
    proxy_pass http://your-mqtt-broker:9001;  # MQTT WebSocket端口
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_read_timeout 86400;  # 24小时，保持长连接
}
```

### Apache WebSocket 代理配置

对于Apache，需要启用`mod_proxy_wstunnel`：

```apache
# 启用WebSocket代理模块
LoadModule proxy_wstunnel_module modules/mod_proxy_wstunnel.so

# MQTT WebSocket代理
ProxyPass /mqtt ws://your-mqtt-broker:9001/mqtt
ProxyPassReverse /mqtt ws://your-mqtt-broker:9001/mqtt
```

**注意**：
- 需要有一个MQTT Broker服务器（如Mosquitto、EMQX等）
- WebSocket端口通常是9001（非加密）或9443（加密）
- 确保MQTT Broker已配置WebSocket支持

---

## 📝 注意事项

1. **资源文件大小**：视频文件可能很大，确保服务器有足够空间
2. **带宽**：考虑使用CDN来加速资源加载
3. **缓存策略**：合理设置缓存时间，平衡性能和更新
4. **安全性**：虽然这是前端项目，但仍建议使用HTTPS
5. **备份**：定期备份服务器上的文件
6. **MQTT连接**：如果不需要实时控制设备，MQTT功能可以保持未连接状态，应用仍可正常使用其他功能

---

## 🎯 推荐架构

```
用户浏览器
    ↓ HTTPS
Nginx (反向代理)
    ↓
静态文件服务 (/var/www/sextoy-prototype)
    ↓
CDN (可选，加速资源加载)
```

---

## 📞 需要帮助？

如果遇到问题：
1. 检查服务器日志（Nginx/Apache错误日志）
2. 检查浏览器控制台
3. 确认网络连接
4. 验证文件完整性

---

**部署完成后，你的原型就可以通过公网访问了！** 🎉

