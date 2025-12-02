# Portal 部署详细指南

本指南详细说明如何将 Portal 营销网站部署到云端服务器。

## 📋 部署信息

- **服务器IP**: 8.136.36.194
- **登录用户**: root
- **部署路径**: `/var/www/portal`
- **网站类型**: 静态网站（HTML/CSS/JavaScript）

## 🚀 完整部署流程

### 第一步：检查本地环境

确保本地 portal 目录包含所有必要的文件：

```bash
cd /Users/huangwei/projects/sextoy/portal
ls -la
```

应该看到以下关键文件：
- `index.html`
- `product.html`
- `how-it-works.html`
- `faq.html`
- `purchase.html`
- `brand-story.html`
- `policies.html`
- `feedback.html`
- `css/main.css`
- `css/pages.css`
- `js/main.js`
- `js/docs.js`

### 第二步：运行部署脚本

```bash
cd portal/deployment
./deploy.sh
```

部署脚本会自动执行以下操作：

1. **检查本地文件** - 验证所有必要文件是否存在
2. **安装工具** - 自动安装 sshpass（如果未安装）
3. **检查连接** - 验证 SSH 连接到服务器
4. **准备目录** - 在服务器上创建目标目录并备份现有文件
5. **上传文件** - 使用 rsync 上传所有文件
6. **设置权限** - 设置正确的文件权限

### 第三步：通知系统管理员配置 Nginx

部署脚本只负责文件上传，Nginx 配置需要系统管理员手动完成。

**需要告诉系统管理员的信息：**
- 网站文件位置：`/var/www/portal`
- 网站类型：静态网站（纯 HTML/CSS/JS）
- 入口文件：`index.html`

**Nginx 配置示例（供管理员参考）：**

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 替换为实际域名或 IP

    root /var/www/portal;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    # 静态资源缓存
    location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

配置完成后，需要：
1. 测试 Nginx 配置：`nginx -t`
2. 重新加载 Nginx：`systemctl reload nginx` 或 `nginx -s reload`
3. 测试网站访问

## 📁 服务器目录结构

部署后的目录结构：

```
/var/www/
├── portal/                    # 网站文件（当前版本）
│   ├── index.html
│   ├── product.html
│   ├── css/
│   ├── js/
│   ├── assets/
│   └── ...
└── portal.backup/             # 备份目录
    └── portal_backup_YYYYMMDD_HHMMSS/  # 自动备份的旧版本
```

## 🔄 更新部署

当需要更新网站时，只需重新运行部署脚本：

```bash
cd portal/deployment
./deploy.sh
```

脚本会自动：
- 备份现有文件
- 上传新文件
- 保留旧版本备份（在 `/var/www/portal.backup/` 目录中）

## 🛠️ 手动操作（高级）

如果需要手动执行某些步骤：

### 连接到服务器

```bash
ssh root@8.136.36.194
# 密码: Feelnova#2020515
```

### 检查部署的文件

```bash
ls -la /var/www/portal
```

### 查看备份

```bash
ls -la /var/www/portal.backup/
```

### 恢复备份

如果需要恢复之前的版本：

```bash
# 查看备份列表
ls -la /var/www/portal.backup/

# 恢复指定备份（替换 BACKUP_NAME）
cp -r /var/www/portal.backup/BACKUP_NAME/* /var/www/portal/
```

### 设置文件权限

如果需要手动设置权限：

```bash
cd /var/www/portal
find . -type d -exec chmod 755 {} \;
find . -type f -exec chmod 644 {} \;
```

## 🐛 故障排除

### 问题 1: SSH 连接失败

**错误信息：**
```
无法连接到服务器
```

**解决方案：**
1. 检查服务器 IP 地址是否正确：`8.136.36.194`
2. 检查网络连接：`ping 8.136.36.194`
3. 检查 SSH 服务是否运行（联系系统管理员）
4. 检查防火墙设置（联系系统管理员）

### 问题 2: 权限 denied

**错误信息：**
```
Permission denied (publickey,password)
```

**解决方案：**
1. 确认用户名正确：`root`
2. 确认密码正确：`Feelnova#2020515`
3. 检查服务器是否允许密码登录（联系系统管理员）

### 问题 3: 文件上传失败

**错误信息：**
```
rsync: connection unexpectedly closed
```

**解决方案：**
1. 检查服务器磁盘空间：`df -h`
2. 检查目标目录权限
3. 检查网络连接稳定性
4. 重试部署脚本

### 问题 4: 文件权限错误

**错误信息：**
```
403 Forbidden
```

**解决方案：**
1. 检查文件权限是否正确设置
2. 确保 Nginx 用户（通常是 `www-data` 或 `nginx`）有读取权限
3. 检查 SELinux 设置（如果启用）

### 问题 5: 网站无法访问

**可能原因：**
1. Nginx 未配置或配置错误
2. Nginx 服务未运行
3. 防火墙阻止访问
4. 域名 DNS 未配置

**解决方案：**
1. 联系系统管理员检查 Nginx 配置
2. 检查 Nginx 服务状态：`systemctl status nginx`
3. 检查防火墙规则（联系系统管理员）
4. 检查 DNS 配置（联系系统管理员）

## 📝 注意事项

1. **备份机制**：每次部署都会自动备份现有文件，备份保存在 `/var/www/portal.backup/` 目录中
2. **文件排除**：部署时自动排除以下内容：
   - `.git` 目录
   - `*.log` 文件
   - `.DS_Store` 文件
   - `deployment` 目录
   - `*.md` 文档文件
3. **Nginx 配置**：本脚本不包含 Nginx 配置，需要系统管理员手动完成
4. **安全性**：部署脚本包含服务器密码，请妥善保管，不要提交到公开代码库

## 🔒 安全建议

1. **密码管理**：建议使用 SSH 密钥认证替代密码认证
2. **文件权限**：确保文件权限设置正确，避免过宽权限
3. **定期备份**：定期检查备份目录，删除过旧的备份文件
4. **访问控制**：通过 Nginx 配置适当的访问控制和安全头

## 📞 支持

如果遇到问题：
1. 查看本文档的故障排除部分
2. 检查服务器日志：`/var/log/nginx/error.log`
3. 联系系统管理员




