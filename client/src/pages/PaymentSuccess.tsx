import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      navigate('/');
    }
  }, [sessionId, navigate]);

  if (!sessionId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {isLoading ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">驗證付款中...</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* 成功圖標 */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                付款成功！🎉
              </h1>
              <p className="text-gray-600">
                感謝您的購買，我們已收到您的付款
              </p>
            </div>

            {/* 訂單詳情 */}
            <div className="bg-purple-50 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">訂單詳情</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">服務項目：</span>
                  <span className="font-semibold">尋找最合適電話號碼</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="text-gray-600">付款金額：</span>
                  <span className="text-2xl font-bold text-purple-600">
                    HK$3,888.00
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>訂單編號：</span>
                  <span className="font-mono">{sessionId.substring(0, 20)}...</span>
                </div>
              </div>
            </div>

            {/* 下一步指引 */}
            <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-6">
              <h3 className="text-lg font-bold text-green-900 mb-3">👨‍🏫 真人師傅服務</h3>
              <div className="bg-white rounded-lg p-4 mb-4 border-2 border-green-300">
                <p className="text-green-900 font-bold text-lg mb-2">
                  📞 24 小時內，專業命理師傅會透過 <span className="text-green-600">WhatsApp</span> 聯繫您！
                </p>
                <p className="text-sm text-green-800">
                  請保持電話畅通，師傅會主動聯繫您的購買時留下的電話號碼。
                </p>
              </div>
              <ol className="space-y-3 text-green-900">
                <li className="flex items-start">
                  <span className="font-bold mr-2 text-green-600">1.</span>
                  <div>
                    <strong>師傅會透過 WhatsApp 聯繫您</strong>
                    <p className="text-sm text-green-700 mt-1">並根據您的八字和磁場分析，推薦 3-5 組吉祥號碼</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2 text-green-600">2.</span>
                  <div>
                    <strong>如有額外問題或特殊需求</strong>
                    <p className="text-sm text-green-700 mt-1">可在 WhatsApp 對話中留訊息，師傅會於 24 小時內一次過回覆</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2 text-green-600">3.</span>
                  <div>
                    <strong>獲得推薦後</strong>
                    <p className="text-sm text-green-700 mt-1">您可自行前往電訊商（中國移動、數碼通、3香港等）申請推薦的號碼</p>
                  </div>
                </li>
              </ol>
            </div>
            
            {/* 重要提醒 */}
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-6">
              <h3 className="text-lg font-bold text-yellow-900 mb-3">⚠️ 重要提醒</h3>
              <ul className="space-y-2 text-yellow-800 text-sm">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>請確保您的 WhatsApp 可以接收陌生人訊息</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>如 24 小時內未收到訊息，請聯繫 Instagram @destinykey.hk</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>建議提前準備好任何想問的問題，師傅會一次過解答</span>
                </li>
              </ul>
            </div>



            {/* 客服資訊 */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">💬 需要協助？</h3>
              <p className="text-gray-600 mb-3">
                如有任何緊急問題，可聯繫：
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="mr-2">📞</span>
                  <span><strong>主要：</strong>師傅會透過 WhatsApp 聯繫您（24 小時內）</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">📱</span>
                  <span><strong>備用：</strong>Instagram DM @destinykey.hk</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">⏰</span>
                  <span>回覆時間: 每日 10:00 - 22:00</span>
                </li>
              </ul>
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
        )}
      </div>
    </div>
  );
}
