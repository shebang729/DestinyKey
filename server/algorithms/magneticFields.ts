// 八星磁場數字能量學算法

export interface MagneticField {
  type: string;
  name: string;
  description: string;
  characteristics: string[];
  scores: {
    career: number;
    wealth: number;
    relationship: number;
    health: number;
  };
}

export interface NumberCombination {
  combination: string;
  field: MagneticField;
}

// 八大磁場定義
export const MAGNETIC_FIELDS: Record<string, MagneticField> = {
  tianyi: {
    type: 'tianyi',
    name: '天醫磁場',
    description: '財富、貴人、健康之星',
    characteristics: ['財運亨通', '貴人相助', '身體健康', '事業順利'],
    scores: { career: 85, wealth: 95, relationship: 80, health: 90 }
  },
  yannian: {
    type: 'yannian',
    name: '延年磁場',
    description: '領導、決斷、執行力',
    characteristics: ['領導能力強', '決策果斷', '執行力高', '責任心重'],
    scores: { career: 95, wealth: 80, relationship: 75, health: 85 }
  },
  shengqi: {
    type: 'shengqi',
    name: '生氣磁場',
    description: '人緣、溝通、創意',
    characteristics: ['人緣極佳', '溝通能力強', '創意豐富', '樂觀積極'],
    scores: { career: 80, wealth: 75, relationship: 95, health: 85 }
  },
  fuwei: {
    type: 'fuwei',
    name: '伏位磁場',
    description: '穩定、等待、積累',
    characteristics: ['性格穩定', '善於等待', '積累能量', '持之以恆'],
    scores: { career: 70, wealth: 70, relationship: 70, health: 75 }
  },
  jueming: {
    type: 'jueming',
    name: '絕命磁場',
    description: '極端、突破、危機',
    characteristics: ['個性極端', '突破能力', '危機意識', '壓力較大'],
    scores: { career: 60, wealth: 65, relationship: 55, health: 50 }
  },
  wugui: {
    type: 'wugui',
    name: '五鬼磁場',
    description: '智慧、變化、不穩',
    characteristics: ['智慧過人', '變化多端', '情緒不穩', '思慮過多'],
    scores: { career: 75, wealth: 70, relationship: 60, health: 65 }
  },
  liusha: {
    type: 'liusha',
    name: '六煞磁場',
    description: '桃花、人緣、消耗',
    characteristics: ['桃花運強', '人緣好', '消耗較大', '感情複雜'],
    scores: { career: 65, wealth: 60, relationship: 85, health: 70 }
  },
  huohai: {
    type: 'huohai',
    name: '禍害磁場',
    description: '口才、是非、波折',
    characteristics: ['口才極佳', '容易是非', '波折較多', '需謹言慎行'],
    scores: { career: 70, wealth: 65, relationship: 65, health: 60 }
  }
};

// 32種數字組合映射
export const NUMBER_COMBINATIONS: Record<string, string> = {
  '13': 'tianyi', '31': 'tianyi', '68': 'tianyi', '86': 'tianyi',
  '49': 'tianyi', '94': 'tianyi', '27': 'tianyi', '72': 'tianyi',
  
  '19': 'yannian', '91': 'yannian', '78': 'yannian', '87': 'yannian',
  '43': 'yannian', '34': 'yannian', '26': 'yannian', '62': 'yannian',
  
  '14': 'shengqi', '41': 'shengqi', '67': 'shengqi', '76': 'shengqi',
  '39': 'shengqi', '93': 'shengqi', '28': 'shengqi', '82': 'shengqi',
  
  '11': 'fuwei', '22': 'fuwei', '33': 'fuwei', '44': 'fuwei',
  '66': 'fuwei', '77': 'fuwei', '88': 'fuwei', '99': 'fuwei',
  
  '12': 'jueming', '21': 'jueming', '69': 'jueming', '96': 'jueming',
  '48': 'jueming', '84': 'jueming', '37': 'jueming', '73': 'jueming',
  
  '18': 'wugui', '81': 'wugui', '79': 'wugui', '97': 'wugui',
  '46': 'wugui', '64': 'wugui', '23': 'wugui', '32': 'wugui',
  
  '16': 'liusha', '61': 'liusha', '74': 'liusha', '47': 'liusha',
  '38': 'liusha', '83': 'liusha', '29': 'liusha', '92': 'liusha',
  
  '17': 'huohai', '71': 'huohai', '89': 'huohai', '98': 'huohai',
  '42': 'huohai', '24': 'huohai', '36': 'huohai', '63': 'huohai'
};

