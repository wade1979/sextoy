# 部署脚本和文档

本目录包含用于部署 `web-prototype` 原型到云端服务器的所有脚本和文档。

## 📁 文件说明

### 核心部署脚本
- **`deploy.sh`** - 主部署脚本，负责文件上传到服务器
- **`setup-dns.sh`** - DNS配置提示脚本
- **`setup-ssl.sh`** - SSL证书配置脚本

### Docker相关
- **`docker-nginx-setup.sh`** - Docker Nginx volume挂载配置辅助脚本
- **`docker-compose.example.yml`** - Docker Compose配置示例

### Nginx配置辅助脚本
- **`configure_nginx_helper.sh`** - Nginx配置文件更新辅助脚本
- **`update_nginx_config.sh`** - Nginx配置更新脚本
- **`update_nginx_on_server.sh`** - 在服务器上执行的Nginx配置更新脚本

### 文档
- **`DEPLOY_INSTRUCTIONS.md`** - 快速部署指南（针对当前服务器）
- **`DEPLOYMENT.md`** - 通用部署指南（适用于任何服务器）
- **`DOCKER_DEPLOYMENT.md`** - Docker Nginx部署指南

## 🚀 快速开始

### 1. 配置DNS（首次部署）

```bash
cd web-prototype/deployment
./setup-dns.sh
```

### 2. 部署项目

```bash
cd web-prototype/deployment
./deploy.sh v1.0.0
```

### 3. 配置HTTPS（推荐）

```bash
cd web-prototype/deployment
./setup-ssl.sh
```

## 📋 注意事项

- 所有脚本需要在 `web-prototype/deployment` 目录中运行
- `deploy.sh` 会自动查找父目录（`web-prototype`）中的文件
- 确保已安装 `sshpass`（脚本会自动检测并提示安装）

## 📖 详细文档

请查看：
- **`DEPLOY_INSTRUCTIONS.md`** - 针对当前服务器的详细部署步骤
- **`DEPLOYMENT.md`** - 通用部署指南和故障排查
- **`DOCKER_DEPLOYMENT.md`** - Docker Nginx部署详细说明

