# 🚀 快速部署指令

## 步驟 1：創建 GitHub 倉庫

### 方法 A：使用 GitHub 網頁（最簡單）

1. **訪問**: https://github.com/new
2. **倉庫名稱**: `destiny-key-app`
3. **描述**: `命運之鑰 - 八星磁場數字能量分析平台`
4. **類型**: Public（公開）
5. **不要勾選**: ❌ Add a README file
6. **不要勾選**: ❌ Add .gitignore
7. **不要勾選**: ❌ Choose a license
8. **點擊**: Create repository

### 方法 B：使用 GitHub CLI

```bash
# 登入 GitHub
gh auth login

# 創建倉庫並推送（一條命令搞定）
cd /home/ubuntu/destiny-key-app
gh repo create destiny-key-app --public --source=. --push
```

---

## 步驟 2：推送代碼到 GitHub

**如果使用方法 A（網頁創建），執行以下命令：**

```bash
cd /home/ubuntu/destiny-key-app

# 添加遠程倉庫（替換 YOUR_USERNAME 為您的 GitHub 用戶名）
git remote add origin https://github.com/YOUR_USERNAME/destiny-key-app.git

# 推送代碼
git branch -M main
git push -u origin main
```

**如果使用方法 B（GitHub CLI），代碼已自動推送，跳到步驟 3。**

---

## 步驟 3：部署前端到 Vercel

### 3.1 登入 Vercel

1. 訪問: https://vercel.com
2. 點擊 **Sign Up** 或 **Log In**
3. 選擇 **Continue with GitHub**
4. 授權 Vercel 訪問您的 GitHub

### 3.2 導入項目

1. 點擊 **Add New...** → **Project**
2. 找到 `destiny-key-app` 倉庫
3. 點擊 **Import**

### 3.3 配置項目

**Framework Preset**: `Vite` （自動檢測）

**Root Directory**: `./` （保持預設）

**Build Command**:
```bash
pnpm install && pnpm build
```

**Output Directory**:
```
dist/public
```

**Install Command**:
```bash
pnpm install
```

### 3.4 環境變數（先跳過）

暫時不添加環境變數，點擊 **Deploy**

### 3.5 等待部署

- 通常需要 2-3 分鐘
- 完成後會顯示 🎉 Congratulations!
- 記下您的 Vercel URL，例如：
  - `https://destiny-key-app.vercel.app`
  - `https://destiny-key-app-xxx.vercel.app`

---

## 步驟 4：部署後端到 Railway

### 4.1 登入 Railway

1. 訪問: https://railway.app
2. 點擊 **Login**
3. 選擇 **Login with GitHub**
4. 授權 Railway

### 4.2 創建新項目

1. 點擊 **New Project**
2. 選擇 **Deploy from GitHub repo**
3. 選擇 `destiny-key-app` 倉庫
4. 點擊 **Deploy Now**

### 4.3 添加 MySQL 資料庫

1. 在項目中點擊 **+ New**
2. 選擇 **Database** → **Add MySQL**
3. Railway 會自動創建 MySQL 資料庫
4. 等待資料庫啟動（約 1 分鐘）

### 4.4 配置後端服務

#### 點擊後端服務（destiny-key-app）

**Settings** 標籤：

1. **Start Command**:
   ```bash
   node dist/index.js
   ```

2. **Build Command**:
   ```bash
   pnpm install && pnpm run build
   ```

3. **Root Directory**: `/` （保持預設）

4. **生成公開 URL**:
   - 在 **Settings** → **Networking**
   - 點擊 **Generate Domain**
   - 記下 Railway URL，例如：
     - `https://destiny-key-app-production.up.railway.app`

#### Variables 標籤（環境變數）

**從 MySQL 資料庫複製變數：**

1. 點擊 MySQL 資料庫服務
2. 點擊 **Variables** 標籤
3. 複製以下變數的值：
   - `MYSQLHOST`
   - `MYSQLPORT`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `MYSQLDATABASE`

**回到後端服務，添加環境變數：**

點擊後端服務 → **Variables** 標籤 → **+ New Variable**

