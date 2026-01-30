import { NavLink, Outlet, useNavigate } from 'react-router-dom';

function EmployeeLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { path: '/employee', label: 'Dashboard', icon: '📊' },
    { path: '/employee/history', label: 'Riwayat Absensi', icon: '📋' }
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-green-700 to-teal-800 text-white flex flex-col">
        <div className="p-6 border-b border-green-600">
          <h1 className="text-2xl font-bold">Mini HRM</h1>
          <p className="text-green-200 text-sm mt-1">Employee Portal</p>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/employee'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      isActive
                        ? 'bg-green-600 text-white'
                        : 'text-green-200 hover:bg-green-600 hover:text-white'
                    }`
                  }
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-green-600">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-lg">
              👤
            </div>
            <div>
              <p className="font-medium">{user.username || 'Employee'}</p>
              <p className="text-green-200 text-sm capitalize">{user.role || 'Karyawan'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-sm font-medium transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default EmployeeLayout;
