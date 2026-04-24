import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Role } from '../utils/constants';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-10">
        <Link to="/" className="flex items-center group">
          <div className="bg-blue-600 p-1.5 rounded-lg mr-2 shadow-lg shadow-blue-600/20">
            <Shield className="text-white w-5 h-5" />
          </div>
          <span className="font-black text-xl tracking-tighter text-gray-900 group-hover:text-blue-600 transition-colors">CyNapse</span>
        </Link>
        <div className="flex items-center space-x-1">
          <Link to="/" className="px-3 py-2 rounded-lg text-sm font-bold text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all">Home</Link>
          <Link to="/news" className="px-3 py-2 rounded-lg text-sm font-bold text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all">News</Link>
          {user && (
            <>
              <Link to="/monitoring" className="px-3 py-2 rounded-lg text-sm font-bold text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all">Monitoring</Link>
              <Link to="/all-devices" className="px-3 py-2 rounded-lg text-sm font-bold text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all">All Devices</Link>
              <Link to="/find-room" className="px-3 py-2 rounded-lg text-sm font-bold text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all">Find Room</Link>
              <Link to="/users" className="px-3 py-2 rounded-lg text-sm font-bold text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all">Users</Link>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-6">
        {user ? (
          <div className="flex items-center space-x-4">
            <Link to="/profile" className="flex items-center space-x-2 group">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-xs border border-blue-200">
                {user.username[0].toUpperCase()}
              </div>
              <span className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors">{user.username}</span>
            </Link>
            {user.role === Role.ADMIN && (
              <Link 
                to="/admin" 
                className="bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-gray-900/10"
              >
                Admin
              </Link>
            )}
            <button 
              onClick={handleLogout} 
              className="flex items-center space-x-1.5 text-gray-400 hover:text-red-600 font-bold text-sm transition-colors"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-sm font-bold text-gray-600 hover:text-gray-900">Login</Link>
            <Link to="/register" className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
