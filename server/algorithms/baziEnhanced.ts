// 增強版八字分析算法

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

// 陰陽屬性
const YIN_YANG: { [key: string]: string } = {
  '甲': '陽', '乙': '陰',
  '丙': '陽', '丁': '陰',
  '戊': '陽', '己': '陰',
  '庚': '陽', '辛': '陰',
  '壬': '陽', '癸': '陰',
  '子': '陽', '丑': '陰', '寅': '陽', '卯': '陰',
  '辰': '陽', '巳': '陰', '午': '陽', '未': '陰',
  '申': '陽', '酉': '陰', '戌': '陽', '亥': '陰'
};

// 生肖
const ZODIAC_ANIMALS = ['鼠', '牛', '虎', '兔', '龍', '蛇', '馬', '羊', '猴', '雞', '狗', '豬'];

// 十神關係
const TEN_GODS: { [key: string]: { [key: string]: string } } = {
  '木': { '木': '比肩/劫財', '火': '食神/傷官', '土': '偏財/正財', '金': '偏官/正官', '水': '偏印/正印' },
  '火': { '火': '比肩/劫財', '土': '食神/傷官', '金': '偏財/正財', '水': '偏官/正官', '木': '偏印/正印' },
  '土': { '土': '比肩/劫財', '金': '食神/傷官', '水': '偏財/正財', '木': '偏官/正官', '火': '偏印/正印' },
  '金': { '金': '比肩/劫財', '水': '食神/傷官', '木': '偏財/正財', '火': '偏官/正官', '土': '偏印/正印' },
  '水': { '水': '比肩/劫財', '木': '食神/傷官', '火': '偏財/正財', '土': '偏官/正官', '金': '偏印/正印' }
};

interface Pillar {
  stem: string;
  branch: string;
  element: string;
  yinYang: string;
  tenGod?: string;
}

