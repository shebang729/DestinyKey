import { mysqlTable, varchar, text, timestamp, int, json } from 'drizzle-orm/mysql-core';

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