```env
# 資料庫連接（使用 MySQL 服務的變數）
DATABASE_URL=mysql://${MYSQLUSER}:${MYSQLPASSWORD}@${MYSQLHOST}:${MYSQLPORT}/${MYSQLDATABASE}

# 或者分別設定（推薦）
DB_HOST=${MYSQLHOST}
DB_PORT=${MYSQLPORT}
DB_USER=${MYSQLUSER}
DB_PASSWORD=${MYSQLPASSWORD}
DB_NAME=${MYSQLDATABASE}

# OpenAI API（如果需要 AI 功能）
OPENAI_API_KEY=sk-your-openai-api-key-here

# 前端 URL（從 Vercel 複製）
FRONTEND_URL=https://destiny-key-app.vercel.app

# Node 環境
NODE_ENV=production
```

**💡 提示**: Railway 支援變數引用，使用 `${VARIABLE_NAME}` 格式

### 4.5 初始化資料庫

**方法 A：使用 Railway Shell**

1. 點擊後端服務
2. 點擊右上角的 **...** → **Shell**
3. 執行：
   ```bash
   pnpm run db:push
   ```

**方法 B：使用 MySQL 客戶端**

1. 點擊 MySQL 資料庫服務
2. 點擊 **Connect**
3. 使用提供的連接資訊連接資料庫
4. 執行 `drizzle/schema.sql` 中的 SQL

---

## 步驟 5：連接前端和後端

### 5.1 更新 Vercel 環境變數

1. 回到 Vercel 項目
2. 點擊 **Settings** → **Environment Variables**
3. 添加新變數：

```env
VITE_API_URL=https://your-railway-app.up.railway.app
```

（替換為您的 Railway URL）

4. 點擊 **Save**
5. 點擊 **Deployments** 標籤
6. 點擊最新部署旁的 **...** → **Redeploy**

### 5.2 更新 Railway 環境變數

確保 Railway 有正確的 `FRONTEND_URL`：

```env
FRONTEND_URL=https://your-vercel-app.vercel.app
```

（替換為您的 Vercel URL）

### 5.3 重新部署

Railway 會自動檢測到環境變數變更並重新部署。

---

## 步驟 6：測試網站

### ✅ 測試清單

1. **訪問前端**
   - 打開 Vercel URL
   - 檢查頁面是否正常顯示

2. **測試免費分析**
   - 輸入電話號碼：`12345678`
   - 點擊「開始免費分析」
   - 檢查是否能看到分析結果

3. **檢查隱私聲明**
   - 確認首頁顯示：「🔒 您的私人資料我們不會留底，僅用於即時分析」

4. **測試 Instagram 連結**
   - 點擊「關注我們的 Instagram」
   - 確認能正確跳轉

5. **測試響應式設計**
   - 在手機上打開網站
   - 檢查是否正常顯示

---

## 🎉 完成！

您的網站現在已經：
- ✅ 永久免費託管
- ✅ 自動 HTTPS
- ✅ 全球 CDN 加速
- ✅ 自動部署（推送代碼即更新）
- ✅ 99.9% 正常運行時間

### 📱 您的網站地址

- **前端**: https://your-app.vercel.app
- **後端**: https://your-app.railway.app
- **Instagram**: @destinykey.hk

---

## 🔄 如何更新網站

```bash
cd /home/ubuntu/destiny-key-app

# 修改代碼...

# 提交並推送
git add .
git commit -m "更新網站內容"
git push

# Vercel 和 Railway 會自動重新部署！
```

---

## 🆘 遇到問題？

### 前端無法連接後端

**檢查**:
1. Vercel 的 `VITE_API_URL` 是否正確
2. Railway 的 `FRONTEND_URL` 是否正確
3. Railway 後端服務是否正常運行

**解決**:
- 在 Railway 查看日誌（Logs 標籤）
- 確認環境變數正確
- 重新部署

### 資料庫連接失敗

**檢查**:
1. MySQL 服務是否正常運行
2. 資料庫環境變數是否正確
3. 資料庫是否已初始化

**解決**:
- 在 Railway 查看 MySQL 日誌
- 重新執行 `pnpm run db:push`
- 檢查連接字串格式

### Railway 超出免費額度

**解決**:
1. 啟用 Sleep 功能（閒置時自動休眠）
2. 優化後端代碼
3. 考慮升級到付費計劃（$5/月起）

---

## 📚 更多資源

- **Vercel 文檔**: https://vercel.com/docs
- **Railway 文檔**: https://docs.railway.app
- **完整部署指南**: 查看 `FREE_DEPLOYMENT_GUIDE.md`

---

**祝您部署順利！** 🚀
