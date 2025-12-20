import { router } from './trpc';
import { analysisRouter } from '../routers/analysisDetailed';
import { paymentRouter } from '../routers/payment';
import { adminRouter } from '../routers/admin';

export const appRouter = router({
  analysis: analysisRouter,
  payment: paymentRouter,
  admin: adminRouter
});

export type AppRouter = typeof appRouter;
