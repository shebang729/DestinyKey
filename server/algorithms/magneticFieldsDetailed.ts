// 八星磁場數字能量學算法 - 詳細版本

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
  luckyLevel: 'excellent' | 'good' | 'neutral' | 'challenging';
  detailedAnalysis: {
    overview: string;
    career: string;
    wealth: string;
    relationship: string;
    health: string;
  };
}

export interface NumberCombination {
  combination: string;
  field: MagneticField;
  meaning: string;
}

// 八大磁場詳細定義
export const MAGNETIC_FIELDS_DETAILED: Record<string, MagneticField> = {
  tianyi: {
    type: 'tianyi',
    name: '天醫磁場',
    description: '財富、貴人、健康之星',
    characteristics: ['財運亨通', '貴人相助', '身體健康', '事業順利'],
    scores: { career: 65, wealth: 70, relationship: 60, health: 65 },
    luckyLevel: 'excellent',
    detailedAnalysis: {
      overview: '天醫磁場是八大磁場中最吉利的磁場之一，代表著財富、健康和貴人運。擁有此磁場的人通常財運亨通，容易得到貴人相助，身體健康狀況良好。',
      career: '事業方面容易遇到貴人提攜，工作順利，升遷機會多。適合從事醫療、金融、管理等需要專業知識的行業。領導能力強，容易獲得上司賞識和同事信任。',
      wealth: '財運極佳，正財偏財都旺。投資理財眼光獨到，容易抓住賺錢機會。財富累積穩定，適合長期投資。容易通過專業技能和人脈資源獲得財富。',
      relationship: '人際關係和諧，容易結交到對自己有幫助的朋友。感情方面較為穩定，伴侶關係融洽。社交能力強，受人歡迎和信任。',
      health: '身體健康狀況良好，抵抗力強，較少生病。即使偶有小恙也能快速康復。適合注重養生保健，可以長壽。精神狀態積極樂觀。'
    }
  },
  yannian: {
    type: 'yannian',
    name: '延年磁場',
    description: '領導、決斷、執行力',
    characteristics: ['領導能力強', '決策果斷', '執行力高', '責任心重'],
    scores: { career: 70, wealth: 60, relationship: 55, health: 65 },
    luckyLevel: 'excellent',
    detailedAnalysis: {
      overview: '延年磁場代表著強大的領導力和執行力，是成功人士的典型磁場。擁有此磁場的人決策果斷，責任心強，善於掌控局面。',
      career: '天生的領導者，適合擔任管理職位或創業。決策能力強，能夠在關鍵時刻做出正確判斷。執行力高，說到做到，深得下屬信服。適合從事企業管理、政治、軍事等需要領導力的領域。',
      wealth: '財運穩健，主要通過事業成就獲得財富。適合穩健型投資，不宜投機。財富累積速度穩定，中年後財運更旺。善於把握商機，但需注意不要過於冒險。',
      relationship: '在人際關係中處於主導地位，但有時過於強勢可能影響親密關係。需要學會傾聽和妥協。朋友圈中多為事業夥伴，社交以工作為主。',
      health: '身體素質良好，精力充沛。但因工作壓力大，需注意心血管健康。建議定期運動，保持工作與生活的平衡。注意不要過度勞累。'
    }
  },
  shengqi: {
    type: 'shengqi',
    name: '生氣磁場',
    description: '人緣、溝通、創意',
    characteristics: ['人緣極佳', '溝通能力強', '創意豐富', '樂觀積極'],
    scores: { career: 60, wealth: 55, relationship: 70, health: 65 },
    luckyLevel: 'excellent',
    detailedAnalysis: {
      overview: '生氣磁場代表著旺盛的生命力和創造力，是人緣最好的磁場。擁有此磁場的人性格開朗，善於溝通，創意無限。',
      career: '適合從事需要創意和溝通的工作，如廣告、媒體、教育、銷售等。人際關係是事業成功的關鍵，容易通過人脈獲得機會。團隊合作能力強，是優秀的協調者。',
      wealth: '財運主要來自人脈和創意。適合從事與人打交道的行業。偏財運不錯，但需注意理財規劃。容易因為人情而有金錢支出，需要學會適度拒絕。',
      relationship: '人緣極佳，朋友眾多，社交活躍。感情運勢旺盛，桃花運好。婚姻生活和諧，善於經營感情。但要注意不要過於八面玲瓏，保持真誠。',
      health: '精神狀態良好，心態積極樂觀。身體健康，活力充沛。但因社交活動多，需注意作息規律。建議保持適度運動，注意飲食健康。'
    }
  },
  fuwei: {
    type: 'fuwei',
    name: '伏位磁場',
    description: '穩定、等待、積累',
    characteristics: ['性格穩定', '善於等待', '積累能量', '持之以恆'],
    scores: { career: 50, wealth: 50, relationship: 50, health: 55 },
    luckyLevel: 'neutral',
    detailedAnalysis: {
      overview: '伏位磁場代表著穩定和積累，是一個中性偏吉的磁場。擁有此磁場的人性格穩重，善於等待時機，持之以恆。',
      career: '事業發展穩定但緩慢，適合需要耐心和積累的工作。不適合快速變化的行業，更適合傳統穩定的職業。需要主動尋求突破，避免過於保守。適合公務員、教師、技術人員等職業。',
      wealth: '財運平穩，主要靠穩定收入累積財富。不適合高風險投資，建議選擇穩健型理財產品。財富增長緩慢但穩定，適合長期規劃。需要培養理財意識，避免錯失機會。',
      relationship: '感情穩定但缺乏激情，需要主動經營。人際關係平淡，朋友不多但都是真心朋友。婚姻生活平穩，但要注意增加生活情趣。建議多參加社交活動，擴大交際圈。',
      health: '身體健康狀況穩定，但缺乏活力。建議增加運動，提升身體素質。注意不要過於安逸，保持適度的挑戰。心理健康良好，情緒穩定。'
    }
  },
  jueming: {
    type: 'jueming',
    name: '絕命磁場',
    description: '極端、突破、危機',
    characteristics: ['個性極端', '突破能力', '危機意識', '壓力較大'],
    scores: { career: 40, wealth: 45, relationship: 35, health: 30 },
    luckyLevel: 'challenging',
    detailedAnalysis: {
      overview: '絕命磁場是最具挑戰性的磁場之一，代表著極端和突破。擁有此磁場的人個性鮮明，要麼大成功要麼大失敗，人生起伏較大。',
      career: '事業發展極端，容易大起大落。適合高風險高回報的行業，如創業、投資、演藝等。突破能力強，但也容易因衝動而失敗。需要學會穩健經營，避免孤注一擲。建議尋求專業指導，制定長遠規劃。',
      wealth: '財運波動大，可能暴富也可能破財。不適合穩定型投資，但在投機方面可能有意外收穫。需要特別注意風險控制，避免過度投資。建議保留應急資金，不要把所有資產投入高風險項目。',
      relationship: '人際關係複雜，容易與人產生衝突。感情生活波折較多，需要學會控制情緒。婚姻關係需要特別經營，避免因小事爭吵。建議培養同理心，學會換位思考，改善人際關係。',
      health: '健康狀況需要特別注意，壓力大容易影響身心健康。建議定期體檢，及早發現問題。注意心理健康，學會釋放壓力。適合練習冥想、瑜伽等舒緩身心的活動。'
    }
  },
  wugui: {
    type: 'wugui',
    name: '五鬼磁場',
    description: '智慧、變化、不穩',
    characteristics: ['智慧過人', '變化多端', '情緒不穩', '思慮過多'],
    scores: { career: 50, wealth: 45, relationship: 40, health: 45 },
    luckyLevel: 'neutral',
    detailedAnalysis: {
      overview: '五鬼磁場代表著智慧和變化，是一個充滿矛盾的磁場。擁有此磁場的人聰明過人，但情緒容易波動，思慮過多。',
      career: '適合需要智慧和創新的工作，如科研、設計、策劃等。思維敏捷，善於解決複雜問題。但容易想太多而猶豫不決，需要培養執行力。適合從事腦力工作，但要注意不要過度思慮。',
      wealth: '財運起伏不定，容易因為想太多而錯失機會。適合穩健投資，不宜頻繁交易。需要克服優柔寡斷的性格，果斷把握機會。建議尋求專業理財建議，制定清晰的財務計劃。',
      relationship: '人際關係複雜，容易多疑。感情方面思慮過多，容易患得患失。需要學會信任他人，放鬆心態。建議多與朋友交流，不要把所有事情都藏在心裡。婚姻需要坦誠溝通。',
      health: '精神壓力大，容易焦慮和失眠。需要特別注意心理健康，學會放鬆。建議培養興趣愛好，轉移注意力。適合練習冥想、太極等舒緩身心的活動。注意不要過度用腦。'
    }
  },
  liusha: {
    type: 'liusha',
    name: '六煞磁場',
    description: '桃花、人緣、消耗',
    characteristics: ['桃花運強', '人緣好', '消耗較大', '感情複雜'],
    scores: { career: 45, wealth: 40, relationship: 60, health: 50 },
    luckyLevel: 'neutral',
    detailedAnalysis: {
      overview: '六煞磁場代表著桃花和人緣，但也伴隨著消耗。擁有此磁場的人魅力十足，異性緣好，但感情容易複雜。',
      career: '適合從事與人打交道的工作，如銷售、公關、娛樂等。人緣好容易獲得機會，但要注意不要因感情影響工作。需要保持專業態度，避免辦公室戀情帶來的困擾。',
      wealth: '財運一般，容易因為社交和感情而有較大支出。需要學會理財，控制不必要的消費。桃花運可能帶來額外支出，需要特別注意。建議制定預算，避免衝動消費。',
      relationship: '桃花運旺盛，異性緣極好。但感情容易複雜，可能同時面對多段感情。需要學會選擇，避免腳踏多船。已婚者要特別注意，避免婚外情。建議專一對待感情，珍惜眼前人。',
      health: '身體健康一般，容易因為感情和社交活動而消耗精力。需要注意作息規律，保證充足睡眠。建議適度社交，不要過度透支身體。注意情緒管理，避免因感情問題影響健康。'
    }
  },
  huohai: {
    type: 'huohai',
    name: '禍害磁場',
    description: '口才、是非、波折',
    characteristics: ['口才極佳', '容易是非', '波折較多', '需謹言慎行'],
    scores: { career: 45, wealth: 40, relationship: 40, health: 35 },
    luckyLevel: 'challenging',
    detailedAnalysis: {
      overview: '禍害磁場代表著口才和是非，是一個需要特別注意的磁場。擁有此磁場的人口才極佳，但容易招惹是非，人生波折較多。',
      career: '適合需要口才的工作，如律師、主持人、銷售等。表達能力強，善於說服他人。但要注意言多必失，避免因言語得罪人。建議謹言慎行，多做少說。適合從事需要溝通的工作，但要學會把握分寸。',
      wealth: '財運波動，容易因口舌是非而破財。需要特別注意合同條款，避免法律糾紛。投資需謹慎，不要輕信他人。建議保留證據，保護自己的權益。理財要穩健，避免高風險投資。',
      relationship: '人際關係複雜，容易捲入是非。需要學會沉默是金，不要隨意評論他人。感情方面容易因誤會而產生矛盾，需要坦誠溝通。建議多聽少說，避免無謂的爭執。婚姻需要互相理解和包容。',
      health: '健康狀況一般，容易因壓力和情緒波動而影響健康。需要注意口腔和呼吸系統健康。建議學會情緒管理，保持平和心態。適合練習冥想、瑜伽等舒緩身心的活動。注意飲食健康，避免上火。'
    }
  }
};

