import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Users from './pages/Users';
import UserProfileView from './pages/UserProfileView';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminPendingUsers from './pages/AdminPendingUsers';
import AdminUserEdit from './pages/AdminUserEdit';
import AdminRooms from './pages/AdminRooms';
import AdminRoomEdit from './pages/AdminRoomEdit';
import IoTMonitoring from './pages/IoTMonitoring';
import RoomSensors from './pages/RoomSensors';
import DeviceDetail from './pages/DeviceDetail';
import FindRoom from './pages/FindRoom';
import './index.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-accent/20 border-t-accent"></div>
    </div>
  );
  
  if (!user) return <Navigate to="/login" />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-accent/20 border-t-accent"></div>
    </div>
  );
  
  if (!user || user.role !== 'ADMIN') return <Navigate to="/" />;
  return children;
};

function AppContent() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><Home /></main>} />
          <Route path="/login" element={<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><Login /></main>} />
          <Route path="/register" element={<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><Register /></main>} />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><Profile /></main>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/monitoring" 
            element={
              <ProtectedRoute>
                <IoTMonitoring />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/find-room" 
            element={
              <ProtectedRoute>
                <FindRoom />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/monitoring/room/:id" 
            element={
              <ProtectedRoute>
                <RoomSensors />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/monitoring/room/:roomId/device/:deviceId" 
            element={
              <ProtectedRoute>
                <DeviceDetail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/users" 
            element={
              <ProtectedRoute>
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><Users /></main>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/user/:id" 
            element={
              <ProtectedRoute>
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><UserProfileView /></main>
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Routes with Sidebar Layout */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="pending" element={<AdminPendingUsers />} />
            <Route path="rooms" element={<AdminRooms />} />
            <Route path="rooms/:id" element={<AdminRoomEdit />} />
            <Route path="user/:id" element={<AdminUserEdit />} />
            <Route path="settings" element={<div className="p-8 text-center text-gray-500">System settings coming soon.</div>} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
