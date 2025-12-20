# 後台管理系統使用指南

## 📋 系統概述

命運之鑰後台管理系統讓您可以：
- ✅ 查看所有付費客戶的詳細資料
- ✅ 管理訂單狀態（待處理、處理中、已完成）
- ✅ 搜尋和篩選客戶
- ✅ 添加備註和推薦號碼
- ✅ 查看統計數據和收入

---

## 🚀 快速開始

### 1. 訪問後台

**網址：** `https://destiny-key.vercel.app/admin`

**預設密碼：** `destiny2025`

⚠️ **重要：** 首次使用後請立即修改密碼！

---

### 2. 修改管理員密碼

#### **方法 1：透過環境變數（推薦）**

**Vercel 設定：**
```bash
1. 前往 Vercel Dashboard
2. 選擇 destiny-key 專案
3. 進入 Settings → Environment Variables
4. 添加新變數：
   - Name: ADMIN_PASSWORD
   - Value: 你的新密碼（建議使用強密碼）
5. 點擊 Save
6. 重新部署專案
```

**Railway 設定：**
```bash
1. 前往 Railway Dashboard
2. 選擇 destinykey 專案
3. 進入 Variables 標籤
4. 添加新變數：
   - ADMIN_PASSWORD=你的新密碼
5. 點擊 Deploy
```

#### **方法 2：直接修改代碼**

編輯 `server/routers/admin.ts`：
```typescript
// 第 8 行
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '你的新密碼';
```

然後重新部署。

---

## 🎯 主要功能

### 1. 儀表板統計

登入後會看到：
- **總訂單數**：所有訂單總數
- **待處理**：需要處理的新訂單
- **處理中**：正在處理的訂單
- **已完成**：已完成的訂單
- **總收入**：所有訂單的總金額

---

### 2. 訂單列表

顯示所有訂單的資訊：
- 訂單 ID
- 客戶姓名
- 電話號碼
- Email
- 付款金額
- 服務狀態
- 建立時間

**操作：**
- 點擊「查看詳情」查看完整資料
- 使用搜尋框搜尋客戶（姓名、電話、Email）
- 使用狀態篩選器過濾訂單

---

### 3. 訂單詳情

點擊「查看詳情」後可以看到：

#### **客戶資料**
- 姓名
- 電話號碼
- Email
- 出生日期
- 出生時間
- 身份證後 4 碼
- 目標（事業、財運、桃花等）

#### **付款資料**
- 付款金額
- 付款狀態
- Stripe Session ID

#### **服務管理**
- 更新服務狀態：
  - 待處理（pending）
  - 處理中（processing）
  - 已完成（completed）
- 添加備註（給自己看的筆記）
- 記錄推薦的號碼

---

## 📝 工作流程範例

### 新訂單處理流程

**步驟 1：收到新訂單**
```
1. 客戶在網站上完成付款
2. 訂單自動保存到數據庫
3. 狀態：待處理（pending）
```

**步驟 2：開始處理**
```
1. 登入後台查看訂單
2. 點擊「查看詳情」
3. 查看客戶資料：
   - 當前電話號碼
   - 出生日期/時間
   - 身份證後 4 碼
   - 目標（事業/財運/桃花）
4. 將狀態改為「處理中」
5. 點擊「保存更新」
```

**步驟 3：分析和推薦**
```
1. 根據客戶資料進行命理分析
2. 使用八星磁場理論選擇吉祥號碼
3. 在備註欄記錄分析過程
4. 準備 3-5 個推薦號碼
```

**步驟 4：完成服務**
```
1. 將推薦號碼發送給客戶（透過 Email 或 WhatsApp）
2. 在後台將狀態改為「已完成」
3. 在備註欄記錄發送時間和客戶反饋
4. 點擊「保存更新」
```

---

## 🔍 搜尋和篩選

### 搜尋功能

在搜尋框輸入關鍵字可搜尋：
- 客戶姓名
- 電話號碼
- Email

**範例：**
```
搜尋 "陳" → 顯示所有姓陳的客戶
搜尋 "9123" → 顯示電話包含 9123 的客戶
搜尋 "gmail" → 顯示使用 Gmail 的客戶
```

### 狀態篩選

選擇狀態篩選器：
- **全部**：顯示所有訂單
- **待處理**：只顯示新訂單
- **處理中**：只顯示正在處理的訂單
- **已完成**：只顯示已完成的訂單

