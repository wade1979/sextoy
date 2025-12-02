# Docker Nginx 部署指南

本指南适用于使用Docker Nginx作为总网关的场景。

## 📋 架构说明

```
用户浏览器
    ↓ HTTPS/HTTP (端口8443/8080)
Docker Nginx (网关，监听8080/8443端口)
    ↓ Volume挂载或文件访问
宿主机文件 (/var/www/sextoy-prototype/)
    ↓
静态文件服务
```

**注意**: 使用非标准端口（8080/8443）以避免ICP备案要求。

## 🔍 第一步：检查Docker Nginx容器

SSH到服务器，检查当前运行的Nginx容器：

```bash
ssh root@8.136.36.194

# 查看运行中的容器
docker ps

# 查看Nginx容器详细信息
docker ps --format '{{.Names}}' | grep -i nginx

# 查看容器挂载
docker inspect <nginx-container-name> --format '{{json .Mounts}}' | python3 -m json.tool
```

## 🔧 第二步：配置方案选择

有两种方式使Docker Nginx访问文件：

### 方案A：Volume挂载（推荐，适合长期使用）

将宿主机的文件目录挂载到Docker容器内，容器可以直接访问文件。

#### 1. 查看当前容器配置

```bash
docker inspect <nginx-container-name> > container-info.json
cat container-info.json
```

#### 2. 停止并重新创建容器（添加volume）

如果使用docker run启动的：

```bash
# 停止当前容器
docker stop <nginx-container-name>

# 备份当前容器（可选）
docker commit <nginx-container-name> nginx-backup

# 重新运行容器，添加volume挂载
docker run -d \
  --name nginx-gateway \
  -p 8080:8080 \
  -p 8443:8443 \
  -v /var/www/sextoy-prototype:/var/www/sextoy-prototype:ro \
  -v /path/to/nginx/conf.d:/etc/nginx/conf.d:ro \
  nginx:alpine
```

如果使用docker-compose，修改`docker-compose.yml`：

```yaml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    container_name: nginx-gateway
    restart: unless-stopped
    ports:
      - "8080:8080"
      - "8443:8443"
    volumes:
      # 挂载项目文件（只读）
      - /var/www/sextoy-prototype:/var/www/sextoy-prototype:ro
      # 挂载Nginx配置
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      # SSL证书（如果有）
      - ./nginx/ssl:/etc/nginx/ssl:ro
    networks:
      - web

networks:
  web:
    driver: bridge
```

然后重启：

```bash
docker-compose down
docker-compose up -d
```

### 方案B：使用docker cp（简单，适合临时部署）

不需要挂载文件，只在需要时复制配置文件到容器内。

部署脚本会自动使用这种方式。

## 🚀 第三步：运行部署脚本

使用修改后的部署脚本：

```bash
# 进入deployment目录
cd web-prototype/deployment

# 部署到默认版本
./deploy.sh

# 或指定版本
./deploy.sh v1.0.0
```

脚本会自动：
1. ✅ 检测Docker Nginx容器
2. ✅ 上传文件到宿主机
3. ✅ 生成Nginx配置
4. ✅ 使用`docker cp`复制配置到容器
5. ✅ 测试并重载Nginx配置

## 📝 手动配置Nginx（如果自动配置失败）

### 1. 在宿主机创建配置文件

```bash
ssh root@8.136.36.194

cat > /tmp/sextoy-prototype.conf << 'EOF'
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
EOF
```

### 2. 复制配置到Docker容器

```bash
# 复制到容器内的配置目录
docker cp /tmp/sextoy-prototype.conf <nginx-container-name>:/etc/nginx/conf.d/sextoy-prototype.conf

# 测试配置
docker exec <nginx-container-name> nginx -t

# 重载配置（不中断服务）
docker exec <nginx-container-name> nginx -s reload
```

### 3. 如果文件路径不同

如果容器内文件路径与宿主机不同，需要：

**选项1**: 修改配置文件中的路径，使其指向容器内实际挂载的路径

**选项2**: 在Docker容器中添加volume挂载

```bash
# 查看当前挂载
docker inspect <nginx-container-name> --format '{{json .Mounts}}'

# 添加挂载（需要重新创建容器）
docker run -d \
  --name nginx-new \
  -v /var/www/sextoy-prototype:/var/www/sextoy-prototype:ro \
  ...
```

## 🔒 配置HTTPS

### 使用Let's Encrypt（Docker内）

