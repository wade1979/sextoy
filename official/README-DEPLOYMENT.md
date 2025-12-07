# 部署说明

## 快速开始

```bash
cd official/deployment
./deploy.sh
```

## 项目结构

```
sextoy/
├── portal/          # 静态 HTML 网站
│   └── deployment/  # 静态网站部署脚本
└── official/        # Next.js 项目（本项目）
    └── deployment/  # Next.js 部署脚本
```

## 部署脚本说明

- **位置**: `official/deployment/deploy.sh`
- **功能**: 自动构建 Next.js 项目并部署到服务器
- **目标服务器**: `8.136.36.194`
- **部署路径**: `/var/www/portal-official`

## 详细文档

查看 `deployment/README.md` 获取完整的部署说明。







