// 號碼推薦系統

import type { EnhancedBaziResult } from './baziEnhanced';

// 數字五行對應
const NUMBER_ELEMENTS: { [key: string]: string } = {
  '1': '水', '6': '水',
  '2': '火', '7': '火',
  '3': '木', '8': '木',
  '4': '金', '9': '金',
  '5': '土', '0': '土'
};

// 磁場數字組合
const MAGNETIC_FIELDS: { [key: string]: { name: string; numbers: string[][]; type: 'lucky' | 'neutral' | 'unlucky' } } = {
  tianyi: {
    name: '天醫',
    numbers: [['1', '3'], ['3', '1'], ['6', '8'], ['8', '6'], ['4', '9'], ['9', '4'], ['2', '7'], ['7', '2']],
    type: 'lucky'
  },
  yannian: {
    name: '延年',
    numbers: [['1', '9'], ['9', '1'], ['7', '8'], ['8', '7'], ['4', '3'], ['3', '4'], ['2', '6'], ['6', '2']],
    type: 'lucky'
  },
  shengqi: {
    name: '生氣',
    numbers: [['1', '4'], ['4', '1'], ['6', '7'], ['7', '6'], ['3', '9'], ['9', '3'], ['2', '8'], ['8', '2']],
    type: 'lucky'
  },
  fuwei: {
    name: '伏位',
    numbers: [['1', '1'], ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'], ['6', '6'], ['7', '7'], ['8', '8'], ['9', '9'], ['0', '0']],
    type: 'neutral'
  },
  jueming: {
    name: '絕命',
    numbers: [['1', '2'], ['2', '1'], ['6', '9'], ['9', '6'], ['4', '8'], ['8', '4'], ['3', '7'], ['7', '3']],
    type: 'unlucky'
  },
  wugui: {
    name: '五鬼',
    numbers: [['1', '8'], ['8', '1'], ['7', '9'], ['9', '7'], ['4', '6'], ['6', '4'], ['2', '3'], ['3', '2']],
    type: 'unlucky'
  },
  liusha: {
    name: '六煞',
    numbers: [['1', '6'], ['6', '1'], ['7', '4'], ['4', '7'], ['3', '8'], ['8', '3'], ['2', '9'], ['9', '2']],
    type: 'unlucky'
  },
  huohai: {
    name: '禍害',
    numbers: [['1', '7'], ['7', '1'], ['8', '9'], ['9', '8'], ['4', '6'], ['6', '4'], ['2', '3'], ['3', '2']],
    type: 'unlucky'
  }
};

interface RecommendedNumber {
  number: string;
  score: number;
  magneticAnalysis: {
    combinations: Array<{
      digits: string;
      field: string;
      type: 'lucky' | 'neutral' | 'unlucky';
    }>;
    luckyPercentage: number;
    neutralPercentage: number;
    unluckyPercentage: number;
  };
  fiveElementsAnalysis: {
    distribution: { [key: string]: number };
    matchScore: number;
    analysis: string;
  };
  detailedReason: string;
  strengths: string[];
  warnings: string[];
}

/**
 * 生成推薦號碼
 */
export function generateRecommendedNumbers(
  baziResult: any,
  count: number = 5
): RecommendedNumber[] {
  const recommendations: RecommendedNumber[] = [];
  const usefulElements = baziResult.usefulGod || [];
  const tabooElements = baziResult.tabooGod || [];
  
  // 生成候選號碼
  const candidates = generateCandidateNumbers(usefulElements, tabooElements, count * 3);
  
  // 評分和分析
  candidates.forEach(number => {
    const magneticAnalysis = analyzeMagneticFields(number);
    const fiveElementsAnalysis = analyzeFiveElements(number, usefulElements, tabooElements);
    const score = calculateScore(magneticAnalysis, fiveElementsAnalysis);
    const { detailedReason, strengths, warnings } = generateAnalysis(
      number,
      magneticAnalysis,
      fiveElementsAnalysis,
      baziResult
    );
    
    recommendations.push({
      number,
      score,
      magneticAnalysis,
      fiveElementsAnalysis,
      detailedReason,
      strengths,
      warnings
    });
  });
  
  // 排序並返回前 N 個
  return recommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}

/**
 * 生成候選號碼
 */
function generateCandidateNumbers(
  usefulElements: string[],
  tabooElements: string[],
  count: number
): string[] {
  const candidates: string[] = [];
  const usefulNumbers = getNumbersByElements(usefulElements);
  const luckyFields = ['tianyi', 'yannian', 'shengqi'];
  
  while (candidates.length < count) {
    let number = '';
    
    // 生成 8 位號碼
    for (let i = 0; i < 8; i++) {
      if (i < 7) {
        // 前 7 位盡量使用吉星磁場和用神數字
        if (Math.random() > 0.3 && usefulNumbers.length > 0) {
          // 70% 概率使用用神數字
          number += usefulNumbers[Math.floor(Math.random() * usefulNumbers.length)];
        } else {
          // 30% 概率使用吉星磁場
          const field = luckyFields[Math.floor(Math.random() * luckyFields.length)];
          const combo = MAGNETIC_FIELDS[field].numbers[Math.floor(Math.random() * MAGNETIC_FIELDS[field].numbers.length)];
          number += combo[Math.floor(Math.random() * combo.length)];
        }
      } else {
        // 最後一位使用用神數字
        if (usefulNumbers.length > 0) {
          number += usefulNumbers[Math.floor(Math.random() * usefulNumbers.length)];
        } else {
          number += String(Math.floor(Math.random() * 10));
        }
      }
    }
    
    // 避免重複
    if (!candidates.includes(number)) {
      candidates.push(number);
    }
  }
  
  return candidates;
}

/**
 * 根據五行獲取對應數字
 */
function getNumbersByElements(elements: string[]): string[] {
  const numbers: string[] = [];
  const elementNumberMap: { [key: string]: string[] } = {
    '木': ['3', '8'],
    '火': ['2', '7'],
    '土': ['5', '0'],
    '金': ['4', '9'],
    '水': ['1', '6']
  };
  
  elements.forEach(element => {
    if (elementNumberMap[element]) {
      numbers.push(...elementNumberMap[element]);
    }
  });
  
  return numbers;
}

/**
 * 分析磁場
 */
function analyzeMagneticFields(number: string) {
  const combinations: Array<{
    digits: string;
    field: string;
    type: 'lucky' | 'neutral' | 'unlucky';
  }> = [];
  
  // 分析每兩個數字的組合
  for (let i = 0; i < number.length - 1; i++) {
    const pair = [number[i], number[i + 1]];
    const field = findMagneticField(pair);
    
    if (field) {
      combinations.push({
        digits: pair.join(''),
        field: field.name,
        type: field.type
      });
    }
  }
  
  // 計算百分比
  const total = combinations.length;
  const lucky = combinations.filter(c => c.type === 'lucky').length;
  const neutral = combinations.filter(c => c.type === 'neutral').length;
  const unlucky = combinations.filter(c => c.type === 'unlucky').length;
  
  return {
    combinations,
    luckyPercentage: (lucky / total) * 100,
    neutralPercentage: (neutral / total) * 100,
    unluckyPercentage: (unlucky / total) * 100
  };
}

/**
 * 找出磁場
 */
function findMagneticField(pair: string[]): { name: string; type: 'lucky' | 'neutral' | 'unlucky' } | null {
  for (const [key, field] of Object.entries(MAGNETIC_FIELDS)) {
    if (field.numbers.some(combo => combo[0] === pair[0] && combo[1] === pair[1])) {
      return { name: field.name, type: field.type };
    }
  }
  return null;
}

/**
 * 分析五行
 */
function analyzeFiveElements(
  number: string,
  usefulElements: string[],
  tabooElements: string[]
) {
  const distribution: { [key: string]: number } = {
    '木': 0,
    '火': 0,
    '土': 0,
    '金': 0,
    '水': 0
  };
  
  // 統計每個數字的五行
  for (const digit of number) {
    const element = NUMBER_ELEMENTS[digit];
    if (element) {
      distribution[element]++;
    }
  }
  
  // 計算匹配分數
  let matchScore = 0;
  let usefulCount = 0;
  let tabooCount = 0;
  
  Object.entries(distribution).forEach(([element, count]) => {
    if (usefulElements.includes(element)) {
      usefulCount += count;
      matchScore += count * 10;
    } else if (tabooElements.includes(element)) {
      tabooCount += count;
      matchScore -= count * 5;
    }
  });
  
  // 標準化分數（0-100）
  matchScore = Math.max(0, Math.min(100, 50 + matchScore));
  
  // 生成分析
  const analysis = generateFiveElementsAnalysis(distribution, usefulElements, tabooElements, usefulCount, tabooCount);
  
  return {
    distribution,
    matchScore,
    analysis
  };
}

/**
 * 生成五行分析
 */
function generateFiveElementsAnalysis(
  distribution: { [key: string]: number },
  usefulElements: string[],
  tabooElements: string[],
  usefulCount: number,
  tabooCount: number
): string {
  const total = Object.values(distribution).reduce((sum, val) => sum + val, 0);
  const usefulPercentage = (usefulCount / total) * 100;
  const tabooPercentage = (tabooCount / total) * 100;
  
  let analysis = `此號碼包含 ${usefulCount} 個用神數字（${usefulPercentage.toFixed(0)}%）`;
  
  if (tabooCount > 0) {
    analysis += `，${tabooCount} 個忌神數字（${tabooPercentage.toFixed(0)}%）`;
  }
  
  analysis += '。';
  
  if (usefulPercentage >= 50) {
    analysis += '用神數字佔比理想，能夠有效補益命格。';
  } else if (usefulPercentage >= 30) {
    analysis += '用神數字佔比適中，對命格有一定幫助。';
  } else {
    analysis += '用神數字佔比較少，建議選擇用神數字更多的號碼。';
  }
  
  if (tabooPercentage > 30) {
    analysis += '忌神數字較多，可能對命格有不利影響。';
  }
  
  return analysis;
}

/**
 * 計算綜合分數
 */
function calculateScore(
  magneticAnalysis: any,
  fiveElementsAnalysis: any
): number {
  // 磁場分數（60%權重）
  const magneticScore = (
    magneticAnalysis.luckyPercentage * 1.0 +
    magneticAnalysis.neutralPercentage * 0.5 +
    magneticAnalysis.unluckyPercentage * 0.0
  ) * 0.6;
  
  // 五行分數（40%權重）
  const elementScore = fiveElementsAnalysis.matchScore * 0.4;
  
  return Math.round(magneticScore + elementScore);
}

/**
 * 生成詳細分析
 */
function generateAnalysis(
  number: string,
  magneticAnalysis: any,
  fiveElementsAnalysis: any,
  baziResult: any
) {
  const strengths: string[] = [];
  const warnings: string[] = [];
  
  // 磁場優勢
  if (magneticAnalysis.luckyPercentage >= 60) {
    strengths.push(`吉星磁場佔比 ${magneticAnalysis.luckyPercentage.toFixed(0)}%，能量強勁`);
  } else if (magneticAnalysis.luckyPercentage >= 40) {
    strengths.push(`吉星磁場佔比 ${magneticAnalysis.luckyPercentage.toFixed(0)}%，能量良好`);
  }
  
  // 五行優勢
  if (fiveElementsAnalysis.matchScore >= 70) {
    strengths.push('五行配合度極佳，與您的命格高度契合');
  } else if (fiveElementsAnalysis.matchScore >= 50) {
    strengths.push('五行配合度良好，能夠補益命格');
  }
  
  // 警告
  if (magneticAnalysis.unluckyPercentage > 30) {
    warnings.push(`凶星磁場佔比 ${magneticAnalysis.unluckyPercentage.toFixed(0)}%，建議謹慎選擇`);
  }
  
  if (fiveElementsAnalysis.matchScore < 40) {
    warnings.push('五行配合度較低，可能無法有效補益命格');
  }
  
  // 檢查連續數字
  if (hasConsecutiveNumbers(number)) {
    warnings.push('包含連續數字，能量過於流動，可能不夠穩定');
  }
  
  // 檢查重複數字
  const repeatCount = countRepeatingDigits(number);
  if (repeatCount >= 4) {
    warnings.push('重複數字過多，能量過於集中，容易走極端');
  }
  
  // 生成詳細原因
  let detailedReason = `【推薦理由】\n\n`;
  
  detailedReason += `1. 磁場組合分析：\n`;
  detailedReason += `   - 吉星磁場：${magneticAnalysis.luckyPercentage.toFixed(0)}%\n`;
  detailedReason += `   - 中性磁場：${magneticAnalysis.neutralPercentage.toFixed(0)}%\n`;
  detailedReason += `   - 凶星磁場：${magneticAnalysis.unluckyPercentage.toFixed(0)}%\n\n`;
  
  detailedReason += `2. 五行配合分析：\n`;
  detailedReason += `   ${fiveElementsAnalysis.analysis}\n\n`;
  
  detailedReason += `3. 與您命格的契合度：\n`;
  detailedReason += `   您的日主為${baziResult.fourPillars.day.element}，命格${baziResult.dayMasterStrength === 'strong' ? '偏強' : baziResult.dayMasterStrength === 'weak' ? '偏弱' : '平衡'}。`;
  detailedReason += `此號碼能夠${baziResult.dayMasterStrength === 'strong' ? '洩耗' : baziResult.dayMasterStrength === 'weak' ? '生助' : '調和'}您的命格，`;
  detailedReason += `達到五行平衡的效果。\n\n`;
  
  if (strengths.length > 0) {
    detailedReason += `【主要優勢】\n`;
    strengths.forEach((s, i) => {
      detailedReason += `${i + 1}. ${s}\n`;
    });
    detailedReason += `\n`;
  }
  
  if (warnings.length > 0) {
    detailedReason += `【注意事項】\n`;
    warnings.forEach((w, i) => {
      detailedReason += `${i + 1}. ${w}\n`;
    });
  }
  
  return { detailedReason, strengths, warnings };
}

/**
 * 檢查是否有連續數字
 */
function hasConsecutiveNumbers(number: string): boolean {
  for (let i = 0; i < number.length - 2; i++) {
    const a = parseInt(number[i]);
    const b = parseInt(number[i + 1]);
    const c = parseInt(number[i + 2]);
    
    if (b === a + 1 && c === b + 1) {
      return true;
    }
    if (b === a - 1 && c === b - 1) {
      return true;
    }
  }
  return false;
}

/**
 * 計算重複數字數量
 */
function countRepeatingDigits(number: string): number {
  const counts: { [key: string]: number } = {};
  
  for (const digit of number) {
    counts[digit] = (counts[digit] || 0) + 1;
  }
  
  return Math.max(...Object.values(counts));
}

/**
 * 分析現有號碼
 */
export function analyzeExistingNumber(
  number: string,
  baziResult: any
): {
  score: number;
  magneticAnalysis: any;
  fiveElementsAnalysis: any;
  recommendations: string[];
} {
  const usefulElements = baziResult.usefulGod || [];
  const tabooElements = baziResult.tabooGod || [];
  
  const magneticAnalysis = analyzeMagneticFields(number);
  const fiveElementsAnalysis = analyzeFiveElements(number, usefulElements, tabooElements);
  const score = calculateScore(magneticAnalysis, fiveElementsAnalysis);
  
  const recommendations: string[] = [];
  
  // 根據分數給出建議
  if (score < 50) {
    recommendations.push('您的當前號碼評分較低，強烈建議更換號碼');
    recommendations.push(`增加用神數字（${getNumbersByElements(usefulElements).join('、')}）的使用`);
    recommendations.push(`減少忌神數字（${getNumbersByElements(tabooElements).join('、')}）的使用`);
  } else if (score < 70) {
    recommendations.push('您的當前號碼評分中等，可以考慮優化');
    recommendations.push('建議選擇吉星磁場更多的號碼組合');
  } else {
    recommendations.push('您的當前號碼評分良好，已經比較適合您的命格');
    recommendations.push('如需進一步提升，可以微調部分數字');
  }
  
  if (magneticAnalysis.unluckyPercentage > 30) {
    recommendations.push('凶星磁場佔比較高，建議減少絕命、五鬼、六煞、禍害等組合');
  }
  
  return {
    score,
    magneticAnalysis,
    fiveElementsAnalysis,
    recommendations
  };
}
