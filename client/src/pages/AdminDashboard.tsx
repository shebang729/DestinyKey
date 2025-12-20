import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { trpc } from '../lib/trpc';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | 'pending' | 'processing' | 'completed'>('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [notes, setNotes] = useState('');
  const [serviceStatus, setServiceStatus] = useState<'pending' | 'processing' | 'completed'>('pending');

  // 檢查是否已登入
  useEffect(() => {
    const savedPassword = sessionStorage.getItem('adminPassword');
    if (!savedPassword) {
      navigate('/admin');
      return;
    }
    setPassword(savedPassword);
  }, [navigate]);

  // 獲取統計數據
  const { data: stats, refetch: refetchStats } = trpc.admin.getStats.useQuery(
    { password },
    { enabled: !!password }
  );

  // 獲取訂單列表
  const { data: ordersData, refetch: refetchOrders } = trpc.admin.getOrders.useQuery(
    { password, page, pageSize: 20, search, status },
    { enabled: !!password }
  );

  // 更新訂單
  const updateMutation = trpc.admin.updateOrder.useMutation({
    onSuccess: () => {
      refetchOrders();
      refetchStats();
      setSelectedOrder(null);
      alert('訂單更新成功！');
    },
  });

  const handleLogout = () => {
    sessionStorage.removeItem('adminPassword');
    navigate('/admin');
  };

  const handleUpdateOrder = async () => {
    if (!selectedOrder) return;

    await updateMutation.mutateAsync({
      password,
      orderId: selectedOrder.id,
      serviceStatus,
      notes,
    });
  };

  const formatDate = (date: string | Date | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleString('zh-HK');
  };

  const formatCurrency = (amount: string | number | null) => {
    if (!amount) return '-';
    return `HK$${Number(amount).toLocaleString('zh-HK', { minimumFractionDigits: 2 })}`;
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
      processing: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
      completed: 'bg-green-500/20 text-green-300 border-green-500/50',
    };
    const labels = {
      pending: '待處理',
      processing: '處理中',
      completed: '已完成',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${badges[status as keyof typeof badges] || ''}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  if (!password) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">載入中...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black text-white">
      {/* 頂部導航 */}
      <nav className="bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-yellow-400">命運之鑰 - 後台管理</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg transition-colors"
          >
            登出
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 統計卡片 */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <p className="text-gray-300 text-sm mb-2">總訂單</p>
              <p className="text-3xl font-bold text-yellow-400">{stats.totalOrders}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <p className="text-gray-300 text-sm mb-2">待處理</p>
              <p className="text-3xl font-bold text-yellow-400">{stats.pendingOrders}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <p className="text-gray-300 text-sm mb-2">處理中</p>
              <p className="text-3xl font-bold text-blue-400">{stats.processingOrders}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <p className="text-gray-300 text-sm mb-2">已完成</p>
              <p className="text-3xl font-bold text-green-400">{stats.completedOrders}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 md:col-span-2">
              <p className="text-gray-300 text-sm mb-2">總收入</p>
              <p className="text-3xl font-bold text-yellow-400">{formatCurrency(stats.totalRevenue)}</p>
            </div>
          </div>
        )}

        {/* 搜尋和篩選 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">搜尋</label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="姓名、電話、Email"
                className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">狀態篩選</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="all">全部</option>
                <option value="pending">待處理</option>
                <option value="processing">處理中</option>
                <option value="completed">已完成</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearch('');
                  setStatus('all');
                  setPage(1);
                }}
                className="w-full px-4 py-2 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/50 rounded-lg transition-colors"
              >
                重置篩選
              </button>
            </div>
          </div>
        </div>

        {/* 訂單列表 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">訂單 ID</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">客戶姓名</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">電話號碼</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">金額</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">狀態</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">建立時間</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {ordersData?.orders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-yellow-400">#{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{order.customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{order.phoneNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{order.customerEmail || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{formatCurrency(order.amountTotal)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{getStatusBadge(order.serviceStatus)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{formatDate(order.createdAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setNotes(order.notes || '');
                          setServiceStatus(order.serviceStatus);
                        }}
                        className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded-lg transition-colors"
                      >
                        查看詳情
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 分頁 */}
          {ordersData && ordersData.totalPages > 1 && (
            <div className="bg-white/5 px-6 py-4 flex items-center justify-between border-t border-white/10">
              <div className="text-sm text-gray-300">
                第 {page} 頁，共 {ordersData.totalPages} 頁（總共 {ordersData.total} 筆）
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  上一頁
                </button>
                <button
                  onClick={() => setPage(p => Math.min(ordersData.totalPages, p + 1))}
                  disabled={page === ordersData.totalPages}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  下一頁
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 訂單詳情彈窗 */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-yellow-400">訂單詳情 #{selectedOrder.id}</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                {/* 客戶資料 */}
                <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-3">客戶資料</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-400">姓名</p>
                      <p className="text-white font-medium">{selectedOrder.customerName}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">電話號碼</p>
                      <p className="text-white font-medium">{selectedOrder.phoneNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Email</p>
                      <p className="text-white font-medium">{selectedOrder.customerEmail || '-'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">出生日期</p>
                      <p className="text-white font-medium">{selectedOrder.birthDate || '-'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">出生時間</p>
                      <p className="text-white font-medium">{selectedOrder.birthTime || '-'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">身份證後4碼</p>
                      <p className="text-white font-medium">{selectedOrder.idLastFour || '-'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-400">目標</p>
                      <p className="text-white font-medium">{selectedOrder.goals || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* 付款資料 */}
                <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-3">付款資料</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-400">金額</p>
                      <p className="text-white font-medium">{formatCurrency(selectedOrder.amountTotal)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">付款狀態</p>
                      <p className="text-white font-medium">{selectedOrder.stripePaymentStatus}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-400">Stripe Session ID</p>
                      <p className="text-white font-medium text-xs break-all">{selectedOrder.stripeSessionId}</p>
                    </div>
                  </div>
                </div>

                {/* 服務狀態 */}
                <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-3">服務狀態</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">狀態</label>
                      <select
                        value={serviceStatus}
                        onChange={(e) => setServiceStatus(e.target.value as any)}
                        className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      >
                        <option value="pending">待處理</option>
                        <option value="processing">處理中</option>
                        <option value="completed">已完成</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">備註</label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        placeholder="輸入備註..."
                      />
                    </div>
                  </div>
                </div>

                {/* 時間資料 */}
                <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-3">時間記錄</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-400">建立時間</p>
                      <p className="text-white font-medium">{formatDate(selectedOrder.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">更新時間</p>
                      <p className="text-white font-medium">{formatDate(selectedOrder.updatedAt)}</p>
                    </div>
                    {selectedOrder.completedAt && (
                      <div className="col-span-2">
                        <p className="text-gray-400">完成時間</p>
                        <p className="text-white font-medium">{formatDate(selectedOrder.completedAt)}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 操作按鈕 */}
                <div className="flex gap-3">
                  <button
                    onClick={handleUpdateOrder}
                    disabled={updateMutation.isLoading}
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-3 px-6 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 disabled:opacity-50"
                  >
                    {updateMutation.isLoading ? '更新中...' : '保存更新'}
                  </button>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="px-6 py-3 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/50 rounded-lg transition-colors"
                  >
                    取消
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
