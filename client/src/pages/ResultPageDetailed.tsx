import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { trpc } from '../utils/trpc';
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

  const createCheckoutSession = trpc.payment.createCheckoutSession.useMutation();

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
      const response = await createCheckoutSession.mutateAsync({
        name: result.name,
        phoneNumber: result.phoneNumber,
      });

      // 跳轉到 Stripe Checkout 頁面
      if (response.url) {
        window.location.href = response.url;
      }
    } catch (error: any) {
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

          {/* 四大維度評分 */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">綜合運勢評分</h3>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
              <p className="text-sm text-yellow-800">
                ⚠️ <strong>重要提示：</strong>您的電話號碼磁場能量未達理想水平，可能影響各方面運勢發展。建議考慮更換更合適的號碼組合。
              </p>
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
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
                  <p className="text-sm text-red-700">
                    ⚠️ <strong>改善建議：</strong>透過更換符合您八字的電話號碼，可有效提升此方面的運勢能量。
                  </p>
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
          <h2 className="text-3xl font-bold mb-4">📞 您的電話號碼急需優化！</h2>
          <p className="text-lg mb-6 opacity-90">
            根據分析結果，您的電話號碼磁場能量不佳，正在阻礙您的運勢發展。專業命理師將根據您的八字，為您尋找最佳的電話號碼組合，全面提升事業、財運、感情和健康運勢！
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
                <span className="mr-3 text-2xl">🔢</span>
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
              <p className="text-sm opacity-75">
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
          <p className="mt-4 text-sm opacity-80">
            或聯繫 Instagram @destinykey.hk 查詢
          </p>
          <div className="mt-6 bg-white/20 rounded-lg p-4 inline-block">
            <p className="text-sm mb-2">原價 <span className="line-through">HK$5,888</span></p>
            <p className="text-3xl font-bold mb-1">
              現價 HK$3,888
            </p>
            <p className="text-sm opacity-90">
              改變號碼，改變命運！投資您的未來
            </p>
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