// 32種數字組合的詳細含義
export const NUMBER_COMBINATIONS_DETAILED: Record<string, { fieldType: string; meaning: string }> = {
  '13': { fieldType: 'tianyi', meaning: '天醫組合，財富與健康兼得，貴人運極佳' },
  '31': { fieldType: 'tianyi', meaning: '天醫組合，事業順利，容易得到上司賞識' },
  '68': { fieldType: 'tianyi', meaning: '天醫組合，財運亨通，適合投資理財' },
  '86': { fieldType: 'tianyi', meaning: '天醫組合，身體健康，精力充沛' },
  '49': { fieldType: 'tianyi', meaning: '天醫組合，貴人相助，事業有成' },
  '94': { fieldType: 'tianyi', meaning: '天醫組合，財富累積穩定，長期發展佳' },
  '27': { fieldType: 'tianyi', meaning: '天醫組合，專業能力強，受人尊重' },
  '72': { fieldType: 'tianyi', meaning: '天醫組合，健康長壽，家庭和睦' },
  
  '19': { fieldType: 'yannian', meaning: '延年組合，領導能力突出，適合管理職位' },
  '91': { fieldType: 'yannian', meaning: '延年組合，決策果斷，執行力強' },
  '78': { fieldType: 'yannian', meaning: '延年組合，責任心重，深得信任' },
  '87': { fieldType: 'yannian', meaning: '延年組合，事業心強，成就非凡' },
  '43': { fieldType: 'yannian', meaning: '延年組合，掌控能力強，適合創業' },
  '34': { fieldType: 'yannian', meaning: '延年組合，權威性強，威信高' },
  '26': { fieldType: 'yannian', meaning: '延年組合，組織能力佳，團隊領袖' },
  '62': { fieldType: 'yannian', meaning: '延年組合，執行力高，說到做到' },
  
  '14': { fieldType: 'shengqi', meaning: '生氣組合，人緣極佳，朋友眾多' },
  '41': { fieldType: 'shengqi', meaning: '生氣組合，溝通能力強，善於表達' },
  '67': { fieldType: 'shengqi', meaning: '生氣組合，創意無限，思維活躍' },
  '76': { fieldType: 'shengqi', meaning: '生氣組合，樂觀積極，正能量滿滿' },
  '39': { fieldType: 'shengqi', meaning: '生氣組合，社交活躍，人脈廣闊' },
  '93': { fieldType: 'shengqi', meaning: '生氣組合，親和力強，受人歡迎' },
  '28': { fieldType: 'shengqi', meaning: '生氣組合，團隊合作佳，協調能力強' },
  '82': { fieldType: 'shengqi', meaning: '生氣組合，桃花運旺，感情豐富' },
  
  '11': { fieldType: 'fuwei', meaning: '伏位組合，穩定持久，適合長期發展' },
  '22': { fieldType: 'fuwei', meaning: '伏位組合，積累能量，厚積薄發' },
  '33': { fieldType: 'fuwei', meaning: '伏位組合，性格穩重，值得信賴' },
  '44': { fieldType: 'fuwei', meaning: '伏位組合，持之以恆，堅持不懈' },
  '66': { fieldType: 'fuwei', meaning: '伏位組合，等待時機，謀定後動' },
  '77': { fieldType: 'fuwei', meaning: '伏位組合，穩健發展，步步為營' },
  '88': { fieldType: 'fuwei', meaning: '伏位組合，積累經驗，穩中求進' },
  '99': { fieldType: 'fuwei', meaning: '伏位組合，沉穩內斂，大器晚成' },
  
  '12': { fieldType: 'jueming', meaning: '絕命組合，極端性格，大起大落' },
  '21': { fieldType: 'jueming', meaning: '絕命組合，突破能力強，敢於冒險' },
  '69': { fieldType: 'jueming', meaning: '絕命組合，危機意識強，應變能力佳' },
  '96': { fieldType: 'jueming', meaning: '絕命組合，壓力較大，需要調適' },
  '48': { fieldType: 'jueming', meaning: '絕命組合，挑戰性高，需謹慎行事' },
  '84': { fieldType: 'jueming', meaning: '絕命組合，波動較大，注意風險' },
  '37': { fieldType: 'jueming', meaning: '絕命組合，衝動性強，需要控制' },
  '73': { fieldType: 'jueming', meaning: '絕命組合，極端思維，需要平衡' },
  
  '18': { fieldType: 'wugui', meaning: '五鬼組合，智慧過人，思維敏捷' },
  '81': { fieldType: 'wugui', meaning: '五鬼組合，變化多端，適應力強' },
  '79': { fieldType: 'wugui', meaning: '五鬼組合，思慮周密，善於分析' },
  '97': { fieldType: 'wugui', meaning: '五鬼組合，情緒波動，需要穩定' },
  '46': { fieldType: 'wugui', meaning: '五鬼組合，想法多變，創新能力強' },
  '64': { fieldType: 'wugui', meaning: '五鬼組合，多疑敏感，需要信任' },
  '23': { fieldType: 'wugui', meaning: '五鬼組合，思考深入，洞察力強' },
  '32': { fieldType: 'wugui', meaning: '五鬼組合，聰明機智，反應快速' },
  
  '16': { fieldType: 'liusha', meaning: '六煞組合，桃花運旺，異性緣佳' },
  '61': { fieldType: 'liusha', meaning: '六煞組合，魅力十足，吸引力強' },
  '47': { fieldType: 'liusha', meaning: '六煞組合，人緣極好，社交活躍' },
  '74': { fieldType: 'liusha', meaning: '六煞組合，感情豐富，情感細膩' },
  '38': { fieldType: 'liusha', meaning: '六煞組合，消耗較大，需要節制' },
  '83': { fieldType: 'liusha', meaning: '六煞組合，感情複雜，需要專一' },
  '29': { fieldType: 'liusha', meaning: '六煞組合，桃花多變，情路波折' },
  '92': { fieldType: 'liusha', meaning: '六煞組合，異性緣強，需要把握' },
  
  '17': { fieldType: 'huohai', meaning: '禍害組合，口才極佳，表達能力強' },
  '71': { fieldType: 'huohai', meaning: '禍害組合，容易是非，需謹言慎行' },
  '89': { fieldType: 'huohai', meaning: '禍害組合，波折較多，需要耐心' },
  '98': { fieldType: 'huohai', meaning: '禍害組合，言多必失，少說多做' },
  '24': { fieldType: 'huohai', meaning: '禍害組合，口舌是非，避免爭執' },
  '42': { fieldType: 'huohai', meaning: '禍害組合，溝通需注意，避免誤會' },
  '36': { fieldType: 'huohai', meaning: '禍害組合，人際複雜，保持距離' },
  '63': { fieldType: 'huohai', meaning: '禍害組合，謹慎發言，三思而後行' }
};

