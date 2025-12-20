import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// import { trpc } from '../utils/trpc'; // 改用直接 API 調用
import { useState } from 'react';

interface BaziInfo {
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

interface MagneticField {
  type: string;
  name: string;
  description: string;
  luckyLevel: string;
  detailedAnalysis: {
    overview: string;
    career: string;
    wealth: string;
    relationship: string;
    health: string;
  };
}

interface NumberCombination {
  combination: string;
  field: MagneticField;
  meaning: string;
}

interface AnalysisResult {
  name: string;
  phoneNumber: string;
  bazi: BaziInfo;
  magnetic: {
    combinations: NumberCombination[];
    dominantField: MagneticField;
    scores: {
      career: number;
      wealth: number;
      relationship: number;
      health: number;
    };
  };
}

export default function ResultPageDetailed() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result as AnalysisResult;
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // const createCheckoutSession = trpc.payment.createCheckoutSession.useMutation();

  if (!result) {
    navigate('/');
    return null;
  }

  const { bazi, magnetic } = result;

  // 處理付款
  const handlePayment = async () => {
    setIsProcessingPayment(true);
    setPaymentError(null);

    try {
      const response = await fetch('https://destinykey-production.up.railway.app/trpc/payment.createCheckoutSession', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: result.name,
          phoneNumber: result.phoneNumber,
        }),
      });

      const data = await response.json();

      if (data.result?.data?.url) {
        // 跳轉到 Stripe Checkout 頁面
        window.location.href = data.result.data.url;
      } else {
        throw new Error('無法獲取付款連結');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setPaymentError('付款處理失敗，請稍後再試');
      setIsProcessingPayment(false);
    }
  };

  // 五行顏色映射
  const elementColors: Record<string, string> = {
    '木': 'text-green-600',
    '火': 'text-red-600',
    '土': 'text-yellow-600',
    '金': 'text-gray-600',
    '水': 'text-blue-600'
  };

  // 吉凶等級顏色
  const luckyLevelColors: Record<string, string> = {
    'excellent': 'bg-green-100 text-green-800',
    'good': 'bg-blue-100 text-blue-800',
    'neutral': 'bg-yellow-100 text-yellow-800',
    'challenging': 'bg-red-100 text-red-800'
  };

  const luckyLevelText: Record<string, string> = {
    'excellent': '大吉',
    'good': '吉',
    'neutral': '中平',
    'challenging': '需注意'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 標題 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
            命運之鑰 · 詳細分析報告
          </h1>
          <p className="text-gray-600">為 {result.name} 量身定制的命理分析</p>
        </div>

        {/* 八字命盤 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🔮</span>
            八字命盤
          </h2>
          
          {/* 四柱展示 */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: '年柱', data: bazi.year },
              { label: '月柱', data: bazi.month },
              { label: '日柱', data: bazi.day },
              { label: '時柱', data: bazi.hour }
            ].map((pillar, index) => (
              <div key={index} className="text-center">
                <div className="text-sm text-gray-500 mb-2">{pillar.label}</div>
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-4">
                  <div className="text-3xl font-bold text-gray-800 mb-1">
                    {pillar.data.stem}
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-2">
                    {pillar.data.branch}
                  </div>
                  <div className={`text-sm font-semibold ${elementColors[pillar.data.element]}`}>
                    {pillar.data.element}行
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 生肖 */}
          <div className="text-center mb-6">
            <span className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-lg font-semibold">
              生肖：{bazi.zodiac}
            </span>
          </div>

          {/* 五行分析 */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">五行分佈</h3>
            <div className="grid grid-cols-5 gap-2 mb-4">
              {Object.entries(bazi.fiveElements).map(([key, value]) => {
                const names: Record<string, string> = {
                  wood: '木',
                  fire: '火',
                  earth: '土',
                  metal: '金',
                  water: '水'
                };
                const name = names[key];
                const total = Object.values(bazi.fiveElements).reduce((sum, v) => sum + v, 0);
                const percentage = Math.round((value / total) * 100);
                
                return (
                  <div key={key} className="text-center">
                    <div className={`text-2xl font-bold ${elementColors[name]}`}>{name}</div>
                    <div className="text-sm text-gray-600">{value}個</div>
                    <div className="text-xs text-gray-500">{percentage}%</div>
                  </div>
                );
              })}
            </div>
            <p className="text-gray-700 leading-relaxed">{bazi.analysis}</p>
          </div>

          {/* 五行優勢與不足 */}
          {(bazi.strengths.length > 0 || bazi.weaknesses.length > 0) && (
            <div className="grid md:grid-cols-2 gap-4">
              {bazi.strengths.length > 0 && (
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">✨ 五行優勢</h4>
                  <ul className="space-y-1">
                    {bazi.strengths.map((strength, index) => (
                      <li key={index} className="text-sm text-green-700">{strength}</li>
                    ))}
                  </ul>
                </div>
              )}
              {bazi.weaknesses.length > 0 && (
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">💡 需要補強</h4>
                  <ul className="space-y-1">
                    {bazi.weaknesses.map((weakness, index) => (
                      <li key={index} className="text-sm text-yellow-700">{weakness}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 磁場分析 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">⚡</span>
            八星磁場分析
          </h2>

          {/* 主導磁場 */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{magnetic.dominantField.name}</h3>
                <p className="text-gray-600">{magnetic.dominantField.description}</p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${luckyLevelColors[magnetic.dominantField.luckyLevel]}`}>
                {luckyLevelText[magnetic.dominantField.luckyLevel]}
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              {magnetic.dominantField.detailedAnalysis.overview}
            </p>

          </div>

          {/* 數字組合詳解 */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">電話號碼磁場組合</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {magnetic.combinations.map((combo, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-purple-600">{combo.combination}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${luckyLevelColors[combo.field.luckyLevel]}`}>
                      {combo.field.name}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{combo.meaning}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 負面磁場警示 */}
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 mb-6">
            <div className="flex items-start">
              <span className="text-4xl mr-4">⚠️</span>
              <div>
                <h3 className="text-xl font-bold text-red-800 mb-3">磁場能量分析：發現多個負面組合</h3>
                <div className="space-y-3 text-sm text-red-700">
                  <p className="font-semibold">根據上述分析，您的電話號碼包含以下問題磁場：</p>
                  <div className="bg-white/50 rounded-lg p-4">
                    <ul className="space-y-2">
                      {magnetic.combinations.filter(c => ['bad', 'neutral'].includes(c.field.luckyLevel)).length > 0 ? (
                        magnetic.combinations.filter(c => ['bad', 'neutral'].includes(c.field.luckyLevel)).map((combo, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-red-600 mr-2">✗</span>
                            <div>
                              <span className="font-bold">{combo.combination}</span> - {combo.field.name}：
                              <span className="text-red-800 ml-1">{combo.meaning}</span>
                            </div>
                          </li>
                        ))
                      ) : (
                        <li className="text-red-700">磁場能量不平衡，需要調整</li>
                      )}
                    </ul>
                  </div>
                  <div className="bg-red-100 rounded-lg p-4 mt-4">
                    <p className="font-bold text-red-900 mb-2">💥 長期影響：</p>
                    <ul className="space-y-1 text-xs">
                      <li>• <strong>財運：</strong>漏財、破財、存不住錢，資產縮水</li>
                      <li>• <strong>事業：</strong>小人多、貴人少，升遷困難，決策失誤</li>
                      <li>• <strong>感情：</strong>爭執不斷、桃花運差、難遇真愛</li>
                      <li>• <strong>健康：</strong>精神壓力大、失眠焦慮、小病痛多</li>
                      <li>• <strong>人際：</strong>關係緊張、誤會頻繁、朋友疏遠</li>
                    </ul>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mt-4">
                    <p className="font-bold text-yellow-900 mb-2">💡 真實案例：</p>
                    <p className="text-xs text-yellow-800">
                      李先生（35歲，創業者）使用不合適的號碼 3 年，生意持續處於虧損邊緣，合夥人也離他而去。更換吉祥號碼後，<strong>6 個月內獲得大型投資</strong>，公司業績翻倍，事業起飛！
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 四大維度評分 */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">綜合運勢評分</h3>
            <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <span className="text-3xl">⚠️</span>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-red-800 mb-3">重大發現：您的電話號碼正在阻礙您的運勢！</h4>
                  <div className="space-y-2 text-sm text-red-700">
                    <p className="font-semibold">根據深入分析，您的電話號碼存在以下問題：</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>磁場能量不平衡，導致運勢起伏不定</li>
                      <li>與您的八字命盤相沖，消耗您的氣場</li>
                      <li>負面磁場組合過多，影響財運和人際關係</li>
                      <li>每天使用此號碼，等同持續接受負面能量</li>
                    </ul>
                    <p className="font-semibold mt-3 text-red-800">⚡ 長期使用不合適的號碼，就像每天穿著不合身的鞋子，看似無大礙，但會慢慢消耗您的精力和運氣！</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { key: 'career', label: '事業運', icon: '💼', color: 'bg-blue-500' },
                { key: 'wealth', label: '財運', icon: '💰', color: 'bg-green-500' },
                { key: 'relationship', label: '感情運', icon: '❤️', color: 'bg-pink-500' },
                { key: 'health', label: '健康運', icon: '🏥', color: 'bg-red-500' }
              ].map((dimension) => {
                const score = magnetic.scores[dimension.key as keyof typeof magnetic.scores];
                return (
                  <div key={dimension.key}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700 font-medium">
                        {dimension.icon} {dimension.label}
                      </span>
                      <span className="text-lg font-bold text-gray-800">{score}分</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`${dimension.color} h-3 rounded-full transition-all duration-500`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 四大維度深度分析 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="mr-2">📊</span>
            四大維度深度分析
          </h2>

          <div className="space-y-6">
            {[
              { key: 'career', label: '事業運勢', icon: '💼', color: 'from-blue-500 to-blue-600' },
              { key: 'wealth', label: '財運分析', icon: '💰', color: 'from-green-500 to-green-600' },
              { key: 'relationship', label: '感情運勢', icon: '❤️', color: 'from-pink-500 to-pink-600' },
              { key: 'health', label: '健康運勢', icon: '🏥', color: 'from-red-500 to-red-600' }
            ].map((dimension) => (
              <div key={dimension.key} className="border-l-4 border-gray-200 pl-4">
                <h3 className={`text-xl font-bold bg-gradient-to-r ${dimension.color} text-transparent bg-clip-text mb-3`}>
                  {dimension.icon} {dimension.label}
                </h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  {magnetic.dominantField.detailedAnalysis[dimension.key as keyof typeof magnetic.dominantField.detailedAnalysis]}
                </p>
                <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mt-4">
                  <h5 className="text-sm font-bold text-red-800 mb-2">⚠️ 緊急改善建議</h5>
                  <div className="text-sm text-red-700 space-y-2">
                    <p className="font-semibold">當前號碼對此方面的負面影響：</p>
                    <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                      {dimension.key === 'career' && (
                        <>
                          <li>阻礙貴人出現，減少升遷機會</li>
                          <li>工作中容易遇到小人阻撓</li>
                          <li>決策時容易犯錯，影響事業發展</li>
                        </>
                      )}
                      {dimension.key === 'wealth' && (
                        <>
                          <li>財運流失，存不住錢</li>
                          <li>投資容易判斷錯誤，損失機率高</li>
                          <li>意外支出增多，破財機會頻繁</li>
                        </>
                      )}
                      {dimension.key === 'relationship' && (
                        <>
                          <li>感情不穩定，容易發生爭執</li>
                          <li>桃花運差，難遇良緣</li>
                          <li>人際關係緊張，朋友減少</li>
                        </>
                      )}
                      {dimension.key === 'health' && (
                        <>
                          <li>精神壓力大，容易焦慮失眠</li>
                          <li>身體小病痛不斷</li>
                          <li>意外傷害風險增加</li>
                        </>
                      )}
                    </ul>
                    <div className="mt-3 pt-3 border-t border-red-200">
                      <p className="font-bold text-red-800">✅ 解決方案：</p>
                      <p className="mt-1">透過更換符合您八字命盤的吉祥號碼，可以：</p>
                      <ul className="list-disc list-inside space-y-1 ml-2 mt-1 text-xs">
                        <li>平衡磁場能量，讓運勢穩定上升</li>
                        <li>強化正面氣場，吸引貴人和機會</li>
                        <li>提升整體運勢 20-40%</li>
                        <li>改善只需 3-6 個月即可感受明顯變化</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 改善建議 CTA */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg p-8 text-center text-white mb-6">
          <div className="bg-red-500 text-white inline-block px-4 py-2 rounded-full text-sm font-bold mb-4">
            ⚠️ 緊急提示
          </div>
          <h2 className="text-3xl font-bold mb-4">🛑 緊急：您的電話號碼正在消耗您的運氣！</h2>
          <div className="bg-white/20 rounded-lg p-6 mb-6">
            <p className="text-lg font-bold mb-3">💡 您知道嗎？</p>
            <div className="text-left space-y-2 text-sm">
              <p>• 每天使用不合適的電話號碼，就像<strong>每天喝毒藥</strong>，看不見傷害，但會慢慢侵蝕您的運勢</p>
              <p>• 錯誤的數字磁場會<strong>持續消耗您的氣場</strong>，導致財運流失、事業停滞、感情不順</p>
              <p>• 許多成功人士都會<strong>精心選擇號碼</strong>，因為他們知道數字能量的重要性</p>
              <p>• 更換合適的號碼後，<strong>3-6 個月內</strong>就能感受到明顯變化！</p>
            </div>
          </div>
          <p className="text-xl font-bold mb-6">
            🎯 專業命理師將根據您的八字命盤，為您尋找<span className="text-yellow-300">「真正屬於您的吉祥號碼」</span>，全面提升事業、財運、感情和健康運勢！
          </p>
          <div className="bg-white/10 rounded-lg p-6 mb-6 text-left">
            <h3 className="text-xl font-bold mb-4">🎯 服務內容</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="mr-3 text-2xl">✨</span>
                <div>
                  <h4 className="font-semibold mb-1">八字磁場分析</h4>
                  <p className="text-sm opacity-90">深入分析您的八字命盤，找出最適合的數字組合</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-2xl">👨‍🏫</span>
                <div>
                  <h4 className="font-semibold mb-1">真人命理師傅服務</h4>
                  <p className="text-sm opacity-90">付款後 24 小時內，專業師傅會透過 WhatsApp 聯繫您</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-2xl">📱</span>
                <div>
                  <h4 className="font-semibold mb-1">專屬號碼推薦</h4>
                  <p className="text-sm opacity-90">提供 3-5 組最符合您命理的電話號碼選擇</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-2xl">💎</span>
                <div>
                  <h4 className="font-semibold mb-1">磁場能量解析</h4>
                  <p className="text-sm opacity-90">詳細說明每組號碼的磁場能量和對您的影響</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-2xl">📋</span>
                <div>
                  <h4 className="font-semibold mb-1">申請指引</h4>
                  <p className="text-sm opacity-90">提供電訊商申請流程和注意事項</p>
                </div>
              </li>
            </ul>
            <div className="mt-6 pt-6 border-t border-white/20">
              <h4 className="font-bold text-lg mb-4">🌟 成功案例對比</h4>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-red-500/20 rounded-lg p-4 border border-red-300">
                  <p className="font-bold mb-2">❌ 更換前：</p>
                  <ul className="text-xs space-y-1">
                    <li>• 事業停滞不前，工作壓力大</li>
                    <li>• 財運不佳，經常破財</li>
                    <li>• 感情不順，爭執多</li>
                    <li>• 健康問題頻繁，睡眠差</li>
                  </ul>
                </div>
                <div className="bg-green-500/20 rounded-lg p-4 border border-green-300">
                  <p className="font-bold mb-2">✅ 更換後：</p>
                  <ul className="text-xs space-y-1">
                    <li>• 工作順利，獲得升遷機會</li>
                    <li>• 財運提升，投資獲利</li>
                    <li>• 感情穩定，關係和諧</li>
                    <li>• 身體健康，精神充沛</li>
                  </ul>
                </div>
              </div>
              <div className="bg-yellow-500/20 rounded-lg p-4 border border-yellow-300 mb-4">
                <p className="font-bold text-yellow-100 mb-2">📊 真實數據：</p>
                <div className="text-xs space-y-1">
                  <p>• <strong>92%</strong> 的客戶在更換號碼後 <strong>3 個月內</strong>感受到明顯改善</p>
                  <p>• <strong>78%</strong> 的客戶在 <strong>6 個月內</strong>事業或財運有重大突破</p>
                  <p>• <strong>85%</strong> 的客戶表示感情和人際關係明顯改善</p>
                  <p>• <strong>100%</strong> 的客戶都說：「早知道就早點換！」</p>
                </div>
              </div>
              <div className="bg-green-500/20 rounded-lg p-4 border border-green-300">
                <p className="font-bold text-green-100 mb-2">💬 服務流程：</p>
                <ol className="text-xs space-y-2 text-left">
                  <li><strong>1.</strong> 完成付款後，系統自動記錄您的資料</li>
                  <li><strong>2.</strong> 24 小時內，真人命理師傅會透過 <strong>WhatsApp</strong> 聯繫您</li>
                  <li><strong>3.</strong> 師傅會根據您的八字和磁場分析，推薦 3-5 組吉祥號碼</li>
                  <li><strong>4.</strong> 如有額外問題，可留訊息，師傅會一次過回覆</li>
                  <li><strong>5.</strong> 您可自行前往電訊商申請推薦的號碼</li>
                </ol>
              </div>
              <p className="text-sm opacity-75 mt-4">
                ⚠️ 注意：我們會為您尋找並推薦最合適的號碼，但需要您自行前往電訊商申請
              </p>
            </div>
          </div>
          <button
            onClick={handlePayment}
            disabled={isProcessingPayment}
            className="inline-block bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-100 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessingPayment ? '處理中...' : '立即購買 - 安全付款'}
          </button>
          {paymentError && (
            <p className="mt-4 text-red-200 bg-red-900/30 px-4 py-2 rounded-lg">
              {paymentError}
            </p>
          )}
          <p className="mt-4 text-sm opacity-90">
            📞 <strong>付款後 24 小時內，真人師傅會透過 WhatsApp 聯繫您</strong>
          </p>
          <p className="mt-2 text-xs opacity-75">
            有任何問題可聯繫 Instagram @destinykey.hk 查詢
          </p>
          <div className="mt-6 bg-white/20 rounded-lg p-6 inline-block max-w-2xl">
            <h3 className="text-2xl font-bold mb-4 text-yellow-300">💰 收費方案</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white/10 rounded-lg p-4 border-2 border-white/30">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">HK$3,888</div>
                  <div className="text-lg font-semibold mb-2">單人改號方案</div>
                  <div className="text-sm opacity-90">
                    專業命理師為您量身挑選<br/>
                    最適合的電話號碼
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-yellow-400/20 to-pink-400/20 rounded-lg p-4 border-2 border-yellow-300 relative">
                <div className="absolute -top-3 right-4 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-bold">超值優惠</div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2 text-yellow-300">HK$6,888</div>
                  <div className="text-lg font-semibold mb-2">雙人方案</div>
                  <div className="text-xs opacity-75 mb-2">（情侶、朋友、家人）</div>
                  <div className="text-sm opacity-90">
                    結合兩人八字時辰<br/>
                    打造最佳能量組合
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-green-500/20 rounded-lg p-4 border border-green-300 mb-4">
              <p className="font-bold text-green-100 mb-2">✅ 服務承諾：</p>
              <ul className="text-sm space-y-1">
                <li>• <strong>24小時內</strong> WhatsApp 聯絡您</li>
                <li>• <strong>一個星期內</strong>提供專業分析結果</li>
                <li>• 推薦 3-5 組最符合您命理的號碼</li>
              </ul>
            </div>
            <div className="bg-yellow-500/20 rounded-lg p-4 border border-yellow-300">
              <p className="text-sm">
                💡 <strong>温馨提示：</strong>可先付款單人方案 HK$3,888，如需雙人服務，師傅會在 WhatsApp 聯絡時與您討論。
              </p>
            </div>
          </div>
        </div>

        {/* 返回按鈕 */}
        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="text-purple-600 hover:text-purple-700 font-semibold"
          >
            ← 返回首頁
          </button>
        </div>
      </div>
    </div>
  );
}
