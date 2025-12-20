import { z } from 'zod';
import { publicProcedure, router } from '../_core/trpc';
import { db } from '../_core/db';
import { orders } from '../../drizzle/schema';
import Stripe from 'stripe';
import { eq } from 'drizzle-orm';

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
      birthDate: z.string().optional(),
      birthTime: z.string().optional(),
      idLastFour: z.string().optional(),
      goals: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { name, phoneNumber, email, birthDate, birthTime, idLastFour, goals } = input;

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
                  images: ['https://destiny-key.vercel.app/logo.png'],
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
            birthDate: birthDate || '',
            birthTime: birthTime || '',
            idLastFour: idLastFour || '',
            goals: goals || '',
          },
        });

        // 保存訂單到數據庫（初始狀態為 pending）
        await db.insert(orders).values({
          stripeSessionId: session.id,
          stripePaymentStatus: 'unpaid',
          customerName: name,
          customerEmail: email || null,
          phoneNumber: phoneNumber,
          birthDate: birthDate || null,
          birthTime: birthTime || null,
          idLastFour: idLastFour || null,
          goals: goals || null,
          amountTotal: '3888.00',
          currency: 'HKD',
          serviceStatus: 'pending',
        });

        return {
          sessionId: session.id,
          url: session.url,
        };
      } catch (error: any) {
        throw new Error(`Failed to create checkout session: ${error.message}`);
      }
    }),

  // 驗證支付狀態並更新訂單
  verifyPayment: publicProcedure
    .input(z.object({
      sessionId: z.string(),
    }))
    .query(async ({ input }) => {
      try {
        const session = await stripe.checkout.sessions.retrieve(input.sessionId);
        
        // 更新數據庫中的訂單狀態
        await db
          .update(orders)
          .set({
            stripePaymentStatus: session.payment_status,
          })
          .where(eq(orders.stripeSessionId, input.sessionId));

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

  // Webhook 接收 Stripe 事件（用於自動更新訂單狀態）
  handleWebhook: publicProcedure
    .input(z.object({
      signature: z.string(),
      payload: z.string(),
    }))
    .mutation(async ({ input }) => {
      try {
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        if (!webhookSecret) {
          throw new Error('Webhook secret not configured');
        }

        // 驗證 webhook 簽名
        const event = stripe.webhooks.constructEvent(
          input.payload,
          input.signature,
          webhookSecret
        );

        // 處理不同的事件類型
        if (event.type === 'checkout.session.completed') {
          const session = event.data.object as Stripe.Checkout.Session;
          
          // 更新訂單狀態為已付款
          await db
            .update(orders)
            .set({
              stripePaymentStatus: 'paid',
            })
            .where(eq(orders.stripeSessionId, session.id));
        }

        return { received: true };
      } catch (error: any) {
        throw new Error(`Webhook error: ${error.message}`);
      }
    }),
});
