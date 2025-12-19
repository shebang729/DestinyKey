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
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6">
              <h3 className="text-lg font-bold text-blue-900 mb-3">📞 下一步</h3>
              <ol className="space-y-2 text-blue-800">
                <li className="flex items-start">
                  <span className="font-bold mr-2">1.</span>
                  <span>我們的命理師將在 <strong>24 小時內</strong>透過 Instagram 聯繫您</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">2.</span>
                  <span>請確保您已關注 <strong>@destinykey.hk</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">3.</span>
                  <span>我們會根據您的八字和磁場分析，為您推薦 <strong>3-5 個最佳號碼</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">4.</span>
                  <span>您可以自行前往電訊商申請推薦的號碼</span>
                </li>
              </ol>
            </div>

            {/* Instagram 連結 */}
            <div className="text-center mb-6">
              <a
                href="https://www.instagram.com/destinykey.hk"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
              >
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                前往 Instagram @destinykey.hk
              </a>
            </div>

            {/* 客服資訊 */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">💬 需要協助？</h3>
              <p className="text-gray-600 mb-3">
                如有任何問題，請透過以下方式聯繫我們：
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="mr-2">📱</span>
                  <span>Instagram DM: @destinykey.hk</span>
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
