import { useState, useEffect } from 'react';
import api from '../../services/api';

function EmployeeDashboard() {
  const [employee, setEmployee] = useState(null);
  const [attendance, setAttendance] = useState([]); // Kept for future stats if needed, or remove if unused. 
  // Actually, I'll remove 'attendance' state usage since history table is gone.
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchData();
  }, []);

  const getLocalDate = () => {
    return new Date().toLocaleDateString('en-CA');
  };

  const fetchData = async () => {
    try {
      if (user.employee_id) {
        const [empRes, attRes] = await Promise.all([
          api.get(`/employees/${user.employee_id}`),
          api.get(`/attendance/employee/${user.employee_id}`)
        ]);

        if (empRes.data.success) setEmployee(empRes.data.data);
        if (attRes.data.success) {
          // setAttendance(attRes.data.data); // Not showing list anymore
          // Check today's attendance using local date comparison
          const today = getLocalDate();
          const todayRecord = attRes.data.data.find(
            a => new Date(a.date).toLocaleDateString('en-CA') === today
          );
          setTodayAttendance(todayRecord);
        }
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const [photo, setPhoto] = useState(null);

  const handleClockIn = async () => {
    try {
      if (!photo) {
        alert('Mohon upload foto bukti absensi');
        return;
      }

      setLoading(true);
      const now = new Date();
      const localDate = getLocalDate();
      
      const formData = new FormData();
      formData.append('employee_id', user.employee_id);
      formData.append('date', localDate);
      formData.append('time_in', now.toTimeString().split(' ')[0].substring(0, 5));
      formData.append('photo', photo);

      await api.post('/attendance', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      await fetchData();
      setPhoto(null); // Clear photo after upload
    } catch (err) {
      console.error('Failed to clock in:', err);
      alert(err.response?.data?.message || 'Gagal melakukan absensi');
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    try {
      const now = new Date();
      const localDate = getLocalDate();
      await api.post('/attendance', {
        employee_id: user.employee_id,
        date: localDate,
        time_out: now.toTimeString().split(' ')[0].substring(0, 5)
      });
      fetchData();
    } catch (err) {
      console.error('Failed to clock out:', err);
    }
  };

  const formatTime = (time) => {
    if (!time) return '-';
    return time.substring(0, 5);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Logic Variables
  const isRejected = todayAttendance?.status === 'rejected';
  const isPending = todayAttendance?.status === 'pending';
  const isApproved = todayAttendance?.status === 'approved';
  
  const canClockIn = !todayAttendance || isRejected;
  // Can clock out ONLY if: has clocked in, APPROVED, and not yet clocked out
  const canClockOut = todayAttendance?.time_in && isApproved && !todayAttendance.time_out;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Karyawan</h1>

      {/* Employee Info Card */}
      {employee && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-tr from-green-400 to-teal-500 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg ring-4 ring-green-50">
              👤
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 tracking-tight">{employee.name}</h2>
              <p className="text-green-600 font-medium bg-green-50 inline-block px-3 py-1 rounded-full text-sm mt-1">{employee.position}</p>
              <p className="text-sm text-gray-400 mt-1 ml-1 flex items-center gap-1">
                <span className="opacity-50">🆔</span> NIK: {employee.nik}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Clock In/Out Card */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-700 rounded-3xl shadow-2xl p-8 mb-8 text-white relative overflow-hidden group">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>

        <div className="flex justify-between items-start mb-6 relative z-10">
          <div>
            <h2 className="text-xl font-bold tracking-wide">Absensi Hari Ini</h2>
            <p className="text-emerald-100 mt-1 font-medium">{formatDate(new Date())}</p>
          </div>
          {todayAttendance && (
            <span className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg backdrop-blur-md ${
              isApproved ? 'bg-green-400/30 text-white border border-green-200/30' :
              isRejected ? 'bg-red-400/30 text-white border border-red-200/30' :
              'bg-yellow-400/30 text-white border border-yellow-200/30'
            }`}>
              {todayAttendance.status || 'Pending'}
            </span>
          )}
        </div>
        
        {/* Status Messages */}
        {canClockIn && !isRejected && (
           <div className="mb-4 bg-white/20 p-3 rounded-lg text-sm">
             <p>📸 Silakan upload foto selfie/bukti kehadiran untuk Clock In.</p>
           </div>
        )}

        {isRejected && (
           <div className="mb-4 bg-red-500/80 p-3 rounded-lg text-sm font-semibold border border-red-300">
             <p>❌ Absensi ditolak. Silakan foto ulang dan Clock In kembali.</p>
           </div>
        )}

        {isPending && todayAttendance?.time_in && (
           <div className="mb-4 bg-yellow-500/80 p-3 rounded-lg text-sm font-semibold border border-yellow-300">
             <p>⏳ Absensi pending. Tunggu approval admin untuk bisa Clock Out.</p>
           </div>
        )}

        {todayAttendance?.time_in && !todayAttendance?.time_out && isApproved && (
           <div className="mb-4 bg-white/20 p-3 rounded-lg text-sm">
             <p>✅ Absensi diterima. Silakan Clock Out saat selesai bekerja.</p>
           </div>
        )}
        
        {todayAttendance?.time_out && (
           <div className="mb-4 bg-white/20 p-3 rounded-lg text-sm">
             <p>✅ Anda sudah selesai bekerja hari ini (Clock Out pukul {formatTime(todayAttendance.time_out)}).</p>
           </div>
        )}

        <div className="flex flex-col gap-3">
          {/* File Input - Show if can clock in */}
          {canClockIn && (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files[0])}
              className="block w-full text-sm text-green-100
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-white file:text-green-700
                hover:file:bg-green-100 mb-2"
            />
          )}

          <div className="flex gap-3">
            <button
              onClick={handleClockIn}
              disabled={!canClockIn || loading}
              className="flex-1 bg-white text-green-600 py-3 rounded-lg font-semibold hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && canClockIn ? 'Uploading...' : 'Clock In'}
            </button>
            <button
              onClick={handleClockOut}
              disabled={!canClockOut || loading}
              className="flex-1 bg-white text-green-600 py-3 rounded-lg font-semibold hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clock Out
            </button>
          </div>
        </div>
      </div>
      
      {/* Removed Recent Attendance Table */}
    </div>
  );
}

export default EmployeeDashboard;
