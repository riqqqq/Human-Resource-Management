import { useState, useEffect } from 'react';
import api from '../../services/api';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    absentToday: 0
  });
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, pendingRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/users/pending')
      ]);
      
      if (statsRes.data.success) setStats(statsRes.data.data);
      if (pendingRes.data.success) setPendingUsers(pendingRes.data.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await api.put(`/users/${userId}/approve`);
      fetchData();
    } catch (err) {
      console.error('Failed to approve user:', err);
    }
  };

  const handleReject = async (userId) => {
    if (!confirm('Yakin ingin menolak user ini?')) return;
    try {
      await api.put(`/users/${userId}/reject`);
      fetchData();
    } catch (err) {
      console.error('Failed to reject user:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Karyawan', value: stats.totalEmployees, icon: '👥', gradient: 'from-blue-500 to-indigo-600' },
    { title: 'Hadir Hari Ini', value: stats.presentToday, icon: '✅', gradient: 'from-emerald-400 to-green-600' },
    { title: 'Tidak Hadir', value: stats.absentToday, icon: '❌', gradient: 'from-rose-400 to-red-600' }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8 tracking-tight">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div key={index} className={`bg-gradient-to-br ${card.gradient} rounded-2xl shadow-lg p-6 text-white transform hover:scale-[1.02] transition-all duration-300 relative overflow-hidden`}>
            {/* Background Blob */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none"></div>
            
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-white/80 text-sm font-medium mb-1">{card.title}</p>
                <p className="text-4xl font-bold tracking-tight">{card.value}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl text-3xl shadow-inner border border-white/10">
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pending Approvals */}
      {pendingUsers.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
              {pendingUsers.length}
            </span>
            Pending Approval
          </h2>
          <div className="space-y-3">
            {pendingUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{user.employee_name || user.username}</p>
                  <p className="text-sm text-gray-500">
                    @{user.username} • NIK: {user.nik || '-'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(user.id)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(user.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pendingUsers.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <p className="text-gray-500 text-center">Tidak ada approval yang pending</p>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
