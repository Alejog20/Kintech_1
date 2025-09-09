import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminLayout = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated or not admin
  if (!isAuthenticated || !isAdmin) {
    navigate('/login'); // Redirect to login page
    return null; // Don't render anything
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-layout flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 text-2xl font-bold border-b border-gray-700">
          Admin Panel
        </div>
        <nav className="flex-grow">
          <ul className="space-y-2 p-4">
            <li>
              <Link to="/admin/dashboard" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin/properties" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
                Properties
              </Link>
            </li>
            {/* Add more admin links here */}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <Outlet /> {/* Renders child routes */}
      </main>
    </div>
  );
};

export default AdminLayout;
