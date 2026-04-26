import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import News from './pages/public/News';
import NewsDetail from './pages/public/NewsDetail';

// User Pages
import Profile from './pages/user/Profile';
import Users from './pages/user/Users';
import UserProfileView from './pages/user/UserProfileView';
import IoTMonitoring from './pages/user/IoTMonitoring';
import AllDevices from './pages/user/AllDevices';
import RoomSensors from './pages/user/RoomSensors';
import DeviceDetail from './pages/user/DeviceDetail';
import FindRoom from './pages/user/FindRoom';
import MyDeleteRequests from './pages/user/MyDeleteRequests';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/users/AdminUsers';
import AdminPendingUsers from './pages/admin/users/AdminPendingUsers';
import AdminUserEdit from './pages/admin/users/AdminUserEdit';
import AdminRooms from './pages/admin/rooms/AdminRooms';
import AdminRoomEdit from './pages/admin/rooms/AdminRoomEdit';
import AdminSensorEdit from './pages/admin/devices/AdminSensorEdit';
import AdminActuatorEdit from './pages/admin/devices/AdminActuatorEdit';
import AdminNews from './pages/admin/news/AdminNews';
import AdminNewsEdit from './pages/admin/news/AdminNewsEdit';
import AdminDeleteRequests from './pages/admin/AdminDeleteRequests';

import './index.css';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Main Layout - Public & User Routes */}
          <Route element={<MainLayout />}>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:slug" element={<NewsDetail />} />

            {/* Protected User Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/users" element={<Users />} />
              <Route path="/user/:id" element={<UserProfileView />} />
              <Route path="/monitoring" element={<IoTMonitoring />} />
              <Route path="/all-devices" element={<AllDevices />} />
              <Route path="/monitoring/room/:id" element={<RoomSensors />} />
              <Route path="/device/:deviceId" element={<DeviceDetail />} />
              <Route path="/find-room" element={<FindRoom />} />
              <Route path="/my-requests" element={<MyDeleteRequests />} />
            </Route>
          </Route>

          {/* Admin Layout - Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="pending" element={<AdminPendingUsers />} />
            <Route path="user/:id" element={<AdminUserEdit />} />
            <Route path="rooms" element={<AdminRooms />} />
            <Route path="rooms/:id" element={<AdminRoomEdit />} />
            <Route path="sensors/:id" element={<AdminSensorEdit />} />
            <Route path="actuators/:id" element={<AdminActuatorEdit />} />
            <Route path="news" element={<AdminNews />} />
            <Route path="news/create" element={<AdminNewsEdit />} />
            <Route path="news/edit/:slug" element={<AdminNewsEdit />} />
            <Route path="requests" element={<AdminDeleteRequests />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