interface EnhancedBaziResult {
  fourPillars: {
    year: Pillar;
    month: Pillar;
    day: Pillar;
    hour: Pillar;
  };
  zodiac: string;
  fiveElements: {
    wood: number;
    fire: number;
    earth: number;
    metal: number;
    water: number;
  };
  dayMasterStrength: 'strong' | 'weak' | 'balanced';
  usefulGod: string[];
  joyfulGod: string[];
  tabooGod: string[];
  tenGodsAnalysis: {
    distribution: { [key: string]: number };
    dominant: string[];
    analysis: string;
  };
  spiritsAnalysis: {
    lucky: string[];
    unlucky: string[];
    analysis: string;
  };
  detailedAnalysis: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

/**
 * 計算增強版八字
 */
export function calculateEnhancedBazi(birthDate: Date): EnhancedBaziResult {
  const year = birthDate.getFullYear();
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();
  const hour = birthDate.getHours();

  // 計算四柱
  const fourPillars = calculateFourPillars(year, month, day, hour);
  
  // 統計五行
  const fiveElements = calculateFiveElements(fourPillars);
  
  // 分析日主強弱
  const dayMasterStrength = analyzeDayMasterStrength(fourPillars, fiveElements, month);
  
  // 確定用神喜忌
  const { usefulGod, joyfulGod, tabooGod } = determineUsefulGod(
    fourPillars.day.element,
    dayMasterStrength,
    fiveElements
  );
  
  // 十神分析
  const tenGodsAnalysis = analyzeTenGods(fourPillars);
  
  // 神煞分析
  const spiritsAnalysis = analyzeSpirits(fourPillars);
  
  // 生成詳細分析
  const { detailedAnalysis, strengths, weaknesses, recommendations } = generateDetailedAnalysis(
    fourPillars,
    fiveElements,
    dayMasterStrength,
    usefulGod,
    tabooGod,
    tenGodsAnalysis,
    spiritsAnalysis
  );

  return {
    fourPillars,
    zodiac: ZODIAC_ANIMALS[(year - 4) % 12],
    fiveElements,
    dayMasterStrength,
    usefulGod,
    joyfulGod,
    tabooGod,
    tenGodsAnalysis,
    spiritsAnalysis,
    detailedAnalysis,
    strengths,
    weaknesses,
    recommendations
  };
}

/**
 * 計算四柱
 */
function calculateFourPillars(year: number, month: number, day: number, hour: number): {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar;
} {
  // 計算年柱
  const yearStemIndex = (year - 4) % 10;
  const yearBranchIndex = (year - 4) % 12;
  const yearStem = HEAVENLY_STEMS[yearStemIndex];
  const yearBranch = EARTHLY_BRANCHES[yearBranchIndex];

  // 計算月柱
  const monthStemIndex = (yearStemIndex * 2 + month) % 10;
  const monthBranchIndex = (month + 1) % 12;
  const monthStem = HEAVENLY_STEMS[monthStemIndex];
  const monthBranch = EARTHLY_BRANCHES[monthBranchIndex];

  // 計算日柱
  const dayStemIndex = (year + month + day) % 10;
  const dayBranchIndex = (year + month + day) % 12;
  const dayStem = HEAVENLY_STEMS[dayStemIndex];
  const dayBranch = EARTHLY_BRANCHES[dayBranchIndex];

  // 計算時柱
  const hourBranchIndex = Math.floor((hour + 1) / 2) % 12;
  const hourStemIndex = (dayStemIndex * 2 + hourBranchIndex) % 10;
  const hourStem = HEAVENLY_STEMS[hourStemIndex];
  const hourBranch = EARTHLY_BRANCHES[hourBranchIndex];

  return {
    year: {
      stem: yearStem,
      branch: yearBranch,
      element: FIVE_ELEMENTS[yearStem],
      yinYang: YIN_YANG[yearStem]
    },
    month: {
      stem: monthStem,
      branch: monthBranch,
      element: FIVE_ELEMENTS[monthStem],
      yinYang: YIN_YANG[monthStem]
    },
    day: {
      stem: dayStem,
      branch: dayBranch,
      element: FIVE_ELEMENTS[dayStem],
      yinYang: YIN_YANG[dayStem]
    },
    hour: {
      stem: hourStem,
      branch: hourBranch,
      element: FIVE_ELEMENTS[hourStem],
      yinYang: YIN_YANG[hourStem]
    }
  };
}

/**
 * 統計五行
 */
function calculateFiveElements(fourPillars: any) {
  const elements = {
    wood: 0,
    fire: 0,
    earth: 0,
    metal: 0,
    water: 0
  };

  const allChars = [
    fourPillars.year.stem, fourPillars.year.branch,
    fourPillars.month.stem, fourPillars.month.branch,
    fourPillars.day.stem, fourPillars.day.branch,
    fourPillars.hour.stem, fourPillars.hour.branch
  ];

  allChars.forEach(char => {
    const element = FIVE_ELEMENTS[char];
    switch (element) {
      case '木': elements.wood++; break;
      case '火': elements.fire++; break;
      case '土': elements.earth++; break;
      case '金': elements.metal++; break;
      case '水': elements.water++; break;
    }
  });

  return elements;
}

/**
 * 分析日主強弱
 */
function analyzeDayMasterStrength(
  fourPillars: any,
  fiveElements: any,
  month: number
): 'strong' | 'weak' | 'balanced' {
  const dayElement = fourPillars.day.element;
  const dayElementCount = getElementCount(fiveElements, dayElement);
  
  // 判斷是否得令（出生月令）
  const isInSeason = isElementInSeason(dayElement, month);
  
  // 判斷是否得地（地支有根）
  const hasRoots = hasElementRoots(dayElement, fourPillars);
  
  // 判斷是否得生助
  const supportCount = getSupportCount(dayElement, fiveElements);
  
  // 綜合判斷
  let strengthScore = 0;
  if (isInSeason) strengthScore += 3;
  if (hasRoots) strengthScore += 2;
  strengthScore += supportCount;
  strengthScore += dayElementCount;
  
  if (strengthScore >= 6) return 'strong';
  if (strengthScore <= 3) return 'weak';
  return 'balanced';
}

/**
 * 判斷五行是否得令
 */
function isElementInSeason(element: string, month: number): boolean {
  const seasonMap: { [key: string]: number[] } = {
    '木': [2, 3], // 春季
    '火': [5, 6], // 夏季
    '金': [8, 9], // 秋季
    '水': [11, 12], // 冬季
    '土': [1, 4, 7, 10] // 四季月
  };
  return seasonMap[element]?.includes(month) || false;
}

/**
 * 判斷五行是否有根
 */
function hasElementRoots(element: string, fourPillars: any): boolean {
  const branches = [
    fourPillars.year.branch,
    fourPillars.month.branch,
    fourPillars.day.branch,
    fourPillars.hour.branch
  ];
  
  return branches.some(branch => FIVE_ELEMENTS[branch] === element);
}

/**
 * 計算生助力量
 */
function getSupportCount(element: string, fiveElements: any): number {
  const supportMap: { [key: string]: string } = {
    '木': 'water',
    '火': 'wood',
    '土': 'fire',
    '金': 'earth',
    '水': 'metal'
  };
  
  const supportElement = supportMap[element];
  return fiveElements[supportElement] || 0;
}

/**
 * 獲取五行數量
 */
function getElementCount(fiveElements: any, element: string): number {
  const elementMap: { [key: string]: string } = {
    '木': 'wood',
    '火': 'fire',
    '土': 'earth',
    '金': 'metal',
    '水': 'water'
  };
  
  return fiveElements[elementMap[element]] || 0;
}

/**
 * 確定用神喜忌
 */
function determineUsefulGod(
  dayElement: string,
  strength: string,
  fiveElements: any
): { usefulGod: string[]; joyfulGod: string[]; tabooGod: string[] } {
  const elementCycle = ['木', '火', '土', '金', '水'];
  const dayIndex = elementCycle.indexOf(dayElement);
  
  if (strength === 'strong') {
    // 身旺：需要洩、耗、剋
    const useful = [
      elementCycle[(dayIndex + 1) % 5], // 洩（我生）
      elementCycle[(dayIndex + 2) % 5], // 耗（我剋）
      elementCycle[(dayIndex + 3) % 5]  // 剋（剋我）
    ];
    const taboo = [
      dayElement, // 比劫
      elementCycle[(dayIndex + 4) % 5]  // 印星（生我）
    ];
    return {
      usefulGod: useful.slice(0, 2),
      joyfulGod: [useful[2]],
      tabooGod: taboo
    };
  } else if (strength === 'weak') {
    // 身弱：需要生、助
    const useful = [
      elementCycle[(dayIndex + 4) % 5], // 印星（生我）
      dayElement // 比劫（助我）
    ];
    const taboo = [
      elementCycle[(dayIndex + 1) % 5], // 食傷（洩我）
      elementCycle[(dayIndex + 2) % 5], // 財星（耗我）
      elementCycle[(dayIndex + 3) % 5]  // 官殺（剋我）
    ];
    return {
      usefulGod: useful,
      joyfulGod: [],
      tabooGod: taboo
    };
  } else {
    // 平衡：根據五行缺失確定
    const missing = findMissingElements(fiveElements);
    const excessive = findExcessiveElements(fiveElements);
    return {
      usefulGod: missing,
      joyfulGod: [],
      tabooGod: excessive
    };
  }
}

/**
 * 找出缺失的五行
 */
function findMissingElements(fiveElements: any): string[] {
  const missing: string[] = [];
  const elementMap: { [key: string]: string } = {
    'wood': '木',
    'fire': '火',
    'earth': '土',
    'metal': '金',
    'water': '水'
  };
  
  Object.entries(fiveElements).forEach(([key, value]) => {
    if ((value as number) === 0) {
      missing.push(elementMap[key]);
    }
  });
  
  return missing;
}

/**
 * 找出過多的五行
 */
function findExcessiveElements(fiveElements: any): string[] {
  const excessive: string[] = [];
  const elementMap: { [key: string]: string } = {
    'wood': '木',
    'fire': '火',
    'earth': '土',
    'metal': '金',
    'water': '水'
  };
  
  const total = Object.values(fiveElements).reduce((sum: number, val) => sum + (val as number), 0);
  const average = total / 5;
  
  Object.entries(fiveElements).forEach(([key, value]) => {
    if ((value as number) > average * 1.5) {
      excessive.push(elementMap[key]);
    }
  });
  
  return excessive;
}

/**
 * 十神分析
 */
function analyzeTenGods(fourPillars: any) {
  const dayElement = fourPillars.day.element;
  const distribution: { [key: string]: number } = {};
  
  // 統計各柱的十神
  [fourPillars.year, fourPillars.month, fourPillars.hour].forEach(pillar => {
    const tenGod = getTenGod(dayElement, pillar.element, pillar.yinYang, fourPillars.day.yinYang);
    distribution[tenGod] = (distribution[tenGod] || 0) + 1;
  });
  
  // 找出主導十神
  const dominant = Object.entries(distribution)
    .filter(([_, count]) => count >= 2)
    .map(([god, _]) => god);
  
  // 生成分析
  const analysis = generateTenGodsAnalysis(distribution, dominant);
  
  return { distribution, dominant, analysis };
}

/**
 * 獲取十神
 */
function getTenGod(dayElement: string, targetElement: string, targetYinYang: string, dayYinYang: string): string {
  if (dayElement === targetElement) {
    return targetYinYang === dayYinYang ? '比肩' : '劫財';
  }
  
  const elementCycle = ['木', '火', '土', '金', '水'];
  const dayIndex = elementCycle.indexOf(dayElement);
  const targetIndex = elementCycle.indexOf(targetElement);
  const diff = (targetIndex - dayIndex + 5) % 5;
  
  const tenGodMap: { [key: number]: { same: string; diff: string } } = {
    1: { same: '食神', diff: '傷官' },
    2: { same: '偏財', diff: '正財' },
    3: { same: '偏官', diff: '正官' },
    4: { same: '偏印', diff: '正印' }
  };
  
  const godType = tenGodMap[diff];
  if (!godType) return '比肩';
  
  return targetYinYang === dayYinYang ? godType.same : godType.diff;
}

/**
 * 生成十神分析
 */
function generateTenGodsAnalysis(distribution: any, dominant: string[]): string {
  if (dominant.length === 0) {
    return '您的八字十神分佈較為平均，各方面發展均衡，是難得的好命格。建議根據實際情況選擇發展方向。';
  }
  
  const analysisMap: { [key: string]: string } = {
    '比肩': '比肩旺盛，代表您獨立自主、競爭意識強，適合創業或從事需要獨立決策的工作。但要注意與人合作時的溝通。',
    '劫財': '劫財較多，需要注意財務管理，避免因朋友或合夥而破財。建議謹慎投資，保護好個人資產。',
    '食神': '食神旺盛，代表您才華橫溢、創意豐富，適合從事藝術、設計、美食等創意行業。財運通過才華獲得。',
    '傷官': '傷官較多，代表您思維敏捷、善於創新，但有時過於叛逆。建議學會控制情緒，避免與上司衝突。',
    '偏財': '偏財旺盛，代表您投資眼光獨到，容易獲得意外之財。適合從事投資、貿易等行業。',
    '正財': '正財較多，代表您財運穩定，適合從事穩定收入的工作。建議腳踏實地，穩健理財。',
    '偏官': '偏官旺盛，代表您壓力較大但能力強，適合從事需要權威和決斷的工作。注意健康和情緒管理。',
    '正官': '正官較多，代表您名譽地位佳，適合從事公職或管理工作。事業發展順利，受人尊重。',
    '偏印': '偏印旺盛，代表您學習能力強，適合從事研究、技術等偏門行業。但要注意不要過於孤僻。',
    '正印': '正印較多，代表您學識淵博、貴人運強，適合從事教育、文化等行業。母親對您幫助大。'
  };
  
  return dominant.map(god => analysisMap[god] || '').join(' ');
}

/**
 * 神煞分析
 */
function analyzeSpirits(fourPillars: any) {
  const lucky: string[] = [];
  const unlucky: string[] = [];
  
  // 檢查天乙貴人
  if (hasTianyiNoble(fourPillars)) {
    lucky.push('天乙貴人：最重要的貴人星，一生多貴人相助，逢凶化吉');
  }
  
  // 檢查桃花星
  if (hasPeachBlossom(fourPillars)) {
    lucky.push('桃花星：異性緣佳，魅力十足，人際關係良好');
  }
  
  // 檢查驛馬星
  if (hasPostHorse(fourPillars)) {
    lucky.push('驛馬星：喜歡變動和旅行，適合外出發展，機會多');
  }
  
  // 檢查文昌貴人
  if (hasWenchang(fourPillars)) {
    lucky.push('文昌貴人：聰明好學，文采出眾，考試運佳');
  }
  
  // 檢查羊刃
  if (hasYangBlade(fourPillars)) {
    unlucky.push('羊刃：性格剛強，容易衝動，需注意安全和情緒控制');
  }
  
  // 檢查華蓋
  if (hasHuagai(fourPillars)) {
    unlucky.push('華蓋：聰明但孤獨，有宗教藝術天賦，但人際關係較淡');
  }
  
  const analysis = generateSpiritsAnalysis(lucky, unlucky);
  
  return { lucky, unlucky, analysis };
}

/**
 * 檢查天乙貴人
 */
function hasTianyiNoble(fourPillars: any): boolean {
  const dayStem = fourPillars.day.stem;
  const nobleMap: { [key: string]: string[] } = {
    '甲': ['丑', '未'], '戊': ['丑', '未'], '庚': ['丑', '未'],
    '乙': ['子', '申'], '己': ['子', '申'],
    '丙': ['亥', '酉'], '丁': ['亥', '酉'],
    '壬': ['卯', '巳'], '癸': ['卯', '巳'],
    '辛': ['寅', '午']
  };
  
  const nobles = nobleMap[dayStem] || [];
  const branches = [fourPillars.year.branch, fourPillars.month.branch, fourPillars.hour.branch];
  
  return branches.some(branch => nobles.includes(branch));
}

/**
 * 檢查桃花星
 */
function hasPeachBlossom(fourPillars: any): boolean {
  const yearBranch = fourPillars.year.branch;
  const peachMap: { [key: string]: string } = {
    '子': '酉', '午': '卯', '寅': '卯', '戌': '卯',
    '申': '酉', '辰': '酉',
    '巳': '午', '酉': '午', '丑': '午',
    '亥': '子', '卯': '子', '未': '子'
  };
  
  const peach = peachMap[yearBranch];
  const branches = [fourPillars.month.branch, fourPillars.day.branch, fourPillars.hour.branch];
  
  return branches.includes(peach);
}

/**
 * 檢查驛馬星
 */
function hasPostHorse(fourPillars: any): boolean {
  const yearBranch = fourPillars.year.branch;
  const horseMap: { [key: string]: string } = {
    '申': '寅', '子': '寅', '辰': '寅',
    '寅': '申', '午': '申', '戌': '申',
    '巳': '亥', '酉': '亥', '丑': '亥',
    '亥': '巳', '卯': '巳', '未': '巳'
  };
  
  const horse = horseMap[yearBranch];
  const branches = [fourPillars.month.branch, fourPillars.day.branch, fourPillars.hour.branch];
  
  return branches.includes(horse);
}

/**
 * 檢查文昌貴人
 */
function hasWenchang(fourPillars: any): boolean {
  const dayStem = fourPillars.day.stem;
  const wenchangMap: { [key: string]: string } = {
    '甲': '巳', '乙': '午', '丙': '申', '丁': '酉',
    '戊': '申', '己': '酉', '庚': '亥', '辛': '子',
    '壬': '寅', '癸': '卯'
  };
  
  const wenchang = wenchangMap[dayStem];
  const branches = [fourPillars.year.branch, fourPillars.month.branch, fourPillars.hour.branch];
  
  return branches.includes(wenchang);
}

/**
 * 檢查羊刃
 */
function hasYangBlade(fourPillars: any): boolean {
  const dayStem = fourPillars.day.stem;
  const bladeMap: { [key: string]: string } = {
    '甲': '卯', '乙': '寅', '丙': '午', '丁': '巳',
    '戊': '午', '己': '巳', '庚': '酉', '辛': '申',
    '壬': '子', '癸': '亥'
  };
  
  const blade = bladeMap[dayStem];
  const branches = [fourPillars.year.branch, fourPillars.month.branch, fourPillars.day.branch, fourPillars.hour.branch];
  
  return branches.includes(blade);
}

/**
 * 檢查華蓋
 */
function hasHuagai(fourPillars: any): boolean {
  const yearBranch = fourPillars.year.branch;
  const huagaiMap: { [key: string]: string } = {
    '寅': '戌', '午': '戌', '戌': '戌',
    '申': '辰', '子': '辰', '辰': '辰',
    '巳': '丑', '酉': '丑', '丑': '丑',
    '亥': '未', '卯': '未', '未': '未'
  };
  
  const huagai = huagaiMap[yearBranch];
  const branches = [fourPillars.month.branch, fourPillars.day.branch, fourPillars.hour.branch];
  
  return branches.includes(huagai);
}

/**
 * 生成神煞分析
 */
function generateSpiritsAnalysis(lucky: string[], unlucky: string[]): string {
  if (lucky.length === 0 && unlucky.length === 0) {
    return '您的八字神煞較為平淡，沒有特別突出的吉凶神煞。建議腳踏實地，穩健發展。';
  }
  
  let analysis = '';
  
  if (lucky.length > 0) {
    analysis += `您的八字帶有${lucky.length}個吉神，這是很好的徵兆。`;
  }
  
  if (unlucky.length > 0) {
    analysis += `同時也有${unlucky.length}個凶神，需要特別注意。`;
  }
  
  analysis += '建議通過改號等方式化解凶神，增強吉神的力量。';
  
  return analysis;
}

/**
 * 生成詳細分析
 */
function generateDetailedAnalysis(
  fourPillars: any,
  fiveElements: any,
  dayMasterStrength: string,
  usefulGod: string[],
  tabooGod: string[],
  tenGodsAnalysis: any,
  spiritsAnalysis: any
) {
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const recommendations: string[] = [];
  
  // 分析日主強弱
  let strengthAnalysis = '';
  if (dayMasterStrength === 'strong') {
    strengthAnalysis = `您的日主${fourPillars.day.element}較旺，代表您個性強勢、自信獨立、能力出眾。`;
    strengths.push('個性強勢，自信獨立');
    strengths.push('能力出眾，執行力強');
    recommendations.push(`選擇包含${usefulGod.join('、')}屬性的號碼來平衡命格`);
  } else if (dayMasterStrength === 'weak') {
    strengthAnalysis = `您的日主${fourPillars.day.element}較弱，代表您性格溫和、善於合作、需要貴人相助。`;
    strengths.push('性格溫和，善於合作');
    strengths.push('謙虛好學，容易獲得幫助');
    recommendations.push(`選擇包含${usefulGod.join('、')}屬性的號碼來增強命格`);
  } else {
    strengthAnalysis = `您的日主${fourPillars.day.element}平衡，代表您性格中庸、處事得當、發展均衡。`;
    strengths.push('性格中庸，處事得當');
    strengths.push('發展均衡，適應力強');
  }
  
  // 分析五行
  const elementAnalysis = analyzeFiveElementsBalance(fiveElements);
  strengths.push(...elementAnalysis.strengths);
  weaknesses.push(...elementAnalysis.weaknesses);
  recommendations.push(...elementAnalysis.recommendations);
  
  // 整合十神分析
  if (tenGodsAnalysis.dominant.length > 0) {
    strengths.push(`十神以${tenGodsAnalysis.dominant.join('、')}為主，${tenGodsAnalysis.analysis}`);
  }
  
  // 整合神煞分析
  if (spiritsAnalysis.lucky.length > 0) {
    strengths.push(`帶有${spiritsAnalysis.lucky.length}個吉神，貴人運強`);
  }
  if (spiritsAnalysis.unlucky.length > 0) {
    weaknesses.push(`帶有${spiritsAnalysis.unlucky.length}個凶神，需要化解`);
    recommendations.push('通過改號等方式化解凶神的不利影響');
  }
  
  const detailedAnalysis = `
${strengthAnalysis}

用神為${usefulGod.join('、')}，代表您需要這些五行來調和命格。忌神為${tabooGod.join('、')}，應該避免過多接觸這些五行。

${tenGodsAnalysis.analysis}

${spiritsAnalysis.analysis}

綜合來看，您的命格${dayMasterStrength === 'strong' ? '偏強' : dayMasterStrength === 'weak' ? '偏弱' : '平衡'}，建議選擇能夠${dayMasterStrength === 'strong' ? '洩耗' : dayMasterStrength === 'weak' ? '生助' : '調和'}命格的號碼，以達到最佳的能量平衡。
  `.trim();
  
  return { detailedAnalysis, strengths, weaknesses, recommendations };
}

/**
 * 分析五行平衡
 */
function analyzeFiveElementsBalance(fiveElements: any) {
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const recommendations: string[] = [];
  
  const elementMap: { [key: string]: { name: string; number: string } } = {
    'wood': { name: '木', number: '3、8' },
    'fire': { name: '火', number: '2、7' },
    'earth': { name: '土', number: '5、0' },
    'metal': { name: '金', number: '4、9' },
    'water': { name: '水', number: '1、6' }
  };
  
  const total = Object.values(fiveElements).reduce((sum: number, val) => sum + (val as number), 0);
  
  Object.entries(fiveElements).forEach(([key, value]) => {
    const percentage = ((value as number) / total) * 100;
    const element = elementMap[key];
    
    if (percentage >= 30) {
      strengths.push(`${element.name}旺盛（${value}個，${percentage.toFixed(0)}%）`);
    } else if (percentage === 0) {
      weaknesses.push(`${element.name}缺失（0個）`);
      recommendations.push(`建議選擇包含數字${element.number}的號碼來補${element.name}`);
    } else if (percentage <= 15) {
      weaknesses.push(`${element.name}較弱（${value}個，${percentage.toFixed(0)}%）`);
      recommendations.push(`可以考慮包含數字${element.number}的號碼來增強${element.name}`);
    }
  });
  
  return { strengths, weaknesses, recommendations };
}
