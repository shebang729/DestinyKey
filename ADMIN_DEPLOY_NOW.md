# 🚀 後台系統快速部署指南

## ✅ 已完成的工作

1. ✅ 數據庫 Schema 已更新（新增 orders 表）
2. ✅ 後台 API 已開發（admin router）
3. ✅ 後台前端已開發（登入頁面 + 儀表板）
4. ✅ 支付流程已更新（自動保存訂單）
5. ✅ 代碼已推送到 GitHub
6. ✅ Vercel 和 Railway 正在自動部署

---

## 🎯 您需要做的 3 個步驟

### 步驟 1：執行數據庫遷移（5 分鐘）

#### 如果您使用 **Railway MySQL**：

1. 前往 Railway Dashboard：https://railway.app/dashboard
2. 選擇您的 MySQL 服務
3. 點擊「Connect」
4. 複製連接命令（類似 `mysql -h xxx -u xxx -p`）
5. 在本地終端執行：

```bash
# 連接到數據庫
mysql -h [主機] -u [用戶名] -p

# 輸入密碼後，執行以下 SQL：
```

```sql
-- 創建訂單表
CREATE TABLE IF NOT EXISTS `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `stripe_session_id` VARCHAR(255) UNIQUE,
  `stripe_payment_status` VARCHAR(50),
  `customer_name` VARCHAR(100) NOT NULL,
  `customer_email` VARCHAR(255),
  `phone_number` VARCHAR(20) NOT NULL,
  `birth_date` VARCHAR(20),
  `birth_time` VARCHAR(20),
  `id_last_four` VARCHAR(10),
  `goals` TEXT,
  `amount_total` DECIMAL(10, 2),
  `currency` VARCHAR(10),
  `service_status` VARCHAR(50) DEFAULT 'pending',
  `recommended_numbers` JSON,
  `notes` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `completed_at` TIMESTAMP NULL
);

-- 創建索引
CREATE INDEX idx_customer_name ON orders(customer_name);
CREATE INDEX idx_phone_number ON orders(phone_number);
CREATE INDEX idx_service_status ON orders(service_status);
CREATE INDEX idx_created_at ON orders(created_at);

