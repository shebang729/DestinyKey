# Stripe 支付整合設定指南

## 🎯 功能說明

已成功整合 Stripe 支付功能，用戶可以直接在網站上支付 **HK$3,888** 購買「尋找最合適電話號碼」服務。

---

## 🔑 需要設定的環境變數

### **Railway（後端）環境變數**

請在 Railway 專案設定中添加以下環境變數：

1. **STRIPE_SECRET_KEY**
   - 值：`sk_live_xxxxx`（正式環境）或 `sk_test_xxxxx`（測試環境）
   - 說明：Stripe 的 Secret Key，用於後端 API 調用
   - 獲取方式：登入 [Stripe Dashboard](https://dashboard.stripe.com/apikeys)

2. **FRONTEND_URL**
   - 值：`https://destiny-key.vercel.app`
   - 說明：前端網站 URL，用於付款成功/取消後的跳轉

### **Vercel（前端）環境變數**

前端不需要額外的 Stripe 環境變數，現有的 `VITE_API_URL` 已足夠。

---

## 📝 如何獲取 Stripe API Key

### **步驟 1：註冊/登入 Stripe**
1. 前往 [Stripe 官網](https://stripe.com)
2. 註冊帳號或登入現有帳號
3. 完成公司資料填寫（需要商業登記證等）

### **步驟 2：獲取 API Keys**
1. 登入 [Stripe Dashboard](https://dashboard.stripe.com)
2. 點擊右上角「開發者」→「API 金鑰」
3. 複製以下金鑰：
   - **測試環境**：`sk_test_xxxxx`（用於開發測試）
   - **正式環境**：`sk_live_xxxxx`（用於正式上線）

### **步驟 3：設定 Webhook（可選）**
如果需要接收付款事件通知：
1. 在 Stripe Dashboard 中點擊「開發者」→「Webhooks」
2. 添加端點：`https://destinykey-production.up.railway.app/webhook/stripe`
3. 選擇要接收的事件：
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`

---

## 🚀 部署步驟

### **1. 在 Railway 設定環境變數**

```bash
# 登入 Railway Dashboard
# 進入 destiny-key 專案
# 點擊「Variables」標籤
# 添加以下變數：

STRIPE_SECRET_KEY=sk_test_xxxxx  # 先用測試金鑰
FRONTEND_URL=https://destiny-key.vercel.app
```

### **2. 推送代碼到 GitHub**

```bash
cd /home/ubuntu/destiny-key-app
git add .
git commit -m "feat: 整合 Stripe 支付功能"
git push origin main
```

### **3. 等待自動部署**
- Railway 會自動部署後端
- Vercel 會自動部署前端

### **4. 測試付款流程**

#### **測試模式（使用測試金鑰）**
使用以下測試卡號：
- **成功付款**：`4242 4242 4242 4242`
- **失敗付款**：`4000 0000 0000 0002`
- **需要 3D 驗證**：`4000 0027 6000 3184`
- 到期日：任何未來日期（如 `12/34`）
- CVC：任何 3 位數字（如 `123`）
- 郵遞區號：任何 5 位數字（如 `12345`）

#### **測試流程**
1. 前往 https://destiny-key.vercel.app
2. 填寫姓名、生日、電話號碼
3. 點擊「開始分析」
4. 在結果頁面點擊「立即購買 - 安全付款」
5. 在 Stripe Checkout 頁面輸入測試卡號
6. 完成付款後應跳轉到「付款成功」頁面

---

## 💰 收費說明

### **Stripe 手續費**
- 香港信用卡：**3.4% + HK$2.35** 每筆交易
- 國際信用卡：**3.9% + HK$2.35** 每筆交易

### **實際收入計算**
- 售價：HK$3,888
- Stripe 手續費（香港卡）：HK$134.34
- **實際收入：HK$3,753.66**

---

## 🔒 安全性

### **已實施的安全措施**
1. ✅ Stripe Secret Key 儲存在環境變數中（不會暴露在代碼中）
2. ✅ 使用 Stripe Checkout（PCI DSS 合規）
3. ✅ 付款在 Stripe 官方頁面完成（不經過我們的伺服器）
4. ✅ 付款驗證機制（防止偽造付款）

### **注意事項**
- ⚠️ 絕對不要將 `STRIPE_SECRET_KEY` 提交到 Git
- ⚠️ 測試時使用 `sk_test_` 開頭的金鑰
- ⚠️ 正式上線時才切換到 `sk_live_` 金鑰

---

## 📊 付款流程圖

```
用戶填寫資料
    ↓
查看分析結果
    ↓
點擊「立即購買」按鈕
    ↓
後端創建 Stripe Checkout Session
    ↓
跳轉到 Stripe 付款頁面
    ↓
用戶輸入信用卡資料
    ↓
Stripe 處理付款
    ↓
付款成功 → 跳轉到 /payment-success
付款失敗 → 跳轉到 /payment-cancelled
```

---

## 🎨 前端整合

### **付款按鈕**
位置：`/client/src/pages/ResultPageDetailed.tsx`

```tsx
<button
  onClick={handlePayment}
  disabled={isProcessingPayment}
  className="..."
>
  {isProcessingPayment ? '處理中...' : '立即購買 - 安全付款'}
</button>
```

### **付款成功頁面**
路徑：`/payment-success?session_id=xxx`
文件：`/client/src/pages/PaymentSuccess.tsx`

### **付款取消頁面**
路徑：`/payment-cancelled`
文件：`/client/src/pages/PaymentCancelled.tsx`

---

## 🔧 後端 API

### **創建付款 Session**
```typescript
// 路由：payment.createCheckoutSession
// 輸入：{ name, phoneNumber, email? }
// 輸出：{ sessionId, url }
```

### **驗證付款狀態**
```typescript
// 路由：payment.verifyPayment
// 輸入：{ sessionId }
// 輸出：{ status, customerName, phoneNumber, amountTotal, currency }
```

---

## 📞 客戶服務流程

### **付款成功後**
1. 系統自動跳轉到「付款成功」頁面
2. 顯示訂單詳情和下一步指引
3. 提示客戶：
   - 命理師將在 24 小時內透過 Instagram 聯繫
   - 請確保已關注 @destinykey.hk
   - 將推薦 3-5 個最佳號碼

### **您需要做的事**
1. 每天檢查 Stripe Dashboard 的新訂單
2. 透過 Instagram DM 聯繫客戶
3. 根據客戶的八字和磁場分析推薦號碼
4. 提供專業諮詢服務

---

## 🐛 常見問題

### **Q1: 付款按鈕點擊後沒反應？**
A: 檢查瀏覽器 Console 是否有錯誤，確認 Railway 的 `STRIPE_SECRET_KEY` 已設定。

### **Q2: 付款後跳轉到 404 頁面？**
A: 確認 Railway 的 `FRONTEND_URL` 環境變數設定正確。

### **Q3: 如何查看付款記錄？**
A: 登入 [Stripe Dashboard](https://dashboard.stripe.com/payments) 查看所有交易。

### **Q4: 如何退款？**
A: 在 Stripe Dashboard 中找到該筆交易，點擊「退款」按鈕。

### **Q5: 測試模式和正式模式如何切換？**
A: 在 Railway 中將 `STRIPE_SECRET_KEY` 從 `sk_test_` 改為 `sk_live_`。

---

## 📈 未來優化建議

1. **添加 Webhook 處理**
   - 自動發送確認郵件
   - 記錄訂單到數據庫
   - 自動通知 Instagram

2. **支援更多付款方式**
   - Apple Pay
   - Google Pay
   - 轉數快 FPS

3. **訂單管理系統**
   - 後台查看所有訂單
   - 訂單狀態追蹤
   - 客戶管理

4. **優惠碼功能**
   - 折扣碼
   - 推薦獎勵
   - 限時優惠

---

## ✅ 檢查清單

部署前請確認：

- [ ] Railway 已設定 `STRIPE_SECRET_KEY`
- [ ] Railway 已設定 `FRONTEND_URL`
- [ ] 代碼已推送到 GitHub
- [ ] Railway 和 Vercel 自動部署完成
- [ ] 使用測試卡號測試付款流程
- [ ] 付款成功頁面顯示正常
- [ ] 付款取消頁面顯示正常
- [ ] Stripe Dashboard 可以看到測試交易

正式上線前：

- [ ] 切換到正式 Stripe API Key (`sk_live_`)
- [ ] 完成 Stripe 帳號驗證（提交商業登記證等）
- [ ] 設定 Webhook（可選）
- [ ] 準備好 Instagram 客服流程
- [ ] 測試真實付款（小額測試）

---

**需要協助？** 請聯繫 Stripe 客服或查閱 [Stripe 文檔](https://stripe.com/docs)。
