import { useState, useEffect } from 'react';
import api from '../services/api';

function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    const offset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - offset).toISOString().split('T')[0];
  });
  const [formData, setFormData] = useState({
    employee_id: '',
    date: new Date().toISOString().split('T')[0],
    time_in: '',
    time_out: ''
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [selectedDate]);

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/employees');
      if (response.data.success) {
        setEmployees(response.data.data.filter(e => e.status === 'active'));
      }
    } catch (err) {
      setError('Failed to load employees');
    }
  };

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/attendance?date=${selectedDate}`);
      if (response.data.success) {
        setAttendanceList(response.data.data);
      }
    } catch (err) {
      setError('Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.employee_id) {
      setError('Pilih karyawan terlebih dahulu');
      return;
    }

    if (!formData.time_in && !formData.time_out) {
      setError('Isi jam masuk atau jam keluar');
      return;
    }

    try {
      await api.post('/attendance', formData);
      setSuccess('Absensi berhasil dicatat');
      setFormData({
        employee_id: '',
        date: selectedDate,
        time_in: '',
        time_out: ''
      });
      fetchAttendance();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record attendance');
    }
  };

  const formatTime = (time) => {
    if (!time) return '-';
    return time.substring(0, 5);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Absensi</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
          {success}
        </div>
      )}

      {/* Input Form */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Input Absensi</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Karyawan</label>
            <select
              value={formData.employee_id}
              onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Pilih Karyawan</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.nik})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jam Masuk</label>
            <input
              type="time"
              value={formData.time_in}
              onChange={(e) => setFormData({ ...formData, time_in: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jam Keluar</label>
            <input
              type="time"
              value={formData.time_out}
              onChange={(e) => setFormData({ ...formData, time_out: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>

      {/* Attendance List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Daftar Absensi</h2>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Karyawan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Foto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {attendanceList.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    Belum ada data absensi untuk tanggal ini
                  </td>
                </tr>
              ) : (
                attendanceList.map((att) => (
                  <tr key={att.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{att.employee_name}</div>
                      <div className="text-sm text-gray-500">{att.nik}</div>
                      <div className="text-xs text-gray-400">{att.position}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">In: {formatTime(att.time_in)}</div>
                      <div className="text-sm text-gray-500">Out: {formatTime(att.time_out)}</div>
                    </td>
                    <td className="px-6 py-4">
                      {att.image_path ? (
                        <a href={`http://localhost:5000${att.image_path}`} target="_blank" rel="noopener noreferrer">
                          <img 
                            src={`http://localhost:5000${att.image_path}`} 
                            alt="Bukti" 
                            className="h-16 w-16 object-cover rounded-lg border border-gray-200 hover:scale-150 transition"
                          />
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">No Image</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        att.status === 'approved' ? 'bg-green-100 text-green-800' :
                        att.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {att.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-x-2">
                       {att.status !== 'approved' && (
                        <button
                          onClick={async () => {
                            try {
                              await api.put(`/attendance/${att.id}/status`, { status: 'approved' });
                              fetchAttendance();
                            } catch (err) {
                              alert('Failed to approve');
                            }
                          }}
                          className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
                        >
                          Approve
                        </button>
                      )}
                      
                      {att.status !== 'rejected' && (
                        <button
                          onClick={async () => {
                            if (!confirm('Reject attendance?')) return;
                            try {
                              await api.put(`/attendance/${att.id}/status`, { status: 'rejected' });
                              fetchAttendance();
                            } catch (err) {
                              alert('Failed to reject');
                            }
                          }}
                          className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                        >
                          Reject
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Attendance;
