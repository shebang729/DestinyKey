import { z } from 'zod';
import { publicProcedure, router } from '../_core/trpc';
import Stripe from 'stripe';

// 初始化 Stripe（使用環境變數）
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

export const paymentRouter = router({
  // 創建 Checkout Session
  createCheckoutSession: publicProcedure
    .input(z.object({
      name: z.string(),
      phoneNumber: z.string(),
      email: z.string().email().optional(),
    }))
    .mutation(async ({ input }) => {
      const { name, phoneNumber, email } = input;

      try {
        // 創建 Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency: 'hkd',
                product_data: {
                  name: '命運之鑰 - 尋找最合適電話號碼服務',
                  description: `為 ${name} 尋找最佳電話號碼組合（當前號碼：${phoneNumber}）`,
                  images: ['https://destiny-key.vercel.app/logo.png'], // 可選：添加產品圖片
                },
                unit_amount: 388800, // HK$3,888.00（以分為單位）
              },
              quantity: 1,
            },
          ],
          mode: 'payment',
          success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.FRONTEND_URL}/payment-cancelled`,
          customer_email: email,
          metadata: {
            customerName: name,
            phoneNumber: phoneNumber,
          },
        });

        return {
          sessionId: session.id,
          url: session.url,
        };
      } catch (error: any) {
        throw new Error(`Failed to create checkout session: ${error.message}`);
      }
    }),

  // 驗證支付狀態
  verifyPayment: publicProcedure
    .input(z.object({
      sessionId: z.string(),
    }))
    .query(async ({ input }) => {
      try {
        const session = await stripe.checkout.sessions.retrieve(input.sessionId);
        
        return {
          status: session.payment_status,
          customerName: session.metadata?.customerName,
          phoneNumber: session.metadata?.phoneNumber,
          amountTotal: session.amount_total,
          currency: session.currency,
        };
      } catch (error: any) {
        throw new Error(`Failed to verify payment: ${error.message}`);
      }
    }),
});
