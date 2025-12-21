/**
 * 號碼評分和詳細分析系統
 */

import { analyzePhoneNumber } from './magneticFieldsDetailed';

export interface NumberScore {
  overall: number;  // 綜合評分 0-100
  magneticScore: number;  // 磁場評分
  luckyPercentage: number;  // 吉星磁場佔比
  neutralPercentage: number;  // 中性磁場佔比
  unluckyPercentage: number;  // 凶星磁場佔比
  urgency: 'urgent' | 'recommended' | 'optional' | 'good';  // 改號緊急程度
  problems: string[];  // 存在的問題
  suggestions: string[];  // 改善建議
  detailedAnalysis: string;  // 詳細分析
  potentialImpacts: string[];  // 不改號的潛在影響
}

/**
 * 評分號碼
 */
export function scorePhoneNumber(phoneNumber: string): NumberScore {
  // 分析磁場
  const magneticAnalysis = analyzePhoneNumber(phoneNumber);
  
  // 統計磁場分佈
  let luckyCount = 0;
  let neutralCount = 0;
  let unluckyCount = 0;
  
  magneticAnalysis.combinations.forEach(combo => {
    if (combo.field.luckyLevel === 'excellent' || combo.field.luckyLevel === 'good') {
      luckyCount++;
    } else if (combo.field.luckyLevel === 'neutral') {
      neutralCount++;
    } else {
      unluckyCount++;
    }
  });
  
  const totalCombinations = magneticAnalysis.combinations.length;
  const luckyPercentage = totalCombinations > 0 ? (luckyCount / totalCombinations) * 100 : 0;
  const neutralPercentage = totalCombinations > 0 ? (neutralCount / totalCombinations) * 100 : 0;
  const unluckyPercentage = totalCombinations > 0 ? (unluckyCount / totalCombinations) * 100 : 0;
  
  // 計算磁場評分（0-100）
  const magneticScore = Math.round(
    (luckyPercentage * 1.0) + 
    (neutralPercentage * 0.6) + 
    (unluckyPercentage * 0.2)
  );
  
  // 綜合評分
  const overall = magneticScore;
  
  // 判斷改號緊急程度
  let urgency: 'urgent' | 'recommended' | 'optional' | 'good';
  if (overall < 50) {
    urgency = 'urgent';
  } else if (overall < 65) {
    urgency = 'recommended';
  } else if (overall < 80) {
    urgency = 'optional';
  } else {
    urgency = 'good';
  }
  
  // 找出存在的問題
  const problems: string[] = [];
  magneticAnalysis.combinations.forEach(combo => {
    if (combo.field.luckyLevel === 'challenging') {
      problems.push(`${combo.field.name}（${combo.combination}）：${combo.field.description} - ${combo.meaning}`);
    }
  });
  
  // 生成改善建議
  const suggestions = generateSuggestions(magneticAnalysis, luckyPercentage, unluckyPercentage);
  
  // 詳細分析
  const detailedAnalysis = generateDetailedAnalysis(magneticAnalysis, overall, luckyPercentage, neutralPercentage, unluckyPercentage);
  
  // 不改號的潛在影響
  const potentialImpacts = generatePotentialImpacts(problems, unluckyPercentage);
  
  return {
    overall,
    magneticScore,
    luckyPercentage: Math.round(luckyPercentage),
    neutralPercentage: Math.round(neutralPercentage),
    unluckyPercentage: Math.round(unluckyPercentage),
    urgency,
    problems,
    suggestions,
    detailedAnalysis,
    potentialImpacts
  };
}

/**
 * 生成改善建議
 */
function generateSuggestions(magneticAnalysis: any, luckyPercentage: number, unluckyPercentage: number): string[] {
  const suggestions: string[] = [];
  
  if (unluckyPercentage > 30) {
    suggestions.push('您的號碼中凶星磁場佔比較高，強烈建議盡快改號');
    suggestions.push('選擇包含天醫（13、31、68、76、94、49）、延年（19、91、78、87、43、34）、生氣（14、41、67、76、93、39）的號碼');
  } else if (unluckyPercentage > 15) {
    suggestions.push('您的號碼中存在一些不利磁場，建議考慮改號優化');
    suggestions.push('可以通過佩戴化煞物品來減輕負面影響');
  }
  
  if (luckyPercentage < 40) {
    suggestions.push('增加吉星磁場組合，提升整體運勢');
    suggestions.push('避免使用絕命（12、21、69、96、84、48）、五鬼（18、81、97、79、36、63）、六煞（16、61、74、47、38、83）、禍害（17、71、98、89、64、46）組合');
  }
  
  // 根據主導磁場提供建議
  const dominantField = magneticAnalysis.dominantField;
  if (dominantField === '絕命磁場' || dominantField === '五鬼磁場') {
    suggestions.push('您的號碼主導磁場為凶星，建議盡快更換');
    suggestions.push('改號後配合風水調整，效果更佳');
  }
  
  suggestions.push('選擇號碼時，建議結合您的八字五行，達到最佳效果');
  suggestions.push('改號後建議選擇吉日吉時開始使用，增強正面能量');
  
  return suggestions;
}

/**
 * 生成詳細分析
 */