---

## 💾 數據庫結構

### Orders 表

| 欄位 | 類型 | 說明 |
|------|------|------|
| id | INT | 訂單 ID（自動遞增） |
| stripe_session_id | VARCHAR(255) | Stripe 付款 Session ID |
| stripe_payment_status | VARCHAR(50) | 付款狀態（paid/unpaid） |
| customer_name | VARCHAR(100) | 客戶姓名 |
| customer_email | VARCHAR(255) | 客戶 Email |
| phone_number | VARCHAR(20) | 客戶電話號碼 |
| birth_date | VARCHAR(20) | 出生日期 |
| birth_time | VARCHAR(20) | 出生時間 |
| id_last_four | VARCHAR(10) | 身份證後 4 碼 |
| goals | TEXT | 客戶目標 |
| amount_total | DECIMAL(10,2) | 付款金額 |
| currency | VARCHAR(10) | 貨幣（HKD） |
| service_status | VARCHAR(50) | 服務狀態 |
| recommended_numbers | JSON | 推薦的號碼列表 |
| notes | TEXT | 師傅備註 |
| created_at | TIMESTAMP | 建立時間 |
| updated_at | TIMESTAMP | 更新時間 |
| completed_at | TIMESTAMP | 完成時間 |

---

## 🔒 安全性

### 密碼保護

- 所有後台 API 都需要密碼驗證
- 密碼保存在 sessionStorage（關閉瀏覽器後需重新登入）
- 建議定期更換密碼

### 建議的安全措施

1. **使用強密碼**
   ```
   ✅ 至少 12 個字符
   ✅ 包含大小寫字母、數字、符號
   ✅ 不使用常見詞彙
   
   範例：Dk@2025!HkP#mN
   ```

2. **定期更換密碼**
   ```
   建議每 3 個月更換一次
   ```

3. **不要分享密碼**
   ```
   只給需要訪問後台的人
   ```

4. **使用 HTTPS**
   ```
   確保網址是 https://（Vercel 自動提供）
   ```

---

## 🚀 部署步驟

### 1. 數據庫遷移

**如果使用 Railway 的 MySQL：**

```bash
# 連接到數據庫
mysql -h [你的數據庫主機] -u [用戶名] -p

# 執行遷移
source drizzle/migrations/0002_add_orders_table.sql;

# 確認表已創建
SHOW TABLES;
DESCRIBE orders;
```

**如果使用 TiDB Cloud：**

1. 登入 TiDB Cloud Dashboard
2. 進入 SQL Editor
3. 複製 `drizzle/migrations/0002_add_orders_table.sql` 的內容
4. 執行 SQL
5. 確認表已創建

---

### 2. 設定環境變數

**Vercel（前端）：**
```bash
VITE_API_URL=https://destinykey-production.up.railway.app
```

**Railway（後端）：**
```bash
DATABASE_URL=你的數據庫連接字串
STRIPE_SECRET_KEY=你的 Stripe Secret Key
FRONTEND_URL=https://destiny-key.vercel.app
ADMIN_PASSWORD=你的管理員密碼
```

---

### 3. 部署代碼

**方法 1：使用 Git（推薦）**

```bash
cd /home/ubuntu/destiny-key-app

# 提交更改
git add .
git commit -m "Add admin backend system"
git push origin main

# Vercel 和 Railway 會自動部署
```

**方法 2：手動上傳**

1. 將整個專案打包
2. 上傳到 Vercel 和 Railway
3. 等待部署完成

---

### 4. 測試後台

```bash
1. 訪問 https://destiny-key.vercel.app/admin
2. 輸入密碼登入
3. 確認可以看到儀表板
4. 測試搜尋和篩選功能
5. 測試訂單詳情查看
6. 測試訂單狀態更新
```

---

## 🐛 常見問題

### 1. 無法登入後台

**問題：** 輸入密碼後顯示「密碼錯誤」

**解決方法：**
```bash
1. 確認環境變數 ADMIN_PASSWORD 是否正確設定
2. 如果沒有設定，預設密碼是 destiny2025
3. 檢查 Railway 的日誌確認環境變數已載入
4. 重新部署後端
```

---

### 2. 看不到訂單

**問題：** 後台顯示 0 筆訂單

