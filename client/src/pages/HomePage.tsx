import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { trpc } from "../lib/trpc";

export default function HomePage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();

  const detailedAnalysisMutation = trpc.analysis.detailedAnalysis.useMutation();

  const handleAnalyze = async () => {
    if (!fullName || !birthDate || !birthTime || !phoneNumber) {
      alert("請填寫所有必填欄位");
      return;
    }
    
    if (phoneNumber.length < 8) {
      alert("請輸入至少8位數字的電話號碼");
      return;
    }

    setIsAnalyzing(true);
    try {
      // 組合出生日期和時間
      const birthDateTime = `${birthDate}T${birthTime}:00`;
      
      const result = await detailedAnalysisMutation.mutateAsync({
        name: fullName,
        birthDate: birthDateTime,
        phoneNumber
      });
      
      // 導航到結果頁面，並傳遞結果數據
      navigate("/result", { state: { result } });
    } catch (error) {
      console.error("分析失敗:", error);
      alert("分析失敗，請稍後再試");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleInstagramClick = () => {
    window.open('https://www.instagram.com/destinykey.hk', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            命運之鑰
          </h1>
          <p className="text-xl text-gray-600 mb-2">Destiny Key App</p>
          <p className="text-lg text-gray-500 mb-4">八星磁場數字能量學 · 專業號碼分析</p>
          
          <div className="flex items-center justify-center gap-2 text-purple-600 mb-4">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span className="font-semibold">@destinykey.hk</span>
          </div>
          
          <button 
            onClick={handleInstagramClick}
            className="border border-purple-500 text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-lg inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            關注我們的 Instagram
          </button>
        </div>

        {/* Main Analysis Card */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="bg-white rounded-lg shadow-xl border-2 border-purple-100 p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">免費號碼能量分析</h2>
              <p className="text-gray-600 mt-2">輸入您的資訊，立即獲得專業分析</p>
            </div>
            
            <div className="space-y-6">
              {/* 中文全名 */}
              <div className="space-y-2">
                <label className="block text-base font-medium">中文全名（選填）</label>
                <input
                  type="text"
                  placeholder="例如：張三"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-lg h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* 出生日期和時間 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-base font-medium">出生年月日（選填）</label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full text-lg h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-base font-medium">出生時間（選填）</label>
                  <input
                    type="time"
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                    className="w-full text-lg h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* 電話號碼 */}
              <div className="space-y-2">
                <label className="block text-base font-medium">
                  電話號碼 <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="例如：12345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-2xl h-14 px-4 border border-gray-300 rounded-lg text-center font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-purple-500"
                  maxLength={20}
                />
                <p className="text-sm text-gray-500 text-center">
                  支援 8-20 位數字，可包含區號
                </p>
                <p className="text-xs text-green-600 text-center mt-1 font-semibold">
                  🔒 您的私人資料我們不會留底，僅用於即時分析
                </p>
              </div>

              {/* 提示框 */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800 flex items-start gap-2 mb-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <span>
                    提供完整八字資訊，AI 將結合您的命理特質進行更精準的號碼能量分析
                  </span>
                </p>
                <p className="text-xs text-green-700 flex items-center gap-1 ml-6">
                  🔒 隱私保證：您的個人資料和八字資訊僅用於分析，不會儲存或外洩
                </p>
              </div>

              {/* 分析按鈕 */}
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !phoneNumber}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    分析中...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    開始免費分析
                  </>
                )}
              </button>

              <p className="text-sm text-gray-500 text-center">
                免費版提供基礎評分，想了解更多？
                <button 
                  onClick={handleInstagramClick}
                  className="text-purple-600 hover:underline ml-1"
                >
                  DM 我們的 Instagram
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-sm text-gray-500">
          <p>© 2024 命運之鑰 Destiny Key App. All rights reserved.</p>
          <p className="mt-2">
            本服務僅供參考，不構成任何保證或承諾。請理性看待命理分析結果。
          </p>
          <p className="mt-1 text-green-600 font-semibold">
            🔒 您的個人資訊和八字資料僅用於即時分析，不會儲存或留底，絕對保密
          </p>
        </div>
      </div>
    </div>
  );
}
