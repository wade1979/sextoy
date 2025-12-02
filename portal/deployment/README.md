# Portal 部署脚本和文档

本目录包含用于部署 Portal 营销网站到云端服务器的脚本和文档。

## 📁 文件说明

### 核心部署脚本
- **`deploy.sh`** - 主部署脚本，负责文件上传到服务器

### 文档
- **`DEPLOY_INSTRUCTIONS.md`** - 详细部署指南（包含完整的部署流程和故障排除）

## 🚀 快速开始

### 部署项目

```bash
# 进入 deployment 目录
cd portal/deployment

# 运行部署脚本
./deploy.sh
```

脚本会自动完成以下步骤：
1. 检查本地文件完整性
2. 安装必要工具（sshpass，如果需要）
3. 检查 SSH 连接
4. 准备服务器目录结构
5. 上传文件到服务器
6. 设置文件权限

## 📋 服务器配置

- **服务器IP**: 8.136.36.194
- **登录用户**: root
- **部署路径**: /var/www/portal

## ⚠️ 注意事项

1. **Nginx 配置**: Nginx 配置由系统管理员手动完成，部署脚本只负责文件上传
2. **备份机制**: 部署前会自动备份现有文件到 `/var/www/portal.backup/` 目录
3. **文件排除**: 部署时会自动排除 `.git`、`*.log`、`.DS_Store`、`deployment` 目录等不需要的文件

## 🔧 系统要求

### 本地环境
- macOS 或 Linux 系统
- bash shell
- sshpass（脚本会自动安装，如果未安装）
- rsync

### 服务器环境
- Linux 服务器
- SSH 访问权限
- 足够的磁盘空间
- 文件系统权限（root 用户）

## 📖 详细文档

更多详细信息请参考 [DEPLOY_INSTRUCTIONS.md](./DEPLOY_INSTRUCTIONS.md)

## 🐛 故障排除

如果遇到问题，请查看：
1. [DEPLOY_INSTRUCTIONS.md](./DEPLOY_INSTRUCTIONS.md) 中的故障排除部分
2. 检查服务器 SSH 连接是否正常
3. 检查服务器磁盘空间是否充足
4. 检查文件权限是否正确




