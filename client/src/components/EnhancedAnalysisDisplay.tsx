import React from 'react';

interface EnhancedAnalysisProps {
  bazi: any;
  currentNumberAnalysis: any;
  recommendedNumbers: any[];
}

export default function EnhancedAnalysisDisplay({
  bazi,
  currentNumberAnalysis,
  recommendedNumbers
}: EnhancedAnalysisProps) {
  // 五行顏色映射
  const elementColors: Record<string, string> = {
    '木': 'text-green-600 bg-green-100',
    '火': 'text-red-600 bg-red-100',
    '土': 'text-yellow-600 bg-yellow-100',
    '金': 'text-gray-600 bg-gray-100',
    '水': 'text-blue-600 bg-blue-100'
  };

  // 日主強弱文字
  const strengthText: Record<string, string> = {
    'strong': '身旺',
    'weak': '身弱',
    'balanced': '平衡'
  };

  // 日主強弱顏色
  const strengthColors: Record<string, string> = {
    'strong': 'bg-red-100 text-red-800',
    'weak': 'bg-blue-100 text-blue-800',
    'balanced': 'bg-green-100 text-green-800'
  };

  return (
    <div className="space-y-6">
      {/* 八字命盤增強版 */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">🔮</span>
          八字命盤詳解
        </h2>

        {/* 四柱展示 */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: '年柱', data: bazi.fourPillars.year },
            { label: '月柱', data: bazi.fourPillars.month },
            { label: '日柱', data: bazi.fourPillars.day },
            { label: '時柱', data: bazi.fourPillars.hour }
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
                <div className={`inline-block px-2 py-1 rounded text-sm font-semibold ${elementColors[pillar.data.element]}`}>
                  {pillar.data.element}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {pillar.data.yinYang}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 生肖和日主強弱 */}
        <div className="flex justify-center gap-4 mb-6">
          <span className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-lg font-semibold">
            生肖：{bazi.zodiac}
          </span>
          <span className={`inline-block px-6 py-2 rounded-full text-lg font-semibold ${strengthColors[bazi.dayMasterStrength]}`}>
            日主：{strengthText[bazi.dayMasterStrength]}
          </span>
        </div>

        {/* 五行分佈 */}
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
              const total = Object.values(bazi.fiveElements).reduce((sum: number, v: any) => sum + v, 0);
              const percentage = Math.round(((value as number) / total) * 100);
              
              return (
                <div key={key} className="text-center">
                  <div className={`inline-block px-3 py-2 rounded-lg text-2xl font-bold ${elementColors[name]}`}>
                    {name}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{value}個</div>
                  <div className="text-xs text-gray-500">{percentage}%</div>
                  {/* 進度條 */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className={`h-2 rounded-full ${elementColors[name].replace('text', 'bg').replace('bg-', 'bg-').replace('-100', '-500')}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 用神喜忌 */}
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2 flex items-center">
              <span className="mr-2">✨</span>
              用神（最需要）
            </h4>
            <div className="flex flex-wrap gap-2">
              {bazi.usefulGod.map((god: string, index: number) => (
                <span key={index} className={`px-3 py-1 rounded-full text-sm font-semibold ${elementColors[god]}`}>
                  {god}
                </span>
              ))}
            </div>
          </div>
          
          {bazi.joyfulGod.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                <span className="mr-2">💫</span>
                喜神（有幫助）
              </h4>
              <div className="flex flex-wrap gap-2">
                {bazi.joyfulGod.map((god: string, index: number) => (
                  <span key={index} className={`px-3 py-1 rounded-full text-sm font-semibold ${elementColors[god]}`}>
                    {god}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="bg-red-50 rounded-lg p-4">
            <h4 className="font-semibold text-red-800 mb-2 flex items-center">
              <span className="mr-2">⚠️</span>
              忌神（需避免）
            </h4>
            <div className="flex flex-wrap gap-2">
              {bazi.tabooGod.map((god: string, index: number) => (
                <span key={index} className={`px-3 py-1 rounded-full text-sm font-semibold ${elementColors[god]}`}>
                  {god}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 詳細分析 */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">命格詳解</h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {bazi.detailedAnalysis}
          </p>
        </div>

        {/* 十神分析 */}
        {bazi.tenGodsAnalysis.dominant.length > 0 && (
          <div className="bg-yellow-50 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3">
              <span className="mr-2">🎯</span>
              十神分析
            </h3>
            <div className="mb-3">
              <span className="text-sm text-yellow-700">主導十神：</span>
              {bazi.tenGodsAnalysis.dominant.map((god: string, index: number) => (
                <span key={index} className="ml-2 px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm font-semibold">
                  {god}
                </span>
              ))}
            </div>
            <p className="text-sm text-yellow-700 leading-relaxed">
              {bazi.tenGodsAnalysis.analysis}
            </p>
          </div>
        )}

        {/* 神煞分析 */}
        {(bazi.spiritsAnalysis.lucky.length > 0 || bazi.spiritsAnalysis.unlucky.length > 0) && (
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            {bazi.spiritsAnalysis.lucky.length > 0 && (
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">🌟 吉神</h4>
                <ul className="space-y-2">
                  {bazi.spiritsAnalysis.lucky.map((spirit: string, index: number) => (
                    <li key={index} className="text-sm text-green-700">{spirit}</li>
                  ))}
                </ul>
              </div>
            )}
            {bazi.spiritsAnalysis.unlucky.length > 0 && (
              <div className="bg-red-50 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-2">⚡ 凶神</h4>
                <ul className="space-y-2">
                  {bazi.spiritsAnalysis.unlucky.map((spirit: string, index: number) => (
                    <li key={index} className="text-sm text-red-700">{spirit}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* 優勢與不足 */}
        <div className="grid md:grid-cols-2 gap-4">
          {bazi.strengths.length > 0 && (
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">✨ 命格優勢</h4>
              <ul className="space-y-1">
                {bazi.strengths.map((strength: string, index: number) => (
                  <li key={index} className="text-sm text-green-700">• {strength}</li>
                ))}
              </ul>
            </div>
          )}
          {bazi.weaknesses.length > 0 && (
            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">💡 需要補強</h4>
              <ul className="space-y-1">
                {bazi.weaknesses.map((weakness: string, index: number) => (
                  <li key={index} className="text-sm text-yellow-700">• {weakness}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* 現有號碼分析 */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">📱</span>
          您的號碼分析
        </h2>

        {/* 綜合評分 */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">綜合評分</h3>
              <p className="text-gray-600">號碼與您命格的契合度</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-purple-600">{currentNumberAnalysis.score}</div>
              <div className="text-sm text-gray-600">分 / 100分</div>
            </div>
          </div>
        </div>

        {/* 磁場分析 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">磁場能量分佈</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-600">
                {currentNumberAnalysis.magneticAnalysis.luckyPercentage.toFixed(0)}%
              </div>
              <div className="text-sm text-green-700">吉星磁場</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {currentNumberAnalysis.magneticAnalysis.neutralPercentage.toFixed(0)}%
              </div>
              <div className="text-sm text-yellow-700">中性磁場</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-red-600">
                {currentNumberAnalysis.magneticAnalysis.unluckyPercentage.toFixed(0)}%
              </div>
              <div className="text-sm text-red-700">凶星磁場</div>
            </div>
          </div>
        </div>

        {/* 五行配合度 */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">五行配合度分析</h3>
          <div className="mb-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-blue-700">配合度</span>
              <span className="text-lg font-bold text-blue-800">
                {currentNumberAnalysis.fiveElementsAnalysis.matchScore}分
              </span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${currentNumberAnalysis.fiveElementsAnalysis.matchScore}%` }}
              ></div>
            </div>
          </div>
          <p className="text-sm text-blue-700 leading-relaxed">
            {currentNumberAnalysis.fiveElementsAnalysis.analysis}
          </p>
        </div>

        {/* 改號建議 */}
        {currentNumberAnalysis.recommendations.length > 0 && (
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3">
              <span className="mr-2">💡</span>
              專業建議
            </h3>
            <ul className="space-y-2">
              {currentNumberAnalysis.recommendations.map((rec: string, index: number) => (
                <li key={index} className="text-sm text-yellow-700 flex items-start">
                  <span className="mr-2">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 推薦號碼 */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">🎁</span>
          為您量身推薦的號碼
        </h2>

        <div className="space-y-4">
          {recommendedNumbers.map((rec: any, index: number) => (
            <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border-2 border-purple-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-sm text-gray-600">推薦號碼 {index + 1}</span>
                  <div className="text-3xl font-bold text-purple-600 tracking-wider">
                    {rec.number}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600">{rec.score}</div>
                  <div className="text-sm text-gray-600">綜合評分</div>
                </div>
              </div>

              {/* 磁場和五行分析 */}
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">磁場能量</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">吉星：</span>
                      <span className="font-semibold text-green-600">
                        {rec.magneticAnalysis.luckyPercentage.toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">中性：</span>
                      <span className="font-semibold text-yellow-600">
                        {rec.magneticAnalysis.neutralPercentage.toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">凶星：</span>
                      <span className="font-semibold text-red-600">
                        {rec.magneticAnalysis.unluckyPercentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">五行配合</h4>
                  <div className="space-y-1 text-xs">
                    {Object.entries(rec.fiveElementsAnalysis.distribution).map(([element, count]: [string, any]) => (
                      <div key={element} className="flex justify-between">
                        <span className={`font-semibold ${elementColors[element].split(' ')[0]}`}>
                          {element}：
                        </span>
                        <span className="text-gray-600">{count}個</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 詳細原因 */}
              <div className="bg-white rounded-lg p-4 mb-3">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">推薦理由</h4>
                <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                  {rec.detailedReason}
                </p>
              </div>

              {/* 優勢和警告 */}
              {(rec.strengths.length > 0 || rec.warnings.length > 0) && (
                <div className="grid md:grid-cols-2 gap-3">
                  {rec.strengths.length > 0 && (
                    <div className="bg-green-50 rounded-lg p-3">
                      <h4 className="text-xs font-semibold text-green-800 mb-2">✨ 主要優勢</h4>
                      <ul className="space-y-1">
                        {rec.strengths.map((strength: string, i: number) => (
                          <li key={i} className="text-xs text-green-700">• {strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {rec.warnings.length > 0 && (
                    <div className="bg-yellow-50 rounded-lg p-3">
                      <h4 className="text-xs font-semibold text-yellow-800 mb-2">⚠️ 注意事項</h4>
                      <ul className="space-y-1">
                        {rec.warnings.map((warning: string, i: number) => (
                          <li key={i} className="text-xs text-yellow-700">• {warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
