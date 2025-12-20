import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { trpc } from '../lib/trpc';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const verifyMutation = trpc.admin.verifyPassword.useMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await verifyMutation.mutateAsync({ password });
      
      if (result.success) {
        // 保存密碼到 sessionStorage
        sessionStorage.setItem('adminPassword', password);
        navigate('/admin/dashboard');
      } else {
        setError('密碼錯誤，請重試');
      }
    } catch (err) {
      setError('登入失敗，請重試');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">🔐 後台管理系統</h1>
          <p className="text-gray-300">命運之鑰 - 管理員登入</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
              管理員密碼
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="請輸入密碼"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-3 px-6 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '登入中...' : '登入'}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-400 text-sm">
          <p>⚠️ 僅限授權人員訪問</p>
        </div>
      </div>
    </div>
  );
}
