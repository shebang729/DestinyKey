# 使用 Node.js 18 作為基礎鏡像
FROM node:18-alpine

# 設置工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 使用 npm 安裝依賴
RUN npm install --production=false

# 複製所有源代碼
COPY . .

# 構建應用
RUN npm run build

# 設置環境變數
ENV NODE_ENV=production

# 暴露端口（Railway 會動態分配）
EXPOSE ${PORT:-3001}

# 啟動應用
CMD ["node", "dist/index.js"]
