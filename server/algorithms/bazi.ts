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
  dayMasterAnalysis?: string;
  zodiacFortune?: string;
  fiveElementsDetailed?: string;
  careerFortune?: string;
  wealthFortune?: string;
  relationshipFortune?: string;
  healthFortune?: string;
  recommendations?: string[];
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
  
  // 日主特質分析
  const dayMasterAnalysis = analyzeDayMaster(dayStem);
  
  // 生肖運勢
  const zodiacFortune = analyzeZodiacFortune(zodiac);
  
  // 五行詳細分析
  const fiveElementsDetailed = analyzeFiveElementsDetailed(fiveElements);
  
  // 綜合運勢分析
  const { careerFortune, wealthFortune, relationshipFortune, healthFortune } = analyzeComprehensiveFortune(fiveElements, dayStem);
  
  // 改運建議
  const recommendations = generateRecommendations(fiveElements, weaknesses);

  return {
    year: { stem: yearStem, branch: yearBranch, element: FIVE_ELEMENTS[yearStem] },
    month: { stem: monthStem, branch: monthBranch, element: FIVE_ELEMENTS[monthStem] },
    day: { stem: dayStem, branch: dayBranch, element: FIVE_ELEMENTS[dayStem] },
    hour: { stem: hourStem, branch: hourBranch, element: FIVE_ELEMENTS[hourStem] },
    zodiac,
    fiveElements,
    analysis,
    strengths,
    weaknesses,
    dayMasterAnalysis,
    zodiacFortune,
    fiveElementsDetailed,
    careerFortune,
    wealthFortune,
    relationshipFortune,
    healthFortune,
    recommendations
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


/**
 * 分析日主特質
 */
function analyzeDayMaster(dayStem: string): string {
  const dayMasterAnalysis: { [key: string]: string } = {
    '甲': `您的日主為甲木，代表您如同參天大樹般正直堅強。

性格特點：
• 正直誠信，做事光明磊落，深受他人信賴
• 具有向上生長的精神，不斷追求進步和突破
• 創造力豐富，善於開創新局面
• 有時過於理想化，需要注意腳踏實地
• 適應力強，能在各種環境中生存發展

建議：您的優勢在於創造力和正直品格，建議從事需要創新和誠信的行業，如教育、設計、諮詢等。`,

    '乙': `您的日主為乙木，代表您如同柔韌的藤蔓，靈活而堅韌。

性格特點：
• 溫和友善，善於與人相處，人緣極佳
• 靈活變通，能適應各種環境和變化
• 細膩敏感，觀察力強，善解人意
• 有時過於委曲求全，需要堅持原則
• 韌性十足，遇到困難不輕易放棄

建議：您的優勢在於靈活性和親和力，適合從事需要溝通協調的工作，如公關、客服、藝術等。`,

    '丙': `您的日主為丙火，代表您如同太陽般熱情光明。

性格特點：
• 熱情洋溢，充滿活力，能感染周圍的人
• 光明磊落，不喜歡陰謀詭計
• 領導才能突出，善於激勵他人
• 有時過於衝動，需要三思而後行
• 樂觀積極，面對困難不退縮

建議：您的優勢在於熱情和領導力，適合從事需要影響力的工作，如管理、銷售、演藝等。`,

    '丁': `您的日主為丁火，代表您如同燭光般溫暖細膩。

性格特點：
• 溫文爾雅，待人親切，給人溫暖感覺
• 細心周到，注重細節，做事認真
• 有藝術天分，審美能力強
• 有時過於敏感，容易受傷
• 堅持不懈，默默付出不求回報

建議：您的優勢在於細膩和藝術感，適合從事需要細心和創意的工作，如設計、文學、醫療等。`,

    '戊': `您的日主為戊土，代表您如同高山般穩重可靠。

性格特點：
• 穩重踏實，值得信賴，是可靠的夥伴
• 責任心強，勇於承擔，不推卸責任
• 包容大度，能容納不同意見
• 有時過於固執，需要靈活變通
• 耐力持久，能堅持長期目標

建議：您的優勢在於穩定性和責任感，適合從事需要可靠性的工作，如管理、金融、建築等。`,

    '己': `您的日主為己土，代表您如同田園般溫和包容。

性格特點：
• 溫和謙遜，平易近人，善於照顧他人
• 務實勤勞，腳踏實地，不好高騖遠
• 善於積累，懂得儲蓄和理財
• 有時過於保守，需要勇於嘗試
• 包容性強，能與各種人和諧相處

建議：您的優勢在於務實和包容，適合從事需要耐心和細心的工作，如農業、服務、會計等。`,

    '庚': `您的日主為庚金，代表您如同利劍般果斷堅毅。

性格特點：
• 果斷堅毅，決策迅速，執行力強
• 正義感強，路見不平必拔刀相助
• 組織能力強，善於管理和規劃
• 有時過於剛硬，需要柔和處事
• 原則性強，不輕易妥協

建議：您的優勢在於決斷力和原則性，適合從事需要魄力的工作，如軍警、法律、企業管理等。`,

    '辛': `您的日主為辛金，代表您如同珠寶般精緻優雅。

性格特點：
• 精緻細膩，追求完美，品味高雅
• 聰明機智，反應敏捷，學習能力強
• 注重形象，懂得包裝和展示自己
• 有時過於挑剔，需要放寬標準
• 善於社交，人際關係處理得當

建議：您的優勢在於精緻和機智，適合從事需要品味的工作，如時尚、珠寶、美容等。`,

    '壬': `您的日主為壬水，代表您如同江河般智慧奔放。

性格特點：
• 智慧過人，思維敏捷，學習能力強
• 靈活變通，善於應對各種情況
• 溝通能力佳，口才流利，說服力強
• 有時過於善變，需要堅持到底
• 包容性強，能接納不同觀點

建議：您的優勢在於智慧和靈活性，適合從事需要思考和溝通的工作，如教育、傳媒、諮詢等。`,

    '癸': `您的日主為癸水，代表您如同雨露般滋潤細膩。

性格特點：
• 細膩敏感，善解人意，同理心強
• 想像力豐富，有藝術天分
• 溫柔體貼，善於照顧他人
• 有時過於多慮，需要放鬆心情
• 適應力強，能在各種環境中生存

建議：您的優勢在於細膩和同理心，適合從事需要關懷的工作，如醫療、心理、藝術等。`
  };

  return dayMasterAnalysis[dayStem] || '您的日主特質獨特，建議諮詢專業命理師傅進行深入分析。';
}

/**
 * 分析生肖運勢
 */
function analyzeZodiacFortune(zodiac: string): string {
  const zodiacFortune: { [key: string]: string } = {
    '鼠': '屬鼠的您聰明機智，今年貴人運強。吉祥方位：北方、西方。吉祥顏色：藍色、金色、白色。建議多往北方發展，有利於事業和財運。',
    '牛': '屬牛的您勤勞踏實，今年財運亨通。吉祥方位：東北、南方。吉祥顏色：黃色、紅色、紫色。建議穩紮穩打，積累財富。',
    '虎': '屬虎的您勇敢果斷，今年事業運佳。吉祥方位：東方、南方。吉祥顏色：綠色、紅色、橙色。建議把握機會，勇於開創。',
    '兔': '屬兔的您溫和善良，今年人緣極佳。吉祥方位：東方、北方。吉祥顏色：綠色、藍色、白色。建議多與人合作，互利共贏。',
    '龍': '屬龍的您氣勢磅礴，今年運勢強勁。吉祥方位：東方、南方、西方。吉祥顏色：金色、銀色、紅色。建議大展宏圖，實現抱負。',
    '蛇': '屬蛇的您智慧深沉，今年適合謀劃。吉祥方位：南方、西方。吉祥顏色：紅色、黃色、黑色。建議深思熟慮，穩中求進。',
    '馬': '屬馬的您熱情奔放，今年桃花運旺。吉祥方位：南方、西方。吉祥顏色：紅色、紫色、黃色。建議把握感情機會，注意選擇。',
    '羊': '屬羊的您溫順善良，今年家庭和睦。吉祥方位：南方、東南。吉祥顏色：綠色、紅色、紫色。建議注重家庭，平衡工作生活。',
    '猴': '屬猴的您機靈活潑，今年創意無限。吉祥方位：西方、北方。吉祥顏色：白色、金色、藍色。建議發揮創意，開拓新領域。',
    '雞': '屬雞的您勤奮認真，今年工作順利。吉祥方位：西方、東南。吉祥顏色：金色、黃色、咖啡色。建議專注工作，提升技能。',
    '狗': '屬狗的您忠誠可靠，今年貴人相助。吉祥方位：南方、東方。吉祥顏色：紅色、綠色、紫色。建議珍惜貴人，互相幫助。',
    '豬': '屬豬的您福氣滿滿，今年財運不錯。吉祥方位：北方、東方。吉祥顏色：黑色、藍色、綠色。建議把握財機，適度投資。'
  };

  return zodiacFortune[zodiac] || '您的生肖運勢獨特，建議諮詢專業命理師傅。';
}

/**
 * 五行詳細分析
 */
function analyzeFiveElementsDetailed(elements: BaziResult['fiveElements']): string {
  const total = Object.values(elements).reduce((sum, val) => sum + val, 0);
  let detailed = '您的五行分佈詳細分析：\n\n';

  const elementDetails: { [key: string]: { name: string; strong: string; weak: string; balanced: string } } = {
    wood: {
      name: '木',
      strong: `木旺盛（${elements.wood}個，${Math.round(elements.wood / total * 100)}%）：代表您創造力豐富、適應力強、生命力旺盛。優勢：善於創新、學習能力強、人際關係佳。注意：避免過於理想化，要腳踏實地。`,
      weak: `木不足（${elements.wood}個，${Math.round(elements.wood / total * 100)}%）：代表您可能缺乏創造力和活力。建議：多接觸綠色植物、從事創意活動、選擇木屬性號碼（3、8）來補益。`,
      balanced: `木平衡（${elements.wood}個，${Math.round(elements.wood / total * 100)}%）：代表您的創造力和適應力處於良好狀態。`
    },
    fire: {
      name: '火',
      strong: `火旺盛（${elements.fire}個，${Math.round(elements.fire / total * 100)}%）：代表您熱情洋溢、行動力強、領導才能突出。優勢：充滿活力、感染力強、勇於表現。注意：避免過於衝動，保持冷靜思考。`,
      weak: `火不足（${elements.fire}個，${Math.round(elements.fire / total * 100)}%）：代表您可能缺乏熱情和行動力。建議：多穿紅色衣服、增加戶外活動、選擇火屬性號碼（2、7）來補益。`,
      balanced: `火平衡（${elements.fire}個，${Math.round(elements.fire / total * 100)}%）：代表您的熱情和行動力處於良好狀態。`
    },
    earth: {
      name: '土',
      strong: `土旺盛（${elements.earth}個，${Math.round(elements.earth / total * 100)}%）：代表您穩重踏實、信用良好、責任心強。優勢：可靠值得信賴、耐力持久、善於積累。注意：避免過於保守，要勇於創新。`,
      weak: `土不足（${elements.earth}個，${Math.round(elements.earth / total * 100)}%）：代表您可能缺乏穩定性和責任感。建議：培養耐心、建立信用、選擇土屬性號碼（5、10）來補益。`,
      balanced: `土平衡（${elements.earth}個，${Math.round(elements.earth / total * 100)}%）：代表您的穩定性和責任感處於良好狀態。`
    },
    metal: {
      name: '金',
      strong: `金旺盛（${elements.metal}個，${Math.round(elements.metal / total * 100)}%）：代表您果斷堅毅、組織能力強、重視原則。優勢：決策迅速、執行力強、正義感強。注意：避免過於剛硬，要學會柔和處事。`,
      weak: `金不足（${elements.metal}個，${Math.round(elements.metal / total * 100)}%）：代表您可能缺乏決斷力和原則性。建議：培養果斷、堅持原則、選擇金屬性號碼（4、9）來補益。`,
      balanced: `金平衡（${elements.metal}個，${Math.round(elements.metal / total * 100)}%）：代表您的決斷力和原則性處於良好狀態。`
    },
    water: {
      name: '水',
      strong: `水旺盛（${elements.water}個，${Math.round(elements.water / total * 100)}%）：代表您智慧靈活、善於變通、溝通能力佳。優勢：思維敏捷、學習能力強、人際關係好。注意：避免過於善變，要堅持到底。`,
      weak: `水不足（${elements.water}個，${Math.round(elements.water / total * 100)}%）：代表您可能缺乏靈活性和智慧。建議：多喝水、培養思考習慣、選擇水屬性號碼（1、6）來補益。`,
      balanced: `水平衡（${elements.water}個，${Math.round(elements.water / total * 100)}%）：代表您的智慧和靈活性處於良好狀態。`
    }
  };

  Object.entries(elements).forEach(([key, value]) => {
    const percentage = (value / total) * 100;
    const detail = elementDetails[key];
    
    if (percentage >= 25) {
      detailed += `• ${detail.strong}\n\n`;
    } else if (percentage <= 10) {
      detailed += `• ${detail.weak}\n\n`;
    } else {
      detailed += `• ${detail.balanced}\n\n`;
    }
  });

  return detailed.trim();
}

/**
 * 綜合運勢分析
 */
function analyzeComprehensiveFortune(elements: BaziResult['fiveElements'], dayStem: string) {
  const total = Object.values(elements).reduce((sum, val) => sum + val, 0);
  
  // 事業運分析
  let careerFortune = '事業運分析：\n\n';
  if (elements.wood / total >= 0.25) {
    careerFortune += '• 您的木旺盛，創造力豐富，適合從事創意、教育、文化、設計等行業。\n';
    careerFortune += '• 建議發揮創新能力，開創新局面，會有不錯的發展。\n';
  }
  if (elements.fire / total >= 0.25) {
    careerFortune += '• 您的火旺盛，領導才能突出，適合從事管理、銷售、演藝、公關等行業。\n';
    careerFortune += '• 建議把握機會，勇於表現，容易獲得晉升。\n';
  }
  if (elements.earth / total >= 0.25) {
    careerFortune += '• 您的土旺盛，穩重可靠，適合從事金融、房地產、建築、農業等行業。\n';
    careerFortune += '• 建議穩紮穩打，長期積累，會有豐厚回報。\n';
  }
  if (elements.metal / total >= 0.25) {
    careerFortune += '• 您的金旺盛，決斷力強，適合從事法律、軍警、企業管理、機械等行業。\n';
    careerFortune += '• 建議發揮執行力，果斷決策，容易成為領導者。\n';
  }
  if (elements.water / total >= 0.25) {
    careerFortune += '• 您的水旺盛，智慧靈活，適合從事科技、傳媒、諮詢、貿易等行業。\n';
    careerFortune += '• 建議發揮智慧，靈活應變，容易在競爭中脫穎而出。\n';
  }
  
  // 財運分析
  let wealthFortune = '財運分析：\n\n';
  if (elements.earth / total >= 0.25) {
    wealthFortune += '• 您的土旺盛，善於積累財富，理財能力強。\n';
    wealthFortune += '• 建議穩健投資，長期持有，會有不錯的收益。\n';
  }
  if (elements.metal / total >= 0.25) {
    wealthFortune += '• 您的金旺盛，財運不錯，容易獲得意外之財。\n';
    wealthFortune += '• 建議把握投資機會，但要注意風險控制。\n';
  }
  if (elements.water / total >= 0.25) {
    wealthFortune += '• 您的水旺盛，財源廣進，善於發現商機。\n';
    wealthFortune += '• 建議多方嘗試，靈活投資，容易獲得回報。\n';
  }
  wealthFortune += '• 整體財運：根據您的五行配置，建議選擇適合的投資方式，避免過度冒險。\n';
  
  // 感情運分析
  let relationshipFortune = '感情運分析：\n\n';
  if (elements.fire / total >= 0.25) {
    relationshipFortune += '• 您的火旺盛，桃花運佳，異性緣好，容易吸引他人注意。\n';
    relationshipFortune += '• 建議主動表達，把握機會，但要注意選擇合適對象。\n';
  }
  if (elements.water / total >= 0.25) {
    relationshipFortune += '• 您的水旺盛，溫柔體貼，善解人意，容易獲得異性好感。\n';
    relationshipFortune += '• 建議真誠相待，用心經營，會有美滿姻緣。\n';
  }
  if (elements.earth / total >= 0.25) {
    relationshipFortune += '• 您的土旺盛，感情穩定，忠誠可靠，適合長期交往。\n';
    relationshipFortune += '• 建議珍惜緣分，用心維護，會有幸福家庭。\n';
  }
  relationshipFortune += '• 整體感情運：根據您的五行配置，建議真誠待人，自然會遇到合適對象。\n';
  
  // 健康運分析
  let healthFortune = '健康運分析：\n\n';
  if (elements.fire / total >= 0.3) {
    healthFortune += '• 您的火過旺，要注意心血管健康，避免過度勞累，保持冷靜。\n';
    healthFortune += '• 建議：多喝水、避免熬夜、保持情緒穩定。\n';
  }
  if (elements.water / total >= 0.3) {
    healthFortune += '• 您的水過旺，要注意腎臟和泌尿系統健康，避免受寒。\n';
    healthFortune += '• 建議：注意保暖、規律作息、適度運動。\n';
  }
  if (elements.wood / total >= 0.3) {
    healthFortune += '• 您的木過旺，要注意肝臟健康，避免情緒波動過大。\n';
    healthFortune += '• 建議：保持心情愉快、避免飲酒、多吃蔬菜。\n';
  }
  if (elements.metal / total >= 0.3) {
    healthFortune += '• 您的金過旺，要注意呼吸系統健康，避免過度勞累。\n';
    healthFortune += '• 建議：多做深呼吸、保持室內空氣流通、適度休息。\n';
  }
  if (elements.earth / total >= 0.3) {
    healthFortune += '• 您的土過旺，要注意脾胃健康，避免暴飲暴食。\n';
    healthFortune += '• 建議：飲食規律、細嚼慢嚥、避免生冷食物。\n';
  }
  healthFortune += '• 整體健康運：根據您的五行配置，建議保持良好生活習慣，定期體檢。\n';
  
  return {
    careerFortune: careerFortune.trim(),
    wealthFortune: wealthFortune.trim(),
    relationshipFortune: relationshipFortune.trim(),
    healthFortune: healthFortune.trim()
  };
}

/**
 * 生成改運建議
 */
function generateRecommendations(elements: BaziResult['fiveElements'], weaknesses: string[]): string[] {
  const recommendations: string[] = [];
  const total = Object.values(elements).reduce((sum, val) => sum + val, 0);
  
  // 根據缺失的五行提供建議
  if (elements.wood / total <= 0.1) {
    recommendations.push('穿著建議：多穿綠色、青色衣服（補木）');
    recommendations.push('方位建議：辦公桌朝東，床頭朝東（木方）');
    recommendations.push('飾品建議：佩戴木質飾品、綠色水晶（木屬性）');
    recommendations.push('號碼建議：選擇包含 3、8 的數字（木屬性）');
  }
  
  if (elements.fire / total <= 0.1) {
    recommendations.push('穿著建議：多穿紅色、紫色衣服（補火）');
    recommendations.push('方位建議：辦公桌朝南，床頭朝南（火方）');
    recommendations.push('飾品建議：佩戴紅瑪瑙、石榴石（火屬性）');
    recommendations.push('號碼建議：選擇包含 2、7 的數字（火屬性）');
  }
  
  if (elements.earth / total <= 0.1) {
    recommendations.push('穿著建議：多穿黃色、咖啡色衣服（補土）');
    recommendations.push('方位建議：辦公桌朝西南，床頭朝西南（土方）');
    recommendations.push('飾品建議：佩戴黃水晶、琥珀（土屬性）');
    recommendations.push('號碼建議：選擇包含 5、10 的數字（土屬性）');
  }
  
  if (elements.metal / total <= 0.1) {
    recommendations.push('穿著建議：多穿白色、金色衣服（補金）');
    recommendations.push('方位建議：辦公桌朝西，床頭朝西（金方）');
    recommendations.push('飾品建議：佩戴金屬飾品、白水晶（金屬性）');
    recommendations.push('號碼建議：選擇包含 4、9 的數字（金屬性）');
  }
  
  if (elements.water / total <= 0.1) {
    recommendations.push('穿著建議：多穿黑色、藍色衣服（補水）');
    recommendations.push('方位建議：辦公桌朝北，床頭朝北（水方）');
    recommendations.push('飾品建議：佩戴黑曜石、藍水晶（水屬性）');
    recommendations.push('號碼建議：選擇包含 1、6 的數字（水屬性）');
  }
  
  // 通用建議
  recommendations.push('時間建議：選擇適合您五行的時段進行重要決策');
  recommendations.push('環境建議：多接觸有利於您五行的環境和物品');
  recommendations.push('改號建議：選擇與您八字相配的電話號碼，助運勢提升');
  
  return recommendations;
}
