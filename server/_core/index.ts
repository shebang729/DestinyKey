import express from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './router';

const app = express();
const PORT = process.env.PORT || 3001;

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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 命運之鑰 API 已啟動`);
  console.log(`🌐 CORS allowed origin: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});
