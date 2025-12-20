import { z } from 'zod';
import { publicProcedure, router } from '../_core/trpc';
import { db } from '../_core/db';
import { orders } from '../../drizzle/schema';
import { desc, like, or, eq } from 'drizzle-orm';

// 簡單的管理員密碼驗證（可以後續升級為 JWT）
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'destiny2025';

export const adminRouter = router({
  // 驗證管理員密碼
  verifyPassword: publicProcedure
    .input(z.object({
      password: z.string(),
    }))
    .mutation(async ({ input }) => {
      return {
        success: input.password === ADMIN_PASSWORD,
      };
    }),

  // 獲取所有訂單列表
  getOrders: publicProcedure
    .input(z.object({
      password: z.string(),
      page: z.number().default(1),
      pageSize: z.number().default(20),
      search: z.string().optional(),
      status: z.enum(['all', 'pending', 'processing', 'completed']).default('all'),
    }))
    .query(async ({ input }) => {
      // 驗證密碼
      if (input.password !== ADMIN_PASSWORD) {
        throw new Error('Invalid password');
      }

      try {
        const offset = (input.page - 1) * input.pageSize;
        
        // 構建查詢條件
        let whereConditions: any[] = [];
        
        // 搜尋條件（姓名、電話、email）
        if (input.search) {
          whereConditions.push(
            or(
              like(orders.customerName, `%${input.search}%`),
              like(orders.phoneNumber, `%${input.search}%`),
              like(orders.customerEmail, `%${input.search}%`)
            )
          );
        }
        
        // 狀態篩選
        if (input.status !== 'all') {
          whereConditions.push(eq(orders.serviceStatus, input.status));
        }

        // 查詢訂單
        const ordersList = await db
          .select()
          .from(orders)
          .where(whereConditions.length > 0 ? whereConditions[0] : undefined)
          .orderBy(desc(orders.createdAt))
          .limit(input.pageSize)
          .offset(offset);

        // 獲取總數
        const totalCount = await db
          .select()
          .from(orders)
          .where(whereConditions.length > 0 ? whereConditions[0] : undefined);

        return {
          orders: ordersList,
          total: totalCount.length,
          page: input.page,
          pageSize: input.pageSize,
          totalPages: Math.ceil(totalCount.length / input.pageSize),
        };
      } catch (error: any) {
        throw new Error(`Failed to fetch orders: ${error.message}`);
      }
    }),

  // 獲取單個訂單詳情
  getOrderById: publicProcedure
    .input(z.object({
      password: z.string(),
      orderId: z.number(),
    }))
    .query(async ({ input }) => {
      // 驗證密碼
      if (input.password !== ADMIN_PASSWORD) {
        throw new Error('Invalid password');
      }

      try {
        const order = await db
          .select()
          .from(orders)
          .where(eq(orders.id, input.orderId))
          .limit(1);

        if (order.length === 0) {
          throw new Error('Order not found');
        }

        return order[0];
      } catch (error: any) {
        throw new Error(`Failed to fetch order: ${error.message}`);
      }
    }),

  // 更新訂單狀態和備註
  updateOrder: publicProcedure
    .input(z.object({
      password: z.string(),
      orderId: z.number(),
      serviceStatus: z.enum(['pending', 'processing', 'completed']).optional(),
      notes: z.string().optional(),
      recommendedNumbers: z.array(z.object({
        number: z.string(),
        score: z.number(),
        reason: z.string(),
      })).optional(),
    }))
    .mutation(async ({ input }) => {
      // 驗證密碼
      if (input.password !== ADMIN_PASSWORD) {
        throw new Error('Invalid password');
      }

      try {
        const updateData: any = {};
        
        if (input.serviceStatus) {
          updateData.serviceStatus = input.serviceStatus;
          if (input.serviceStatus === 'completed') {
            updateData.completedAt = new Date();
          }
        }
        
        if (input.notes !== undefined) {
          updateData.notes = input.notes;
        }
        
        if (input.recommendedNumbers) {
          updateData.recommendedNumbers = input.recommendedNumbers;
        }

        await db
          .update(orders)
          .set(updateData)
          .where(eq(orders.id, input.orderId));

        return { success: true };
      } catch (error: any) {
        throw new Error(`Failed to update order: ${error.message}`);
      }
    }),

  // 獲取統計數據
  getStats: publicProcedure
    .input(z.object({
      password: z.string(),
    }))
    .query(async ({ input }) => {
      // 驗證密碼
      if (input.password !== ADMIN_PASSWORD) {
        throw new Error('Invalid password');
      }

      try {
        const allOrders = await db.select().from(orders);
        
        const stats = {
          totalOrders: allOrders.length,
          pendingOrders: allOrders.filter(o => o.serviceStatus === 'pending').length,
          processingOrders: allOrders.filter(o => o.serviceStatus === 'processing').length,
          completedOrders: allOrders.filter(o => o.serviceStatus === 'completed').length,
          totalRevenue: allOrders.reduce((sum, o) => sum + Number(o.amountTotal || 0), 0),
          averageOrderValue: allOrders.length > 0 
            ? allOrders.reduce((sum, o) => sum + Number(o.amountTotal || 0), 0) / allOrders.length 
            : 0,
        };

        return stats;
      } catch (error: any) {
        throw new Error(`Failed to fetch stats: ${error.message}`);
      }
    }),
});
