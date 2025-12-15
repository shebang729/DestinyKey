import { z } from 'zod';
import { publicProcedure, router } from '../_core/trpc';
import { analyzePhoneNumber } from '../algorithms/magneticFieldsDetailed';
import { calculateBazi, getFiveElementsRelations } from '../algorithms/bazi';

export const analysisRouter = router({
  detailedAnalysis: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      birthDate: z.string(), // ISO 8601 format
      phoneNumber: z.string().min(8).max(20)
    }))
    .mutation(async ({ input }) => {
      const { name, birthDate, phoneNumber } = input;
      
      // 解析出生日期
      const birth = new Date(birthDate);
      
      // 計算八字
      const baziResult = calculateBazi(birth);
      
      // 分析電話號碼磁場
      const magneticAnalysis = analyzePhoneNumber(phoneNumber);
      
      // 獲取五行關係
      const fiveElementsRelations = getFiveElementsRelations();
      
      return {
        name,
        birthDate,
        phoneNumber,
        bazi: {
          year: baziResult.year,
          month: baziResult.month,
          day: baziResult.day,
          hour: baziResult.hour,
          zodiac: baziResult.zodiac,
          fiveElements: baziResult.fiveElements,
          analysis: baziResult.analysis,
          strengths: baziResult.strengths,
          weaknesses: baziResult.weaknesses,
          relations: fiveElementsRelations
        },
        magnetic: {
          combinations: magneticAnalysis.combinations,
          dominantField: magneticAnalysis.dominantField,
          scores: magneticAnalysis.overallScores
        },
        timestamp: new Date().toISOString()
      };
    })
});
