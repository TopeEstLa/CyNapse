import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    <nav className="bg-white border-b p-4 flex items-center justify-between">
      <div className="flex items-center space-x-6">
        <Link to="/" className="font-bold text-lg">CyNapse</Link>
        <div className="flex space-x-4">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/news" className="hover:text-blue-600">News</Link>
          {user && (
            <>
              <Link to="/monitoring" className="hover:text-blue-600">Monitoring</Link>
              <Link to="/find-room" className="hover:text-blue-600">Find Room</Link>
              <Link to="/users" className="hover:text-blue-600">Users</Link>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <Link to="/profile" className="hover:underline">{user.username}</Link>
            {user.role === Role.ADMIN && (
              <Link to="/admin" className="bg-gray-100 px-3 py-1 rounded text-sm">Admin</Link>
            )}
            <button onClick={handleLogout} className="text-red-600 hover:underline">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
