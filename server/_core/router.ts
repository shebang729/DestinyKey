import { router } from './trpc';
import { analysisRouter } from '../routers/analysis';

export const appRouter = router({
  analysis: analysisRouter
});

export type AppRouter = typeof appRouter;
