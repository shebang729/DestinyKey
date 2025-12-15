// 八字計算算法

// 天干
const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

// 地支
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 五行屬性
const FIVE_ELEMENTS: { [key: string]: string } = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水',
  '子': '水', '丑': '土', '寅': '木', '卯': '木',
  '辰': '土', '巳': '火', '午': '火', '未': '土',
  '申': '金', '酉': '金', '戌': '土', '亥': '水'
};

// 生肖
const ZODIAC_ANIMALS = ['鼠', '牛', '虎', '兔', '龍', '蛇', '馬', '羊', '猴', '雞', '狗', '豬'];

interface BaziResult {
  year: { stem: string; branch: string; element: string };
  month: { stem: string; branch: string; element: string };
  day: { stem: string; branch: string; element: string };
  hour: { stem: string; branch: string; element: string };
  zodiac: string;
  fiveElements: {
    wood: number;
    fire: number;
    earth: number;
    metal: number;
    water: number;
  };
  analysis: string;
  strengths: string[];
  weaknesses: string[];
}

/**
 * 計算八字
 */
export function calculateBazi(birthDate: Date): BaziResult {
  const year = birthDate.getFullYear();
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();
  const hour = birthDate.getHours();

  // 計算年柱
  const yearStemIndex = (year - 4) % 10;
  const yearBranchIndex = (year - 4) % 12;
  const yearStem = HEAVENLY_STEMS[yearStemIndex];
  const yearBranch = EARTHLY_BRANCHES[yearBranchIndex];
  const zodiac = ZODIAC_ANIMALS[yearBranchIndex];

  // 計算月柱（簡化版本）
  const monthStemIndex = (yearStemIndex * 2 + month) % 10;
  const monthBranchIndex = (month + 1) % 12;
  const monthStem = HEAVENLY_STEMS[monthStemIndex];
  const monthBranch = EARTHLY_BRANCHES[monthBranchIndex];

  // 計算日柱（簡化版本，實際需要萬年曆）
  const dayStemIndex = (year + month + day) % 10;
  const dayBranchIndex = (year + month + day) % 12;
  const dayStem = HEAVENLY_STEMS[dayStemIndex];
  const dayBranch = EARTHLY_BRANCHES[dayBranchIndex];

  // 計算時柱
  const hourBranchIndex = Math.floor((hour + 1) / 2) % 12;
  const hourStemIndex = (dayStemIndex * 2 + hourBranchIndex) % 10;
  const hourStem = HEAVENLY_STEMS[hourStemIndex];
  const hourBranch = EARTHLY_BRANCHES[hourBranchIndex];

  // 統計五行
  const fiveElements = {
    wood: 0,
    fire: 0,
    earth: 0,
    metal: 0,
    water: 0
  };

  const allChars = [yearStem, yearBranch, monthStem, monthBranch, dayStem, dayBranch, hourStem, hourBranch];
  
  allChars.forEach(char => {
    const element = FIVE_ELEMENTS[char];
    switch (element) {
      case '木': fiveElements.wood++; break;
      case '火': fiveElements.fire++; break;
      case '土': fiveElements.earth++; break;
      case '金': fiveElements.metal++; break;
      case '水': fiveElements.water++; break;
    }
  });

  // 分析五行平衡
  const { analysis, strengths, weaknesses } = analyzeFiveElements(fiveElements);

  return {
    year: { stem: yearStem, branch: yearBranch, element: FIVE_ELEMENTS[yearStem] },
    month: { stem: monthStem, branch: monthBranch, element: FIVE_ELEMENTS[monthStem] },
    day: { stem: dayStem, branch: dayBranch, element: FIVE_ELEMENTS[dayStem] },
    hour: { stem: hourStem, branch: hourBranch, element: FIVE_ELEMENTS[hourStem] },
    zodiac,
    fiveElements,
    analysis,
    strengths,
    weaknesses
  };
}

/**
 * 分析五行平衡
 */
function analyzeFiveElements(elements: BaziResult['fiveElements']) {
  const total = Object.values(elements).reduce((sum, val) => sum + val, 0);
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  
  const elementNames: { [key: string]: string } = {
    wood: '木',
    fire: '火',
    earth: '土',
    metal: '金',
    water: '水'
  };

  const elementDescriptions: { [key: string]: { strong: string; weak: string } } = {
    wood: {
      strong: '木旺盛，代表生命力強、創造力豐富、適應力佳',
      weak: '木不足，需要增強活力和創新思維'
    },
    fire: {
      strong: '火旺盛，代表熱情洋溢、行動力強、領導才能突出',
      weak: '火不足，需要提升熱情和行動力'
    },
    earth: {
      strong: '土旺盛，代表穩重踏實、信用良好、責任心強',
      weak: '土不足，需要加強穩定性和責任感'
    },
    metal: {
      strong: '金旺盛，代表果斷堅毅、組織能力強、重視原則',
      weak: '金不足，需要培養決斷力和原則性'
    },
    water: {
      strong: '水旺盛，代表智慧靈活、善於變通、溝通能力佳',
      weak: '水不足，需要增強靈活性和智慧'
    }
  };

  Object.entries(elements).forEach(([key, value]) => {
    const percentage = (value / total) * 100;
    const name = elementNames[key];
    
    if (percentage >= 25) {
      strengths.push(`${name}：${elementDescriptions[key].strong}`);
    } else if (percentage <= 10) {
      weaknesses.push(`${name}：${elementDescriptions[key].weak}`);
    }
  });

  let analysis = '';
  if (strengths.length > 0 && weaknesses.length === 0) {
    analysis = '您的八字五行相對平衡，各方面發展較為均衡，是難得的好命格。';
  } else if (strengths.length > 0) {
    analysis = `您的八字中${strengths.map(s => s.split('：')[0]).join('、')}較旺，但${weaknesses.map(w => w.split('：')[0]).join('、')}稍弱，建議在生活中注意平衡發展。`;
  } else {
    analysis = '您的八字五行分佈較為平均，各方面都有發展潛力，適合多方面嘗試。';
  }

  return { analysis, strengths, weaknesses };
}

/**
 * 獲取五行相生相剋關係
 */
export function getFiveElementsRelations() {
  return {
    generation: {
      description: '五行相生：木生火、火生土、土生金、金生水、水生木',
      details: [
        '木生火：木能助火燃燒，代表創意能轉化為熱情',
        '火生土：火燒成灰成土，代表熱情能帶來穩定',
        '土生金：土中藏金礦，代表穩定能產生價值',
        '金生水：金屬融化成水，代表原則能轉化為智慧',
        '水生木：水能滋養樹木，代表智慧能促進成長'
      ]
    },
    restriction: {
      description: '五行相剋：木剋土、土剋水、水剋火、火剋金、金剋木',
      details: [
        '木剋土：樹木能固土，但過多會耗土',
        '土剋水：土能擋水，代表穩定能控制變化',
        '水剋火：水能滅火，代表智慧能平息衝動',
        '火剋金：火能熔金，代表熱情能軟化原則',
        '金剋木：金屬能砍木，代表原則能約束成長'
      ]
    }
  };
}
