import express from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './router';

const app = express();

// 詳細的環境變數日誌
console.log('=== 環境變數檢查 ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT (from env):', process.env.PORT);
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
console.log('===================');

const PORT = parseInt(process.env.PORT || '3001', 10);

// CORS 配置
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// tRPC 中間件
app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext: () => ({})
  })
);

// 健康檢查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: '命運之鑰 API 運行中' });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 命運之鑰 API 已啟動`);
  console.log(`🌐 CORS allowed origin: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`🔗 Listening on 0.0.0.0:${PORT}`);
});

server.on('error', (error: any) => {
  console.error('❌ Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
  }
  process.exit(1);
});
