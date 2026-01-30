import { useState, useEffect } from 'react';
import api from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    absentToday: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      setError('Failed to load dashboard stats');
    } finally {
      setLoading(false);
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
    {
      title: 'Total Karyawan',
      value: stats.totalEmployees,
      icon: '👥',
      color: 'bg-blue-500'
    },
    {
      title: 'Hadir Hari Ini',
      value: stats.presentToday,
      icon: '✅',
      color: 'bg-green-500'
    },
    {
      title: 'Tidak Hadir',
      value: stats.absentToday,
      icon: '❌',
      color: 'bg-red-500'
    }
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">{card.title}</p>
                <p className="text-4xl font-bold text-gray-800 mt-2">{card.value}</p>
              </div>
              <div className={`${card.color} text-white text-3xl p-4 rounded-full`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Selamat Datang di Mini HRM</h2>
        <p className="text-gray-600">
          Sistem manajemen karyawan dan absensi sederhana. Gunakan menu di sidebar untuk
          mengelola data karyawan dan mencatat absensi.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
