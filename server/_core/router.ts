import { router } from './trpc';
import { analysisRouter } from '../routers/analysisDetailed';
import { paymentRouter } from '../routers/payment';

export const appRouter = router({
  analysis: analysisRouter,
  payment: paymentRouter
});

export type AppRouter = typeof appRouter;
