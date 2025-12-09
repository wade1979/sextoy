FROM alibaba-cloud-linux-3-registry.cn-hangzhou.cr.aliyuncs.com/alinux3/node:20.16


# 关键：切换到 root 用户，否则 npm 无法写 package-lock.json
USER root

# 默认用户是 root，无需切换
WORKDIR /app

# 复制依赖文件
COPY package*.json ./



# 这里使用 root 安装依赖：不会有权限问题
RUN npm install

# 复制剩余源码
COPY . .

# 构建 Next.js 产物
RUN npm run build

# 把文件权限交给 node 用户（非常关键）
RUN chown -R node:node /app

# 切换到 node 用户运行
USER node

EXPOSE 3000


CMD ["npm", "start", "--", "-H", "0.0.0.0"]