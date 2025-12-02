# GitHub 仓库设置指南

## 步骤 1: 在 GitHub 上创建新仓库

1. 登录 GitHub (https://github.com)
2. 点击右上角的 "+" 按钮，选择 "New repository"
3. 填写仓库信息：
   - **Repository name**: `sextoy` 或 `ai-control-prototype`（根据需要）
   - **Description**: AI Control Prototype - Web Speech API语音交互控制面板
   - **Visibility**: 选择 Public 或 Private
   - **不要**勾选 "Initialize this repository with a README"（因为本地已有）
4. 点击 "Create repository"

## 步骤 2: 连接本地仓库到 GitHub

在终端中执行以下命令（将 `YOUR_USERNAME` 替换为您的GitHub用户名，`REPO_NAME` 替换为仓库名）：

```bash
cd /Users/huangwei/projects/sextoy

# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# 或者使用SSH（如果已配置SSH密钥）
# git remote add origin git@github.com:YOUR_USERNAME/REPO_NAME.git

# 推送代码到GitHub
git branch -M main
git push -u origin main
```

## 步骤 3: 验证推送

推送完成后，访问您的GitHub仓库页面，应该能看到所有文件。

## 后续更新

之后如果需要更新代码：

```bash
# 添加修改的文件
git add .

# 提交更改
git commit -m "描述你的更改"

# 推送到GitHub
git push
```

## 注意事项

1. 如果使用HTTPS推送，可能会要求输入GitHub用户名和密码（或Personal Access Token）
2. 如果使用SSH，需要先配置SSH密钥
3. 确保 `.gitignore` 文件已正确配置，避免提交不必要的文件

## 查看当前状态

```bash
# 查看远程仓库
git remote -v

# 查看提交历史
git log --oneline

# 查看当前状态
git status
```