/**
 * 分析電話號碼的磁場能量
 */
export function analyzePhoneNumber(phoneNumber: string): {
  combinations: NumberCombination[];
  overallScores: { career: number; wealth: number; relationship: number; health: number };
  summary: string;
} {
  // 移除非數字字符
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  
  // 提取所有兩位數組合
  const combinations: NumberCombination[] = [];
  for (let i = 0; i < cleanNumber.length - 1; i++) {
    const combo = cleanNumber.substring(i, i + 2);
    const fieldType = NUMBER_COMBINATIONS[combo];
    
    if (fieldType) {
      combinations.push({
        combination: combo,
        field: MAGNETIC_FIELDS[fieldType]
      });
    }
  }
  
  // 計算總體評分
  const overallScores = {
    career: 0,
    wealth: 0,
    relationship: 0,
    health: 0
  };
  
  if (combinations.length > 0) {
    combinations.forEach(combo => {
      overallScores.career += combo.field.scores.career;
      overallScores.wealth += combo.field.scores.wealth;
      overallScores.relationship += combo.field.scores.relationship;
      overallScores.health += combo.field.scores.health;
    });
    
    // 計算平均分
    overallScores.career = Math.round(overallScores.career / combinations.length);
    overallScores.wealth = Math.round(overallScores.wealth / combinations.length);
    overallScores.relationship = Math.round(overallScores.relationship / combinations.length);
    overallScores.health = Math.round(overallScores.health / combinations.length);
  }
  
  // 生成總結
  const summary = generateSummary(combinations, overallScores);
  
  return {
    combinations,
    overallScores,
    summary
  };
}

/**
 * 生成分析總結
 */
function generateSummary(
  combinations: NumberCombination[],
  scores: { career: number; wealth: number; relationship: number; health: number }
): string {
  if (combinations.length === 0) {
    return '此號碼未包含明顯的磁場組合，建議諮詢專業命理師進行深度分析。';
  }
  
  // 統計磁場類型
  const fieldCounts: Record<string, number> = {};
  combinations.forEach(combo => {
    const type = combo.field.type;
    fieldCounts[type] = (fieldCounts[type] || 0) + 1;
  });
  
  // 找出主導磁場
  const dominantField = Object.entries(fieldCounts)
    .sort((a, b) => b[1] - a[1])[0];
  
  const mainField = MAGNETIC_FIELDS[dominantField[0]];
  
  // 找出最高分維度
  const maxScore = Math.max(scores.career, scores.wealth, scores.relationship, scores.health);
  let strongestAspect = '';
  if (scores.career === maxScore) strongestAspect = '事業運勢';
  else if (scores.wealth === maxScore) strongestAspect = '財運';
  else if (scores.relationship === maxScore) strongestAspect = '人際關係';
  else if (scores.health === maxScore) strongestAspect = '健康運勢';
  
  return `此號碼以${mainField.name}為主導，${strongestAspect}表現突出。${mainField.description}的特質明顯，適合發揮${mainField.characteristics[0]}的優勢。`;
}

/**
 * 獲取改善建議
 */
export function getImprovementSuggestions(
  combinations: NumberCombination[],
  scores: { career: number; wealth: number; relationship: number; health: number }
): string[] {
  const suggestions: string[] = [];
  
  // 根據評分給出建議
  if (scores.career < 70) {
    suggestions.push('事業方面建議多結交貴人，尋求合作機會');
  }
  if (scores.wealth < 70) {
    suggestions.push('財運方面建議謹慎理財，避免高風險投資');
  }
  if (scores.relationship < 70) {
    suggestions.push('人際關係方面建議多溝通，保持真誠待人');
  }
  if (scores.health < 70) {
    suggestions.push('健康方面建議注意作息，定期體檢');
  }
  
  // 根據磁場類型給出建議
  const hasJueming = combinations.some(c => c.field.type === 'jueming');
  const hasWugui = combinations.some(c => c.field.type === 'wugui');
  
  if (hasJueming) {
    suggestions.push('號碼含絕命磁場，建議保持平和心態，避免極端決策');
  }
  if (hasWugui) {
    suggestions.push('號碼含五鬼磁場，建議穩定情緒，減少焦慮');
  }
  
  if (suggestions.length === 0) {
    suggestions.push('整體能量平衡良好，繼續保持積極心態');
  }
  
  return suggestions;
}