```bash
# 在Docker容器内安装certbot（需要进入容器）
docker exec -it <nginx-container-name> sh

# 在容器内运行（如果容器有certbot）
certbot --nginx -d prototype.feelnova-ai.com

# 或者使用Docker certbot容器
docker run -it --rm \
  -v /var/www/sextoy-prototype:/var/www/certbot \
  -v nginx-ssl:/etc/letsencrypt \
  certbot/certbot certonly --webroot \
  -w /var/www/certbot \
  -d prototype.feelnova-ai.com
```

然后在Nginx配置中添加SSL：

```nginx
server {
    listen 8443 ssl http2;
    server_name prototype.feelnova-ai.com;
    
    ssl_certificate /etc/letsencrypt/live/prototype.feelnova-ai.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/prototype.feelnova-ai.com/privkey.pem;
    
    # ... 其他配置
}

server {
    listen 8080;
    server_name prototype.feelnova-ai.com;
    return 301 https://$server_name:8443$request_uri;
}
```

## 🔍 故障排查

### 1. 容器找不到文件

**问题**: Nginx返回404错误

**解决**:
- 检查文件是否在宿主机存在: `ls -la /var/www/sextoy-prototype/current/`
- 检查容器内是否可以访问: `docker exec <nginx-container-name> ls -la /var/www/sextoy-prototype/`
- 确认volume挂载: `docker inspect <nginx-container-name> --format '{{json .Mounts}}'`

### 2. 配置文件未生效

**问题**: 修改配置后未生效

**解决**:
```bash
# 测试配置
docker exec <nginx-container-name> nginx -t

# 查看错误日志
docker exec <nginx-container-name> tail -f /var/log/nginx/error.log

# 重载配置
docker exec <nginx-container-name> nginx -s reload
```

### 3. 权限问题

**问题**: Nginx无法读取文件

**解决**:
```bash
# 检查文件权限
ls -la /var/www/sextoy-prototype/

# 设置正确权限（容器内的nginx用户通常是101）
chmod -R 755 /var/www/sextoy-prototype/
chown -R 101:101 /var/www/sextoy-prototype/  # nginx用户ID
```

### 4. 端口冲突

**问题**: 容器启动失败，端口被占用

**解决**:
```bash
# 检查端口占用
netstat -tulpn | grep :8080
netstat -tulpn | grep :8443

# 查看容器端口映射
docker port <nginx-container-name>
```

## 📋 常用Docker命令

```bash
# 查看容器日志
docker logs <nginx-container-name>
docker logs -f <nginx-container-name>  # 实时日志

# 进入容器
docker exec -it <nginx-container-name> sh

# 重启容器
docker restart <nginx-container-name>

# 查看容器状态
docker ps
docker inspect <nginx-container-name>

# 复制文件到容器
docker cp <local-file> <container-name>:<container-path>

# 从容器复制文件
docker cp <container-name>:<container-path> <local-file>
```

## ✅ 检查清单

- [ ] Docker Nginx容器运行中
- [ ] 文件已上传到宿主机
- [ ] Volume挂载配置正确（或使用docker cp）
- [ ] Nginx配置文件已复制到容器
- [ ] Nginx配置测试通过
- [ ] Nginx配置已重载
- [ ] 网站可以访问
- [ ] HTTPS已配置（推荐，端口8443）
- [ ] 防火墙已开放8080和8443端口

## 🎯 推荐工作流

1. **首次部署**:
   ```bash
   # 1. 配置DNS
   cd web-prototype/deployment
   # 2. 运行部署脚本
   ./deploy.sh v1.0.0
   # 3. 配置HTTPS
   ```

2. **更新版本**:
   ```bash
   # 进入deployment目录
   cd web-prototype/deployment
   # 部署新版本
   ./deploy.sh v2.0.0
   # 版本会自动保存，可以通过 /v1.0.0/ 和 /v2.0.0/ 访问
   ```

3. **回滚版本**:
   ```bash
   # SSH到服务器，修改符号链接
   ssh root@8.136.36.194
   cd /var/www/sextoy-prototype
   rm -f current
   ln -s versions/v1.0.0 current
   # 重载Nginx（如果配置改变）
   docker exec <nginx-container-name> nginx -s reload
   ```

---

**现在你可以使用Docker Nginx作为总网关了！** 🎉

**访问地址**: `http://prototype.feelnova-ai.com:8080/` (HTTP) 或 `https://prototype.feelnova-ai.com:8443/` (HTTPS)

**注意**: 使用非标准端口（8080/8443）以避免ICP备案要求。