**解決方法：**
```bash
1. 確認數據庫表 orders 已創建
2. 檢查數據庫連接是否正常
3. 測試創建一筆新訂單
4. 查看 Railway 日誌是否有錯誤
```

---

### 3. 更新訂單失敗

**問題：** 點擊「保存更新」後顯示錯誤

**解決方法：**
```bash
1. 檢查網絡連接
2. 確認後端 API 正常運行
3. 查看瀏覽器 Console 的錯誤訊息
4. 重新登入後台
```

---

### 4. 付款後訂單沒有自動創建

**問題：** 客戶付款後數據庫沒有記錄

**解決方法：**
```bash
1. 檢查 payment.ts 路由是否正確更新
2. 確認 Stripe 付款流程正常
3. 查看 Railway 日誌確認是否有錯誤
4. 測試 createCheckoutSession API
```

---

## 📊 數據導出

### 導出客戶資料為 Excel

**方法 1：使用數據庫工具**

```bash
# 連接到數據庫
mysql -h [主機] -u [用戶名] -p

# 導出為 CSV
SELECT * FROM orders INTO OUTFILE '/tmp/orders.csv'
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n';
```

**方法 2：在後台添加導出功能（未來功能）**

可以在後台添加「導出 Excel」按鈕，使用 `xlsx` 套件生成 Excel 文件。

---

## 🔄 未來升級建議

### 1. 完整的認證系統

使用 JWT 或 OAuth 替代簡單密碼：
```typescript
// 使用 JWT
import jwt from 'jsonwebtoken';

// 登入時生成 token
const token = jwt.sign({ admin: true }, SECRET_KEY);

// API 驗證 token
jwt.verify(token, SECRET_KEY);
```

---

### 2. 多管理員支持

添加管理員表，支持多個管理員：
```sql
CREATE TABLE admins (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE,
  password_hash VARCHAR(255),
  role VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 3. 郵件自動發送

完成訂單後自動發送 Email：
```typescript
import nodemailer from 'nodemailer';

// 發送推薦號碼給客戶
await transporter.sendMail({
  to: customer.email,
  subject: '您的專屬吉祥號碼推薦',
  html: `<p>親愛的 ${customer.name}，...</p>`
});
```

---

### 4. WhatsApp 整合

使用 WhatsApp Business API 發送訊息：
```typescript
// 使用 Twilio WhatsApp API
await client.messages.create({
  from: 'whatsapp:+14155238886',
  to: `whatsapp:${customer.phone}`,
  body: '您的專屬號碼推薦已準備好！'
});
```

---

### 5. 數據分析和報表

添加更多統計圖表：
- 每月收入趨勢
- 客戶來源分析
- 服務完成率
- 平均處理時間

---

## 📞 技術支援

### 需要幫助？

如果遇到問題，可以：

1. **檢查日誌**
   - Vercel：Dashboard → Deployments → Logs
   - Railway：Dashboard → Deployments → Logs

2. **查看錯誤訊息**
   - 瀏覽器 Console（F12）
   - 網絡請求（Network tab）

3. **測試 API**
   ```bash
   # 測試後台 API
   curl -X POST https://destinykey-production.up.railway.app/trpc/admin.verifyPassword \
     -H "Content-Type: application/json" \
     -d '{"password":"destiny2025"}'
   ```

---

## ✅ 檢查清單

部署前確認：

```
□ 數據庫表 orders 已創建
□ 環境變數 ADMIN_PASSWORD 已設定
□ 環境變數 DATABASE_URL 正確
□ 環境變數 STRIPE_SECRET_KEY 正確
□ 環境變數 FRONTEND_URL 正確
□ 前端路由 /admin 和 /admin/dashboard 已添加
□ 後端路由 admin 已添加到 appRouter
□ 可以訪問 /admin 登入頁面
□ 可以成功登入後台
□ 可以查看訂單列表
□ 可以查看訂單詳情
□ 可以更新訂單狀態
□ 測試創建新訂單並在後台查看
```

---

## 🎉 完成！

現在您可以：
1. 訪問 `https://destiny-key.vercel.app/admin`
2. 使用密碼登入
3. 查看和管理所有付費客戶
4. 追蹤訂單狀態
5. 提供專業的號碼推薦服務

祝生意興隆！💰✨
