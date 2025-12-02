# Official Next.js 网站部署说明

## 概述

`deploy.sh` 用于部署 `official/` 目录下的 Next.js 项目到服务器。

**目录结构说明：**
- `official/` - Next.js 项目（与 `portal/` 平级）
- `portal/` - 静态 HTML 网站

## 使用方法

```bash
cd official/deployment
./deploy.sh
```

## 部署流程

脚本会自动执行以下步骤：

1. **检查本地文件** - 验证 Next.js 项目目录和关键文件
2. **构建项目** - 在本地执行 `npm run build` 生成生产构建
3. **检查 SSH 连接** - 验证与服务器的连接
4. **准备服务器目录** - 创建目标目录并备份现有文件
5. **上传文件** - 使用 rsync 上传构建产物和必要文件
6. **安装依赖** - 在服务器上安装生产依赖
7. **设置权限** - 配置正确的文件权限

## 上传的文件

脚本会上传以下内容：

- ✅ `.next/` - Next.js 构建产物
- ✅ `public/` - 静态资源文件
- ✅ `package.json` 和 `package-lock.json` - 依赖配置
- ✅ `next.config.js` - Next.js 配置
- ✅ `src/` - 源代码
- ✅ 其他配置文件（tsconfig.json, tailwind.config.ts 等）

排除的文件：

- ❌ `node_modules/` - 将在服务器上重新安装
- ❌ `.next/cache/` - 缓存文件
- ❌ `.git/` - Git 仓库
- ❌ `deployment/` - 部署脚本目录
- ❌ `assets/`, `css/`, `js/` - 旧静态网站资源

## 服务器要求

### 必须安装的软件

1. **Node.js** - 推荐版本 18.x 或更高
2. **npm** - 通常随 Node.js 一起安装

### 服务器配置步骤

部署脚本上传文件后，系统管理员需要完成以下步骤：

#### 1. 安装生产依赖

```bash
cd /var/www/portal-official
npm ci --production
```

#### 2. 使用进程管理器启动应用

**使用 PM2（推荐）:**

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
cd /var/www/portal-official
pm2 start npm --name "portal-official" -- start

# 设置开机自启
pm2 startup
pm2 save
```

**使用 systemd:**

创建 `/etc/systemd/system/portal-official.service`:

```ini
[Unit]
Description=Portal Official Next.js App
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/portal-official
ExecStart=/usr/bin/npm start
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

然后启动服务：

```bash
sudo systemctl daemon-reload
sudo systemctl enable portal-official
sudo systemctl start portal-official
```

#### 3. 配置 Nginx 反向代理

创建或编辑 Nginx 配置文件（例如 `/etc/nginx/sites-available/portal-official`）:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

启用配置：

```bash
sudo ln -s /etc/nginx/sites-available/portal-official /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 4. 配置 SSL 证书（可选但推荐）

使用 Let's Encrypt:

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 服务器路径

- **部署路径**: `/var/www/portal-official`
- **备份路径**: `/var/www/portal-official.backup/`

## 故障排查

### 构建失败

如果本地构建失败，检查：
- Node.js 版本是否符合要求
- 依赖是否正确安装：`npm install`
- 是否有编译错误

### 服务器连接失败

检查：
- 服务器 IP 地址是否正确
- 网络连接是否正常
- SSH 服务是否运行
- 防火墙是否允许 SSH 连接

### 应用无法启动

检查：
- Node.js 是否已安装：`node --version`
- 依赖是否已安装：`npm ci --production`
- 端口 3000 是否被占用
- 查看日志：`pm2 logs portal-official` 或 `journalctl -u portal-official`

## 更新部署

每次更新后，只需重新运行部署脚本：

```bash
./deploy-official.sh
```

脚本会自动：
- 备份现有文件
- 构建新版本
- 上传更新文件
- 在服务器上重新安装依赖

如果代码有更新，需要重启应用：

```bash
# 使用 PM2
pm2 restart portal-official

# 使用 systemd
sudo systemctl restart portal-official
```

## 注意事项

1. 确保服务器有足够的磁盘空间
2. 首次部署后需要手动配置 Nginx 和进程管理器
3. 建议使用 HTTPS 保护网站
4. 定期备份服务器上的文件
5. 监控应用运行状态和资源使用情况

