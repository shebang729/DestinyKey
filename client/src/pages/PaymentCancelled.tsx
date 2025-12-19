import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PaymentCancelled() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* 取消圖標 */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-4">
              <svg className="w-12 h-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              付款已取消
            </h1>
            <p className="text-gray-600">
              您已取消付款流程，沒有任何費用產生
            </p>
          </div>

          {/* 提示訊息 */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6">
            <h3 className="text-lg font-bold text-blue-900 mb-2">💡 溫馨提示</h3>
            <p className="text-blue-800">
              如果您在付款過程中遇到任何問題，或對服務有任何疑問，歡迎透過 Instagram 聯繫我們，我們很樂意為您解答！
            </p>
          </div>

          {/* 服務優勢 */}
          <div className="bg-purple-50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">🌟 為什麼選擇我們？</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>專業命理師根據您的八字精準分析</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>結合八星磁場數字能量學</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>推薦 3-5 個最適合您的號碼</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>24 小時內快速回覆</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                <span>原價 HK$5,888，現價只需 HK$3,888</span>
              </li>
            </ul>
          </div>

          {/* 行動按鈕 */}
          <div className="space-y-4">
            <button
              onClick={() => navigate(-1)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
            >
              返回並重新購買
            </button>
            
            <a
              href="https://www.instagram.com/destinykey.hk"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-white border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-full text-lg font-bold hover:bg-purple-50 transition-all text-center"
            >
              聯繫 Instagram 客服
            </a>

            <button
              onClick={() => navigate('/')}
              className="w-full text-gray-600 hover:text-gray-800 font-semibold py-2"
            >
              返回首頁
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
