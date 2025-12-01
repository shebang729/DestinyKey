import { z } from 'zod';
import { publicProcedure, router } from '../_core/trpc';
import { analyzePhoneNumber, getImprovementSuggestions } from '../algorithms/magneticFields';

export const analysisRouter = router({
  freeAnalysis: publicProcedure
    .input(z.object({
      phoneNumber: z.string().min(8).max(20)
    }))
    .mutation(async ({ input }) => {
      const { phoneNumber } = input;
      
      // 分析號碼
      const analysis = analyzePhoneNumber(phoneNumber);
      const suggestions = getImprovementSuggestions(
        analysis.combinations,
        analysis.overallScores
      );
      
      return {
        phoneNumber,
        combinations: analysis.combinations,
        scores: analysis.overallScores,
        summary: analysis.summary,
        suggestions,
        timestamp: new Date().toISOString()
      };
    })
});
