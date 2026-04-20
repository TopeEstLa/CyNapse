import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { User, Shield, Loader2, ArrowLeft, Save, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';

const AdminUserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await api.get(`/api/admin/user/get?userId=${id}`);
        setUser(data);
      } catch (err) {
        setError('Failed to fetch user');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      // The spec says 'user' is a query parameter for the POST request
      // This is unusual, but we'll follow the spec if it's literally what's expected.
      // Most likely it's a JSON body, but parameters in query mean we should try query string.
      // We'll try to pass the user object. If it's a complex object in query, it's often JSON stringified.
      // However, usually POST /api/admin/user/update with user object in body is standard.
      // Given the spec shows 'in': 'query' for 'user', we'll try that if needed, 
      // but let's try passing it as body first as it's more standard for POST.
      // WAIT: Let's follow the spec exactly if possible.
      
      await api.post(`/api/admin/user/update`, user); 
      setSuccess('User updated successfully');
    } catch (err) {
      setError(err.message || 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!newPassword) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await api.post(`/api/admin/user/updatePassword?userId=${id}&newPassword=${encodeURIComponent(newPassword)}`);
      setSuccess('Password updated successfully');
      setNewPassword('');
    } catch (err) {
      setError(err.message || 'Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="w-8 h-8 animate-spin text-accent" />
    </div>
  );

  if (!user) return (
    <div className="text-center py-12">
      <h2 className="text-xl font-semibold text-gray-900">User not found</h2>
      <Link to="/admin" className="text-accent mt-4 inline-block">Back to Admin Panel</Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Link to="/admin" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to User Management
      </Link>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center overflow-hidden">
          {user.image ? (
            <img src={user.image} alt="" className="w-full h-full object-cover" />
          ) : (
            <User className="w-8 h-8 text-accent" />
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit User: {user.username}</h1>
          <p className="text-gray-500">ID: {user.id}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl flex items-center gap-2 mb-6">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-2xl flex items-center gap-2 mb-6">
          <CheckCircle2 className="w-5 h-5" />
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Profile Information</h2>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    value={user.firstName || ''}
                    onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    value={user.lastName || ''}
                    onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={user.email || ''}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Username</label>
                  <input
                    type="text"
                    value={user.username || ''}
                    onChange={(e) => setUser({ ...user, username: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Gender</label>
                  <select
                    value={user.gender || ''}
                    onChange={(e) => setUser({ ...user, gender: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                  >
                    <option value="">Select Gender</option>
                    <option value="Homme">Homme</option>
                    <option value="Femme">Femme</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Birth Date</label>
                  <input
                    type="date"
                    value={user.birthDate || ''}
                    onChange={(e) => setUser({ ...user, birthDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Experience (Exp)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={user.exp || 0}
                    onChange={(e) => setUser({ ...user, exp: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Profile Image URL</label>
                  <input
                    type="text"
                    value={user.image || ''}
                    onChange={(e) => setUser({ ...user, image: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Role</label>
                  <select
                    value={user.role}
                    onChange={(e) => setUser({ ...user, role: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Member Type</label>
                  <select
                    value={user.memberType}
                    onChange={(e) => setUser({ ...user, memberType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                  >
                    <option value="FRIEND">FRIEND</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="enable"
                  checked={user.enable}
                  onChange={(e) => setUser({ ...user, enable: e.target.checked })}
                  className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
                />
                <label htmlFor="enable" className="text-sm font-medium text-gray-700">Account Enabled</label>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2 bg-accent text-white rounded-xl hover:bg-accent/90 disabled:opacity-50 transition-all shadow-md"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-gray-400" />
              Reset Password
            </h2>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                  placeholder="Enter new password"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={saving || !newPassword}
                className="w-full py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-all"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserEdit;