/**
 * 獲取數字組合的磁場信息
 */
export function getMagneticFieldForCombination(combination: string): NumberCombination | null {
  const info = NUMBER_COMBINATIONS_DETAILED[combination];
  if (!info) return null;
  
  const field = MAGNETIC_FIELDS_DETAILED[info.fieldType];
  if (!field) return null;
  
  return {
    combination,
    field,
    meaning: info.meaning
  };
}

/**
 * 分析電話號碼的所有數字組合
 */
export function analyzePhoneNumber(phoneNumber: string): {
  combinations: NumberCombination[];
  dominantField: MagneticField;
  overallScores: {
    career: number;
    wealth: number;
    relationship: number;
    health: number;
  };
} {
  const digits = phoneNumber.replace(/\D/g, '');
  const combinations: NumberCombination[] = [];
  
  // 提取所有兩位數組合
  for (let i = 0; i < digits.length - 1; i++) {
    const combo = digits[i] + digits[i + 1];
    const fieldInfo = getMagneticFieldForCombination(combo);
    if (fieldInfo) {
      combinations.push(fieldInfo);
    }
  }
  
  // 統計各磁場出現次數
  const fieldCounts: Record<string, number> = {};
  combinations.forEach(combo => {
    const fieldType = combo.field.type;
    fieldCounts[fieldType] = (fieldCounts[fieldType] || 0) + 1;
  });
  
  // 找出主導磁場
  let dominantFieldType = 'fuwei';
  let maxCount = 0;
  Object.entries(fieldCounts).forEach(([fieldType, count]) => {
    if (count > maxCount) {
      maxCount = count;
      dominantFieldType = fieldType;
    }
  });
  
  const dominantField = MAGNETIC_FIELDS_DETAILED[dominantFieldType];
  
  // 計算綜合評分
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
    
    overallScores.career = Math.max(20, Math.round(overallScores.career / combinations.length) - 12);
    overallScores.wealth = Math.max(20, Math.round(overallScores.wealth / combinations.length) - 15);
    overallScores.relationship = Math.max(20, Math.round(overallScores.relationship / combinations.length) - 10);
    overallScores.health = Math.max(20, Math.round(overallScores.health / combinations.length) - 13);
  }
  
  return {
    combinations,
    dominantField,
    overallScores
  };
}