function generateDetailedAnalysis(magneticAnalysis: any, overall: number, luckyPercentage: number, neutralPercentage: number, unluckyPercentage: number): string {
  let analysis = '📊 您的號碼詳細分析：\n\n';
  
  analysis += `綜合評分：${overall} 分`;
  if (overall >= 80) {
    analysis += '（優秀）✨\n';
  } else if (overall >= 65) {
    analysis += '（良好）👍\n';
  } else if (overall >= 50) {
    analysis += '（中等）⚠️\n';
  } else {
    analysis += '（需改善）❌\n';
  }
  
  analysis += `\n磁場能量分佈：\n`;
  analysis += `• 吉星磁場：${Math.round(luckyPercentage)}%`;
  if (luckyPercentage >= 60) {
    analysis += ' - 非常好！能量強勁\n';
  } else if (luckyPercentage >= 40) {
    analysis += ' - 不錯，但還有提升空間\n';
  } else {
    analysis += ' - 偏低，建議增加吉星組合\n';
  }
  
  analysis += `• 中性磁場：${Math.round(neutralPercentage)}%`;
  if (neutralPercentage >= 40) {
    analysis += ' - 穩定性較好\n';
  } else {
    analysis += ' - 適中\n';
  }
  
  analysis += `• 凶星磁場：${Math.round(unluckyPercentage)}%`;
  if (unluckyPercentage >= 30) {
    analysis += ' - ⚠️ 過高！強烈建議改號\n';
  } else if (unluckyPercentage >= 15) {
    analysis += ' - ⚠️ 偏高，建議優化\n';
  } else if (unluckyPercentage > 0) {
    analysis += ' - 尚可接受，但仍有改善空間\n';
  } else {
    analysis += ' - ✨ 完美！沒有凶星磁場\n';
  }
  
  analysis += `\n主導磁場：${magneticAnalysis.dominantField}\n`;
  analysis += `這個磁場對您的整體運勢影響最大。\n`;
  
  analysis += `\n磁場組合詳情：\n`;
  magneticAnalysis.combinations.forEach((combo: any, index: number) => {
    const emoji = combo.field.luckyLevel === 'excellent' || combo.field.luckyLevel === 'good' ? '✅' : 
                  combo.field.luckyLevel === 'neutral' ? '➖' : '❌';
    analysis += `${index + 1}. ${emoji} ${combo.combination} - ${combo.field.name}：${combo.meaning}\n`;
  });
  
  return analysis;
}

/**
 * 生成不改號的潛在影響
 */
function generatePotentialImpacts(problems: string[], unluckyPercentage: number): string[] {
  const impacts: string[] = [];
  
  if (unluckyPercentage >= 30) {
    impacts.push('事業發展：可能遇到較多阻礙，晉升困難，容易遇到小人');
    impacts.push('財運狀況：財運不穩，容易破財，投資容易虧損');
    impacts.push('人際關係：人際關係緊張，容易與人發生衝突，貴人運弱');
    impacts.push('健康狀況：容易疲勞、壓力大，可能出現健康問題');
    impacts.push('整體運勢：運勢起伏大，諸事不順，需要付出更多努力');
  } else if (unluckyPercentage >= 15) {
    impacts.push('事業發展：發展速度較慢，需要更多努力才能獲得成功');
    impacts.push('財運狀況：財運平平，偶有破財，需謹慎理財');
    impacts.push('人際關係：人際關係一般，貴人運不強');
    impacts.push('整體運勢：運勢平穩但缺乏突破，難有大的發展');
  } else if (unluckyPercentage > 0) {
    impacts.push('整體運勢：運勢尚可，但仍有優化空間');
    impacts.push('建議：通過改號可以進一步提升運勢，達到更好的效果');
  }
  
  if (problems.length > 0) {
    impacts.push(`\n⚠️ 特別注意：您的號碼中包含 ${problems.length} 個凶星磁場，這些磁場可能對您的運勢造成明顯負面影響。`);
  }
  
  return impacts;
}

/**
 * 獲取改號緊急程度描述
 */
export function getUrgencyDescription(urgency: 'urgent' | 'recommended' | 'optional' | 'good'): string {
  const descriptions = {
    urgent: '🚨 建議盡快改號',
    recommended: '⚠️ 建議考慮改號',
    optional: '💡 可以考慮優化',
    good: '✨ 目前尚可'
  };
  
  return descriptions[urgency];
}

/**
 * 獲取改號緊急程度詳細說明
 */
export function getUrgencyDetailedDescription(urgency: 'urgent' | 'recommended' | 'optional' | 'good'): string {
  const descriptions = {
    urgent: '您的號碼綜合評分較低，存在較多不利磁場，可能對您的事業、財運、健康等方面造成明顯負面影響。強烈建議您盡快改號，選擇更適合您的號碼，以改善整體運勢。',
    recommended: '您的號碼綜合評分中等，存在一些不利磁場，可能會影響您的運勢發展。建議您考慮改號，通過優化號碼來提升運勢，獲得更好的發展機會。',
    optional: '您的號碼綜合評分良好，但仍有提升空間。如果您希望進一步優化運勢，可以考慮改號。通過選擇更適合的號碼，可以讓您的事業、財運等方面更上一層樓。',
    good: '您的號碼綜合評分優秀，磁場能量良好。目前的號碼對您的運勢有正面幫助。如果您想追求更完美的配置，可以諮詢專業命理師傅，根據您的八字進一步優化。'
  };
  
  return descriptions[urgency];
}
