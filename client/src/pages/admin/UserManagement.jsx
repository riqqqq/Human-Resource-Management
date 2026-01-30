import { useState, useEffect } from 'react';
import api from '../../services/api';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await api.put(`/users/${userId}/approve`);
      fetchUsers();
    } catch (err) {
      console.error('Failed to approve user:', err);
    }
  };

  const handleReject = async (userId) => {
    try {
      await api.put(`/users/${userId}/reject`);
      fetchUsers();
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

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">User Management</h1>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Karyawan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">@{user.username}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {user.employee_name || '-'}
                  {user.nik && <span className="text-xs text-gray-400 ml-1">({user.nik})</span>}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    user.is_active 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.is_active ? 'Active' : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  {!user.is_active && (
                    <>
                      <button
                        onClick={() => handleApprove(user.id)}
                        className="text-green-600 hover:text-green-800 font-medium"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(user.id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {user.is_active && user.role !== 'admin' && (
                    <button
                      onClick={() => handleReject(user.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Deactivate
                    </button>
                  )}
                  {user.role !== 'admin' && (
                    <button
                      onClick={async () => {
                        if (confirm(`Are you sure you want to PERMANENTLY delete user ${user.username}? This cannot be undone.`)) {
                          try {
                            await api.delete(`/users/${user.id}`);
                            fetchUsers();
                          } catch (err) {
                            alert('Failed to delete user');
                          }
                        }
                      }}
                      className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg text-xs font-semibold ml-2"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserManagement;
