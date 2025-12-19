import { z } from 'zod';
import { publicProcedure, router } from '../_core/trpc';
import { analyzePhoneNumber } from '../algorithms/magneticFieldsDetailed';
import { calculateBazi, getFiveElementsRelations } from '../algorithms/bazi';

export const analysisRouter = router({
  detailedAnalysis: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      birthDate: z.string().optional(), // ISO 8601 format, 選填
      phoneNumber: z.string().min(8).max(20)
    }))
    .mutation(async ({ input }) => {
      const { name, birthDate, phoneNumber } = input;
      
      // 計算八字（如果有提供出生日期）
      let baziResult;
      if (birthDate) {
        const birth = new Date(birthDate);
        baziResult = calculateBazi(birth);
      } else {
        // 使用預設八字（當沒有提供出生日期時）
        baziResult = {
          year: { stem: '甲', branch: '子', element: '木' },
          month: { stem: '丙', branch: '寅', element: '火' },
          day: { stem: '戊', branch: '辰', element: '土' },
          hour: { stem: '庚', branch: '午', element: '金' },
          zodiac: '鼠',
          fiveElements: { wood: 1, fire: 1, earth: 1, metal: 1, water: 1 },
          analysis: '未提供出生資訊，使用預設八字分析',
          strengths: ['平衡發展'],
          weaknesses: ['建議提供完整出生資訊以獲得更精準的分析']
        };
      }
      
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
