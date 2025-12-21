import { z } from 'zod';
import { publicProcedure, router } from '../_core/trpc';
import { analyzePhoneNumber } from '../algorithms/magneticFieldsDetailed';
import { calculateBazi, getFiveElementsRelations } from '../algorithms/bazi';
import { scorePhoneNumber, getUrgencyDescription, getUrgencyDetailedDescription } from '../algorithms/numberScoring';
import { calculateEnhancedBazi } from '../algorithms/baziEnhanced';
import { generateRecommendedNumbers, analyzeExistingNumber } from '../algorithms/numberRecommendation';

export const analysisRouter = router({
  // 原有的詳細分析（保留向後兼容）
  detailedAnalysis: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      birthDate: z.string().optional(),
      phoneNumber: z.string().min(8).max(20)
    }))
    .mutation(async ({ input }) => {
      const { name, birthDate, phoneNumber } = input;
      
      // 計算八字
      let baziResult;
      if (birthDate) {
        const birth = new Date(birthDate);
        baziResult = calculateBazi(birth);
      } else {
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
      
      // 評分號碼
      const numberScore = scorePhoneNumber(phoneNumber);
      
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
          dayMasterAnalysis: baziResult.dayMasterAnalysis,
          zodiacFortune: baziResult.zodiacFortune,
          fiveElementsDetailed: baziResult.fiveElementsDetailed,
          careerFortune: baziResult.careerFortune,
          wealthFortune: baziResult.wealthFortune,
          relationshipFortune: baziResult.relationshipFortune,
          healthFortune: baziResult.healthFortune,
          recommendations: baziResult.recommendations,
          relations: fiveElementsRelations
        },
        magnetic: {
          combinations: magneticAnalysis.combinations,
          dominantField: magneticAnalysis.dominantField,
          scores: magneticAnalysis.overallScores
        },
        numberScore: {
          overall: numberScore.overall,
          magneticScore: numberScore.magneticScore,
          luckyPercentage: numberScore.luckyPercentage,
          neutralPercentage: numberScore.neutralPercentage,
          unluckyPercentage: numberScore.unluckyPercentage,
          urgency: numberScore.urgency,
          urgencyDescription: getUrgencyDescription(numberScore.urgency),
          urgencyDetailedDescription: getUrgencyDetailedDescription(numberScore.urgency),
          problems: numberScore.problems,
          suggestions: numberScore.suggestions,
          detailedAnalysis: numberScore.detailedAnalysis,
          potentialImpacts: numberScore.potentialImpacts
        },
        timestamp: new Date().toISOString()
      };
    }),

  // 新增：增強版詳細分析
  enhancedAnalysis: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      birthDate: z.string(), // 必填
      phoneNumber: z.string().min(8).max(20)
    }))
    .mutation(async ({ input }) => {
      const { name, birthDate, phoneNumber } = input;
      
      // 計算增強版八字
      const birth = new Date(birthDate);
      const baziResult = calculateEnhancedBazi(birth);
      
      // 分析電話號碼磁場
      const magneticAnalysis = analyzePhoneNumber(phoneNumber);
      
      // 分析現有號碼與八字的配合
      const numberAnalysis = analyzeExistingNumber(phoneNumber, baziResult);
      
      // 生成推薦號碼
      const recommendations = generateRecommendedNumbers(baziResult, 5);
      
      // 獲取五行關係
      const fiveElementsRelations = getFiveElementsRelations();
      
      return {
        name,
        birthDate,
        phoneNumber,
        
        // 增強版八字分析
        bazi: {
          fourPillars: baziResult.fourPillars,
          zodiac: baziResult.zodiac,
          fiveElements: baziResult.fiveElements,
          dayMasterStrength: baziResult.dayMasterStrength,
          usefulGod: baziResult.usefulGod,
          joyfulGod: baziResult.joyfulGod,
          tabooGod: baziResult.tabooGod,
          tenGodsAnalysis: baziResult.tenGodsAnalysis,
          spiritsAnalysis: baziResult.spiritsAnalysis,
          detailedAnalysis: baziResult.detailedAnalysis,
          strengths: baziResult.strengths,
          weaknesses: baziResult.weaknesses,
          recommendations: baziResult.recommendations,
          relations: fiveElementsRelations
        },
        
        // 磁場分析
        magnetic: {
          combinations: magneticAnalysis.combinations,
          dominantField: magneticAnalysis.dominantField,
          scores: magneticAnalysis.overallScores
        },
        
        // 現有號碼分析
        currentNumberAnalysis: {
          score: numberAnalysis.score,
          magneticAnalysis: numberAnalysis.magneticAnalysis,
          fiveElementsAnalysis: numberAnalysis.fiveElementsAnalysis,
          recommendations: numberAnalysis.recommendations
        },
        
        // 推薦號碼
        recommendedNumbers: recommendations,
        
        timestamp: new Date().toISOString()
      };
    }),

  // 新增：僅生成推薦號碼
  recommendNumbers: publicProcedure
    .input(z.object({
      birthDate: z.string(),
      count: z.number().min(1).max(10).optional()
    }))
    .mutation(async ({ input }) => {
      const { birthDate, count = 5 } = input;
      
      // 計算八字
      const birth = new Date(birthDate);
      const baziResult = calculateEnhancedBazi(birth);
      
      // 生成推薦號碼
      const recommendations = generateRecommendedNumbers(baziResult, count);
      
      return {
        recommendations,
        baziSummary: {
          dayMasterElement: baziResult.fourPillars.day.element,
          dayMasterStrength: baziResult.dayMasterStrength,
          usefulGod: baziResult.usefulGod,
          tabooGod: baziResult.tabooGod
        },
        timestamp: new Date().toISOString()
      };
    }),

  // 新增：分析號碼與八字配合度
  analyzeNumberMatch: publicProcedure
    .input(z.object({
      phoneNumber: z.string().min(8).max(20),
      birthDate: z.string()
    }))
    .mutation(async ({ input }) => {
      const { phoneNumber, birthDate } = input;
      
      // 計算八字
      const birth = new Date(birthDate);
      const baziResult = calculateEnhancedBazi(birth);
      
      // 分析號碼
      const analysis = analyzeExistingNumber(phoneNumber, baziResult);
      
      return {
        phoneNumber,
        analysis,
        baziSummary: {
          dayMasterElement: baziResult.fourPillars.day.element,
          dayMasterStrength: baziResult.dayMasterStrength,
          usefulGod: baziResult.usefulGod,
          tabooGod: baziResult.tabooGod
        },
        timestamp: new Date().toISOString()
      };
    })
});