-- 確認表已創建
SHOW TABLES;
DESCRIBE orders;
```

#### 如果您使用 **TiDB Cloud**：

1. 前往 TiDB Cloud Dashboard
2. 選擇您的 Cluster
3. 點擊「SQL Editor」或「Chat2Query」
4. 複製上面的 SQL 並執行
5. 確認顯示「Query OK」

---

### 步驟 2：設定環境變數（3 分鐘）

#### Railway（後端）：

1. 前往 Railway Dashboard
2. 選擇您的 destinykey 專案
3. 點擊「Variables」標籤
4. 添加新變數：

```bash
ADMIN_PASSWORD=destiny2025
```

**⚠️ 重要：** 請立即修改為您自己的強密碼！

建議密碼範例：
```
Dk@2025!HkP#mN
DestinyKey$2025#Admin
HK_Admin_2025!@#
```

5. 點擊「Deploy」重新部署

#### Vercel（前端）：

不需要額外設定，已自動部署。

---

### 步驟 3：測試後台（5 分鐘）

#### 3.1 等待部署完成

1. **Vercel 部署狀態：**
   - 前往：https://vercel.com/dashboard
   - 確認 destiny-key 顯示綠色 ✓（通常 1-2 分鐘）

2. **Railway 部署狀態：**
   - 前往：https://railway.app/dashboard
   - 確認 destinykey 顯示 Active（通常 2-3 分鐘）

#### 3.2 訪問後台

1. 打開瀏覽器
2. 前往：**https://destiny-key.vercel.app/admin**
3. 輸入密碼：`destiny2025`（或您設定的密碼）
4. 點擊「登入」

#### 3.3 確認功能正常

**應該看到：**
- ✅ 儀表板統計卡片（總訂單、待處理等）
- ✅ 搜尋和篩選功能
- ✅ 訂單列表（可能是空的，這是正常的）

**測試功能：**
1. 嘗試搜尋（輸入任何文字）
2. 嘗試切換狀態篩選
3. 如果有訂單，點擊「查看詳情」

#### 3.4 測試完整流程

**創建測試訂單：**

1. 前往：https://destiny-key.vercel.app
2. 輸入電話號碼進行分析
3. 點擊「立即獲取專屬號碼推薦」
4. 填寫表單：
   ```
   姓名：測試客戶
   電話：12345678
   Email：test@example.com
   出生日期：1990-01-01
   出生時間：10:00
   身份證後4碼：1234
   目標：測試訂單
   ```
5. 使用測試信用卡完成付款：
   ```
   卡號：4242 4242 4242 4242
   到期日：任何未來日期（例如 12/25）
   CVC：任何 3 位數字（例如 123）
   ```

**在後台查看：**

1. 重新整理後台頁面
2. 應該看到新的測試訂單
3. 點擊「查看詳情」
4. 確認所有資料都正確顯示
5. 嘗試更新狀態為「處理中」
6. 添加備註：「這是測試訂單」
7. 點擊「保存更新」
8. 確認顯示「訂單更新成功！」

---

## 🎉 完成！

如果以上步驟都成功，您的後台系統已經完全可用！

---

## 📱 後台使用方法

### 日常工作流程

**每天早上：**
1. 登入後台：https://destiny-key.vercel.app/admin
2. 查看「待處理」訂單數量
3. 點擊訂單查看客戶資料

**處理訂單：**
1. 記錄客戶資料：
   - 當前號碼
   - 出生日期/時間
   - 身份證後 4 碼
   - 目標（事業/財運/桃花）

2. 進行命理分析（使用八星磁場理論）

3. 選擇 3-5 個推薦號碼

4. 聯繫客戶：
   - 透過 Email 發送推薦
   - 或透過 WhatsApp：+852 [客戶電話]

5. 更新後台：
   - 狀態改為「已完成」
   - 在備註記錄發送時間
   - 點擊「保存更新」

---

## 🔒 安全提醒

### ⚠️ 立即修改密碼！

預設密碼 `destiny2025` 只是臨時的，請立即修改：

1. 前往 Railway Dashboard
2. 進入 Variables
3. 修改 `ADMIN_PASSWORD`
4. 使用強密碼（至少 12 個字符，包含大小寫、數字、符號）
5. 重新部署

### 🔐 密碼管理建議

**好的密碼範例：**
```
✅ Dk@2025!HkP#mN
✅ DestinyKey$2025#Admin
✅ HK_Admin_2025!@#
```

**不好的密碼：**
```
❌ 123456
❌ password
❌ destiny
❌ admin
```

**密碼存儲：**
- 使用密碼管理器（1Password、LastPass）
- 不要寫在紙上或存在手機備忘錄
- 不要分享給不需要的人

---

## 📊 功能說明

### 儀表板統計

- **總訂單**：所有訂單總數
- **待處理**：新訂單，需要開始處理
- **處理中**：正在分析和準備推薦
- **已完成**：已發送推薦給客戶
- **總收入**：所有訂單的總金額（HK$）

### 訂單狀態

| 狀態 | 說明 | 何時使用 |
|------|------|---------|
| 待處理 | 剛收到的新訂單 | 客戶付款後自動設定 |
| 處理中 | 正在分析和準備推薦 | 開始處理訂單時 |
| 已完成 | 已發送推薦給客戶 | 完成服務後 |

### 客戶資料

後台會顯示客戶填寫的所有資料：

**基本資料：**
- 姓名
- 電話號碼
- Email

**命理資料：**
- 出生日期
- 出生時間
- 身份證後 4 碼（用於精準分析）

**需求：**
- 目標（事業、財運、桃花、健康等）

---

## 🐛 常見問題

### 1. 無法登入

**問題：** 輸入密碼後顯示「密碼錯誤」

**解決：**
1. 確認 Railway 的 `ADMIN_PASSWORD` 已設定
2. 等待部署完成（2-3 分鐘）
3. 清除瀏覽器快取（Ctrl+Shift+Delete）
4. 重新嘗試

---

### 2. 看不到訂單

**問題：** 後台顯示 0 筆訂單

**解決：**
1. 確認數據庫表 `orders` 已創建
2. 創建一筆測試訂單
3. 重新整理頁面
4. 檢查 Railway 日誌是否有錯誤

---

### 3. 更新訂單失敗

**問題：** 點擊「保存更新」後顯示錯誤

**解決：**
1. 檢查網絡連接
2. 重新登入後台
3. 確認 Railway 服務正常運行
4. 查看瀏覽器 Console（F12）的錯誤訊息

---

### 4. 付款後沒有訂單

**問題：** 客戶付款後後台沒有記錄

**解決：**
1. 確認 Stripe 付款成功
2. 檢查 Railway 日誌
3. 確認數據庫連接正常
4. 重新整理後台頁面

---

## 📞 需要幫助？

### 檢查日誌

**Vercel 日誌：**
1. 前往 https://vercel.com/dashboard
2. 選擇 destiny-key
3. 點擊 Deployments
4. 查看最新部署的 Logs

**Railway 日誌：**
1. 前往 https://railway.app/dashboard
2. 選擇 destinykey
3. 點擊 Deployments
4. 查看最新部署的 Logs

### 測試 API

```bash
# 測試後台 API
curl -X POST https://destinykey-production.up.railway.app/trpc/admin.verifyPassword \
  -H "Content-Type: application/json" \
  -d '{"password":"destiny2025"}'

# 應該返回：
{"result":{"data":{"success":true}}}
```

---

## 📋 部署檢查清單

完成後請確認：

```
□ 數據庫表 orders 已創建
□ Railway 環境變數 ADMIN_PASSWORD 已設定
□ Vercel 部署成功（綠色 ✓）
□ Railway 部署成功（Active）
□ 可以訪問 /admin 登入頁面
□ 可以成功登入後台
□ 可以看到儀表板
□ 測試訂單已創建
□ 可以在後台看到測試訂單
□ 可以查看訂單詳情
□ 可以更新訂單狀態
□ 可以添加備註
□ 已修改預設密碼
```

---

## 🎊 恭喜！

您的後台管理系統已經完全部署並可用！

**後台網址：** https://destiny-key.vercel.app/admin

**預設密碼：** destiny2025（請立即修改）

現在您可以：
- ✅ 查看所有付費客戶
- ✅ 管理訂單狀態
- ✅ 記錄客戶資料
- ✅ 追蹤服務進度
- ✅ 提供專業的號碼推薦服務

祝生意興隆！💰✨

---

## 📚 相關文件

- **完整使用指南：** `ADMIN_BACKEND_GUIDE.md`
- **數據庫遷移：** `drizzle/migrations/0002_add_orders_table.sql`
- **後台 API：** `server/routers/admin.ts`
- **後台前端：** `client/src/pages/AdminDashboard.tsx`
