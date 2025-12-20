import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '../../drizzle/schema';

// 創建數據庫連接池
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// 創建 MySQL 連接池
const poolConnection = mysql.createPool(connectionString);

// 創建 Drizzle 實例
export const db = drizzle(poolConnection, { schema, mode: 'default' });

// 導出連接池供其他用途
export const pool = poolConnection;
