import { mysqlTable, varchar, text, timestamp, int, json, decimal } from 'drizzle-orm/mysql-core';

export const analyses = mysqlTable('analyses', {
  id: int('id').primaryKey().autoincrement(),
  phoneNumber: varchar('phone_number', { length: 20 }).notNull(),
  combinations: json('combinations'),
  scores: json('scores'),
  summary: text('summary'),
  createdAt: timestamp('created_at').defaultNow()
});

export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  fullName: varchar('full_name', { length: 100 }),
  birthDate: varchar('birth_date', { length: 20 }),
  birthTime: varchar('birth_time', { length: 20 }),
  phoneNumber: varchar('phone_number', { length: 20 }),
  createdAt: timestamp('created_at').defaultNow()
});

// 新增：訂單記錄表
export const orders = mysqlTable('orders', {
  id: int('id').primaryKey().autoincrement(),
  // Stripe 相關
  stripeSessionId: varchar('stripe_session_id', { length: 255 }).unique(),
  stripePaymentStatus: varchar('stripe_payment_status', { length: 50 }),
  
  // 客戶資料
  customerName: varchar('customer_name', { length: 100 }).notNull(),
  customerEmail: varchar('customer_email', { length: 255 }),
  phoneNumber: varchar('phone_number', { length: 20 }).notNull(),
  
  // 額外資料（用於號碼推薦）
  birthDate: varchar('birth_date', { length: 20 }),
  birthTime: varchar('birth_time', { length: 20 }),
  idLastFour: varchar('id_last_four', { length: 10 }),
  goals: text('goals'), // 客戶目標（事業、財運、桃花等）
  
  // 付款資料
  amountTotal: decimal('amount_total', { precision: 10, scale: 2 }),
  currency: varchar('currency', { length: 10 }),
  
  // 服務狀態
  serviceStatus: varchar('service_status', { length: 50 }).default('pending'), // pending, processing, completed
  recommendedNumbers: json('recommended_numbers'), // 推薦的號碼列表
  notes: text('notes'), // 師傅備註
  
  // 時間戳記
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
  completedAt: timestamp('completed_at')
});
