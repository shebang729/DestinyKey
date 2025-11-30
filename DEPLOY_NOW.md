# 🚀 立即部署指南

您的 GitHub 倉庫：https://github.com/shebang729/DestinyKey

## 📋 快速部署步驟（30 分鐘）

### 步驟 1：部署前端到 Vercel ⭐

1. **訪問 Vercel**
   - 打開：https://vercel.com
   - 點擊 **Log In** 或 **Sign Up**
   - 選擇 **Continue with GitHub**

2. **導入項目**
   - 點擊 **Add New...** → **Project**
   - 找到 `DestinyKey` 倉庫
   - 點擊 **Import**

3. **配置設定**
   
   **Framework Preset**: Vite（自動檢測）
   
   **Root Directory**: `./`
   
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

4. **環境變數**（暫時跳過，稍後添加）

5. **部署**
   - 點擊 **Deploy**
   - 等待 2-3 分鐘
   - ✅ 記下您的 Vercel URL

---

### 步驟 2：部署後端到 Railway ⭐

1. **訪問 Railway**
   - 打開：https://railway.app
   - 點擊 **Login**
   - 選擇 **Login with GitHub**

2. **創建項目**
   - 點擊 **New Project**
   - 選擇 **Deploy from GitHub repo**
   - 選擇 `DestinyKey` 倉庫
   - 點擊 **Deploy Now**

3. **添加 MySQL 資料庫**
   - 在項目中點擊 **+ New**
   - 選擇 **Database** → **Add MySQL**
   - 等待資料庫啟動（約 1 分鐘）

4. **配置後端服務**
   
   點擊後端服務（DestinyKey）→ **Settings**：
   
   **Start Command**:
   ```bash
   node dist/index.js
   ```
   
   **Build Command**:
   ```bash
   pnpm install && pnpm run build
   ```

5. **生成公開 URL**
   - 在 **Settings** → **Networking**
   - 點擊 **Generate Domain**
   - ✅ 記下您的 Railway URL

6. **設定環境變數**
   
   點擊 **Variables** 標籤：
   
   從 MySQL 服務複製這些變數：
   - `MYSQLHOST`
   - `MYSQLPORT`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `MYSQLDATABASE`
   
   然後添加：
   ```env
   DATABASE_URL=mysql://${MYSQLUSER}:${MYSQLPASSWORD}@${MYSQLHOST}:${MYSQLPORT}/${MYSQLDATABASE}
   FRONTEND_URL=https://your-vercel-app.vercel.app
   NODE_ENV=production
   OPENAI_API_KEY=sk-your-key-here
   ```
   
   （將 `FRONTEND_URL` 替換為您的 Vercel URL）

---

### 步驟 3：連接前後端 🔗

1. **更新 Vercel 環境變數**
   - 回到 Vercel 項目
   - **Settings** → **Environment Variables**
   - 添加：
     ```env
     VITE_API_URL=https://your-railway-app.up.railway.app
     ```
   - 點擊 **Save**
   - **Deployments** → 最新部署 → **...** → **Redeploy**

2. **確認 Railway 環境變數**
   - 確保 `FRONTEND_URL` 指向您的 Vercel URL
   - Railway 會自動重新部署

---

### 步驟 4：測試網站 ✅

1. **訪問前端**
   - 打開您的 Vercel URL
   - 檢查頁面是否正常顯示

2. **測試免費分析**
   - 輸入電話號碼：`12345678`
   - 點擊「開始免費分析」
   - 檢查是否能看到結果

3. **檢查隱私聲明**
   - 確認首頁顯示：「🔒 您的私人資料我們不會留底，僅用於即時分析」

4. **測試 Instagram 連結**
   - 點擊 Instagram 按鈕
   - 確認能正確跳轉

---

## 🎉 完成！

您的網站現在已經：
- ✅ 永久免費託管（$0/月）
- ✅ 自動 HTTPS
- ✅ 全球 CDN 加速
- ✅ 自動部署

### 📱 您的網站

- **前端**: https://_______.vercel.app
- **後端**: https://_______.up.railway.app
- **Instagram**: @destinykey.hk

---

## 🔄 如何更新網站

```bash
# 修改代碼後
git add .
git commit -m "更新內容"
git push

# Vercel 和 Railway 會自動重新部署！
```

---

## 🆘 遇到問題？

### 前端無法連接後端
- 檢查 Vercel 的 `VITE_API_URL` 是否正確
- 檢查 Railway 的 `FRONTEND_URL` 是否正確
- 查看 Railway 的 Logs 標籤

### 資料庫連接失敗
- 確認 MySQL 服務正常運行
- 檢查資料庫環境變數
- 在 Railway Shell 執行：`pnpm run db:push`

---

**祝您部署順利！** 🚀

更多詳細資訊請查看：
- `QUICK_DEPLOY_COMMANDS.md`
- `DEPLOYMENT_CHECKLIST_FINAL.md`
