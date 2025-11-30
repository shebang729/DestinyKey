# ✅ 部署檢查清單

使用此清單確保部署過程順利完成。

---

## 📋 準備階段

### 帳號註冊（全部免費）

- [ ] GitHub 帳號 (https://github.com)
- [ ] Vercel 帳號 (https://vercel.com) - 使用 GitHub 登入
- [ ] Railway 帳號 (https://railway.app) - 使用 GitHub 登入

---

## 🔧 步驟 1：GitHub 倉庫

### 創建倉庫

- [ ] 訪問 https://github.com/new
- [ ] 倉庫名稱：`destiny-key-app`
- [ ] 類型：Public（公開）
- [ ] ❌ 不勾選任何初始化選項
- [ ] 點擊 Create repository

### 推送代碼

```bash
cd /home/ubuntu/destiny-key-app
git remote add origin https://github.com/YOUR_USERNAME/destiny-key-app.git
git branch -M main
git push -u origin main
```

- [ ] 代碼已成功推送到 GitHub
- [ ] 在 GitHub 上能看到所有文件

---

## 🎨 步驟 2：Vercel（前端）

### 導入項目

- [ ] 登入 Vercel (https://vercel.com)
- [ ] 點擊 Add New... → Project
- [ ] 找到 `destiny-key-app` 倉庫
- [ ] 點擊 Import

### 配置項目

- [ ] Framework Preset: `Vite`
- [ ] Build Command: `pnpm install && pnpm build`
- [ ] Output Directory: `dist/public`
- [ ] Install Command: `pnpm install`

### 部署

- [ ] 點擊 Deploy
- [ ] 等待部署完成（2-3 分鐘）
- [ ] 記下 Vercel URL：`_______________________`

### 測試前端

- [ ] 訪問 Vercel URL
- [ ] 頁面正常顯示
- [ ] 樣式正確載入
- [ ] 隱私聲明顯示正確

---

## 🚂 步驟 3：Railway（後端 + 資料庫）

### 創建項目

- [ ] 登入 Railway (https://railway.app)
- [ ] 點擊 New Project
- [ ] 選擇 Deploy from GitHub repo
- [ ] 選擇 `destiny-key-app` 倉庫
- [ ] 點擊 Deploy Now

### 添加 MySQL 資料庫

- [ ] 點擊 + New
- [ ] 選擇 Database → Add MySQL
- [ ] 等待資料庫啟動（約 1 分鐘）

### 配置後端服務

#### Settings 標籤

- [ ] Start Command: `node dist/index.js`
- [ ] Build Command: `pnpm install && pnpm run build`
- [ ] Root Directory: `/`

#### Networking

- [ ] 點擊 Generate Domain
- [ ] 記下 Railway URL：`_______________________`

#### Variables 標籤

**從 MySQL 服務複製：**

- [ ] `MYSQLHOST`
- [ ] `MYSQLPORT`
- [ ] `MYSQLUSER`
- [ ] `MYSQLPASSWORD`
- [ ] `MYSQLDATABASE`

**添加環境變數：**

```env
DATABASE_URL=mysql://${MYSQLUSER}:${MYSQLPASSWORD}@${MYSQLHOST}:${MYSQLPORT}/${MYSQLDATABASE}
DB_HOST=${MYSQLHOST}
DB_PORT=${MYSQLPORT}
DB_USER=${MYSQLUSER}
DB_PASSWORD=${MYSQLPASSWORD}
DB_NAME=${MYSQLDATABASE}
OPENAI_API_KEY=sk-your-key-here
FRONTEND_URL=https://your-vercel-app.vercel.app
NODE_ENV=production
```

- [ ] 所有環境變數已添加
- [ ] `FRONTEND_URL` 已設定為 Vercel URL
- [ ] `OPENAI_API_KEY` 已設定（如需 AI 功能）

### 初始化資料庫

- [ ] 點擊後端服務
- [ ] 點擊 ... → Shell
- [ ] 執行：`pnpm run db:push`
- [ ] 資料庫 Schema 已創建

### 測試後端

- [ ] 訪問 Railway URL
- [ ] 後端服務正常運行
- [ ] 查看 Logs 無錯誤訊息

---

## 🔗 步驟 4：連接前後端

### 更新 Vercel 環境變數

- [ ] 回到 Vercel 項目
- [ ] Settings → Environment Variables
- [ ] 添加：`VITE_API_URL=https://your-railway-app.up.railway.app`
- [ ] 點擊 Save
- [ ] Deployments → 最新部署 → ... → Redeploy

### 確認 Railway 環境變數

- [ ] `FRONTEND_URL` 指向 Vercel URL
- [ ] Railway 自動重新部署

---

## 🧪 步驟 5：完整測試

### 基本功能測試

- [ ] 訪問 Vercel URL
- [ ] 頁面完整載入
- [ ] 樣式正確顯示
- [ ] 無控制台錯誤

### 免費分析功能

- [ ] 輸入電話號碼：`12345678`
- [ ] 點擊「開始免費分析」
- [ ] 能看到分析結果
- [ ] 四大維度評分顯示
- [ ] 磁場分析顯示

### 隱私聲明檢查

- [ ] 首頁電話輸入框下方顯示：「🔒 您的私人資料我們不會留底，僅用於即時分析」
- [ ] 八字資訊提示框顯示隱私保證
- [ ] 「為什麼選擇我們」區塊強調隱私保護

### Instagram 整合

- [ ] 點擊「關注我們的 Instagram」按鈕
- [ ] 正確跳轉到 Instagram（或顯示帳號不存在）
- [ ] 所有 DM 按鈕正常工作
- [ ] Instagram 帳號 @destinykey.hk 顯示正確

### 響應式設計

- [ ] 在桌面瀏覽器測試
- [ ] 在手機瀏覽器測試
- [ ] 在平板瀏覽器測試
- [ ] 所有裝置顯示正常

### 頁面導航

- [ ] 首頁 → 結果頁
- [ ] 結果頁 → 首頁
- [ ] 所有內部連結正常

### 錯誤處理

- [ ] 輸入無效號碼（少於 8 位）
- [ ] 顯示錯誤提示
- [ ] 網路錯誤處理正常

---

## 📱 步驟 6：Instagram 設定

### 創建 Instagram 帳號

- [ ] 帳號名稱：@destinykey.hk
- [ ] 個人資料照片：使用 Logo（在 `branding/` 資料夾）
- [ ] 簡介：「命運之鑰 🔮 八星磁場數字能量分析 | 專業電話號碼諮詢 | DM 預約」
- [ ] 連結：Vercel URL

### 設定自動回覆

- [ ] 開啟快速回覆功能
- [ ] 添加自動回覆訊息（參考 `IG_AUTO_REPLY_MESSAGES.md`）
- [ ] 測試自動回覆

### 發布首篇貼文

- [ ] 介紹服務內容
- [ ] 包含網站連結
- [ ] 使用相關 Hashtags

---

## 🎉 完成檢查

### 最終確認

- [ ] ✅ 網站可公開訪問
- [ ] ✅ 前後端連接正常
- [ ] ✅ 資料庫運作正常
- [ ] ✅ 所有功能測試通過
- [ ] ✅ 隱私聲明正確顯示
- [ ] ✅ Instagram 整合完成
- [ ] ✅ 響應式設計正常
- [ ] ✅ 無控制台錯誤
- [ ] ✅ 無明顯 Bug

### 記錄資訊

**網站資訊：**
- 前端 URL：`_______________________`
- 後端 URL：`_______________________`
- Instagram：`@destinykey.hk`

**帳號資訊：**
- GitHub：`_______________________`
- Vercel：`已連接 GitHub`
- Railway：`已連接 GitHub`

**成本：**
- 總成本：**$0/月** 🎉

---

## 📊 監控與維護

### 定期檢查

- [ ] 每週檢查網站運行狀態
- [ ] 每月檢查 Railway 免費額度使用情況
- [ ] 監控 Instagram DM 訊息
- [ ] 收集用戶反饋

### 更新流程

```bash
# 1. 修改代碼
# 2. 測試本地
pnpm run dev

# 3. 提交並推送
git add .
git commit -m "更新內容"
git push

# 4. 自動部署（Vercel + Railway）
```

- [ ] 了解更新流程
- [ ] 測試過一次更新

---

## 🆘 故障排除

### 常見問題

**前端無法連接後端**
- [ ] 檢查 Vercel 的 `VITE_API_URL`
- [ ] 檢查 Railway 的 `FRONTEND_URL`
- [ ] 檢查 CORS 設定

**資料庫連接失敗**
- [ ] 檢查 MySQL 服務狀態
- [ ] 檢查資料庫環境變數
- [ ] 重新執行 `pnpm run db:push`

**部署失敗**
- [ ] 查看 Vercel/Railway 的部署日誌
- [ ] 檢查 build 命令
- [ ] 檢查依賴是否正確安裝

---

## 📚 文檔參考

- [ ] `README.md` - 項目說明
- [ ] `FREE_DEPLOYMENT_GUIDE.md` - 詳細部署指南
- [ ] `QUICK_DEPLOY_COMMANDS.md` - 快速部署指令
- [ ] `IG_AUTO_REPLY_MESSAGES.md` - Instagram 自動回覆
- [ ] `INSTAGRAM_MARKETING_STRATEGY.md` - 行銷策略

---

## 🎯 下一步

- [ ] 綁定自定義域名（可選）
- [ ] 設定 Google Analytics（可選）
- [ ] 開始推廣網站
- [ ] 收集用戶反饋
- [ ] 持續優化功能

---

**🎉 恭喜！您的網站已成功部署！**

**總耗時：** 約 30-60 分鐘  
**總成本：** $0/月  
**維護難度：** 低  

現在可以開始推廣您的服務了！ 🚀
