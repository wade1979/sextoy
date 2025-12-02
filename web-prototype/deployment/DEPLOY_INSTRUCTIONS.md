# 快速部署指南

本指南将帮助你快速将项目部署到云端服务器 `prototype.feelnova-ai.com`。

## 📋 部署信息

- **服务器IP**: 8.136.36.194
- **登录用户**: root
- **域名**: prototype.feelnova-ai.com
- **部署路径**: `/var/www/sextoy-prototype/versions/{version}`

## 🚀 快速开始

### 第一步：配置DNS（首次部署）

在部署之前，需要先将域名解析到服务器IP。

#### 方法一：使用脚本查看配置说明

```bash
cd web-prototype/deployment
./setup-dns.sh
```

#### 方法二：手动配置

在你的DNS服务商（如阿里云、腾讯云、Cloudflare等）添加A记录：

- **记录类型**: A
- **主机记录**: `prototype`
- **记录值**: `8.136.36.194`
- **TTL**: 600（或默认值）

配置完成后，等待DNS生效（通常几分钟到几小时）。

验证DNS配置：

```bash
nslookup prototype.feelnova-ai.com
# 应该返回: 8.136.36.194
```

---

### 第二步：部署项目

#### 自动部署（推荐）

```bash
# 进入deployment目录
cd web-prototype/deployment

# 使用默认版本号部署
./deploy.sh

# 或指定版本号
./deploy.sh v1.0.0
./deploy.sh v2.0.0
```

部署脚本会自动完成：
1. ✅ 检查本地文件
2. ✅ 连接服务器
3. ✅ 安装Nginx（如未安装）
4. ✅ 创建目录结构
5. ✅ 上传文件
6. ✅ 配置Nginx
7. ✅ 设置权限

#### 首次运行可能需要安装 sshpass

**macOS:**
```bash
brew install hudochenkov/sshpass/sshpass
```

**Linux:**
```bash
sudo apt-get update && sudo apt-get install -y sshpass
```

---

### 第三步：配置HTTPS（推荐）

部署完成后，建议配置HTTPS证书。

```bash
cd web-prototype/deployment
./setup-ssl.sh
```

脚本会自动：
1. ✅ 安装Certbot
2. ✅ 申请Let's Encrypt免费证书
3. ✅ 配置Nginx使用HTTPS
4. ✅ 设置自动续期

**注意**: 运行此脚本前，确保DNS已正确解析到服务器IP。

---

## 📁 部署后的目录结构

```
/var/www/sextoy-prototype/
├── versions/
│   ├── v1.0.0/          # 版本1文件
│   ├── v2.0.0/          # 版本2文件
│   └── ...
└── current -> versions/v1.0.0/  # 当前版本的符号链接
```

## 🌐 访问地址

部署完成后，可以通过以下地址访问：

- **默认版本（current）**: http://prototype.feelnova-ai.com:8080/
- **指定版本**: http://prototype.feelnova-ai.com:8080/v1.0.0/
- **HTTPS**: https://prototype.feelnova-ai.com:8443/（配置SSL后）

**注意**: 使用非标准端口（8080/8443）以避免ICP备案要求。

## 🔄 版本管理

### 部署新版本

```bash
# 进入deployment目录并部署新版本（如v2.0.0）
cd web-prototype/deployment
./deploy.sh v2.0.0
```

新版本会保留旧版本，可以通过版本路径访问：
- `http://prototype.feelnova-ai.com/v1.0.0/` - 旧版本
- `http://prototype.feelnova-ai.com/v2.0.0/` - 新版本
- `http://prototype.feelnova-ai.com/` - 当前版本（指向最新）

### 切换当前版本

如果需要回退到旧版本，SSH到服务器：

```bash
ssh root@8.136.36.194

# 切换到指定版本
cd /var/www/sextoy-prototype
rm -f current
ln -s versions/v1.0.0 current

# 重新加载Nginx
systemctl reload nginx
```

---

## 🛠️ 手动部署（如果自动脚本失败）

如果自动部署脚本遇到问题，可以手动部署：

### 1. SSH连接服务器

```bash
ssh root@8.136.36.194
# 输入密码: Feelnova#2020515
```

### 2. 安装Nginx

```bash
apt-get update
apt-get install -y nginx
systemctl enable nginx
systemctl start nginx
```

### 3. 创建目录

```bash
mkdir -p /var/www/sextoy-prototype/versions/v1.0.0
mkdir -p /var/www/sextoy-prototype/current
```

### 4. 上传文件

从本地使用rsync或scp上传：

```bash
# 从本地运行
rsync -avz --exclude='node_modules' --exclude='.git' \
    ./web-prototype/ root@8.136.36.194:/var/www/sextoy-prototype/versions/v1.0.0/
```

### 5. 创建符号链接

```bash
# SSH到服务器后执行
cd /var/www/sextoy-prototype
ln -s versions/v1.0.0 current
chown -R www-data:www-data /var/www/sextoy-prototype
chmod -R 755 /var/www/sextoy-prototype
```

### 6. 配置Nginx

创建配置文件 `/etc/nginx/sites-available/sextoy-prototype.conf`：

```nginx
server {
    listen 8080;
    server_name prototype.feelnova-ai.com;
    
    root /var/www/sextoy-prototype/current;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|mp4|mov|webp)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

启用配置：

```bash
ln -s /etc/nginx/sites-available/sextoy-prototype.conf /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

---

## 🔍 故障排查

### 1. 无法连接服务器

- 检查网络连接
- 确认服务器IP是否正确
- 确认防火墙是否开放22端口

### 2. 文件上传失败

- 检查本地文件是否存在
- 确认服务器磁盘空间是否充足
- 检查SSH连接是否稳定

### 3. Nginx配置错误

```bash
# 测试配置
nginx -t

# 查看错误日志
tail -f /var/log/nginx/error.log
```

### 4. 网站无法访问

- 检查DNS是否解析正确
- 确认Nginx是否运行: `systemctl status nginx`
- 检查防火墙是否开放8080和8443端口
- 查看Nginx访问日志: `tail -f /var/log/nginx/access.log`

### 5. 权限问题

```bash
# 修复权限
chown -R www-data:www-data /var/www/sextoy-prototype
chmod -R 755 /var/www/sextoy-prototype
```

---

## 🔒 安全建议

1. **修改root密码**: 部署完成后，建议修改服务器root密码
2. **配置SSH密钥**: 使用SSH密钥登录，而不是密码
3. **配置防火墙**: 只开放必要的端口（22, 8080, 8443）
4. **定期更新**: 定期更新系统和软件包
5. **使用HTTPS**: 配置SSL证书，使用HTTPS访问

---

## 📞 需要帮助？

如果遇到问题：
1. 查看服务器日志: `/var/log/nginx/error.log`
2. 检查Nginx状态: `systemctl status nginx`
3. 验证DNS解析: `nslookup prototype.feelnova-ai.com`
4. 测试端口连接: `telnet 8.136.36.194 8080`

---

## ✅ 部署检查清单

- [ ] DNS已配置并生效
- [ ] 项目文件已上传
- [ ] Nginx配置正确
- [ ] 文件权限设置正确
- [ ] 网站可以访问
- [ ] HTTPS已配置（推荐）
- [ ] 防火墙规则已配置

部署完成后，你的项目就可以通过 `prototype.feelnova-ai.com:8080` 访问了！🎉

**注意**: 使用非标准端口（8080/8443）以避免ICP备案要求。

