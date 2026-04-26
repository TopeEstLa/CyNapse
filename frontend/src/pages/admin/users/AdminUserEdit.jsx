import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adminApi, api } from '../../../utils/api.js';
import { User, Shield, Loader2, ArrowLeft, Save, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Role, MemberType } from '../../../utils/constants.js';

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
      await adminApi.updateUser(user); 
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
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  if (!user) return (
    <div className="text-center py-12">
      <h2 className="text-xl font-semibold text-gray-900">User not found</h2>
      <Link to="/admin" className="text-primary mt-4 inline-block">Back to Admin Panel</Link>
    </div>
  );

  return (
    <main className="max-w-4xl mx-auto p-4 text-gray-900">
      <nav className="mb-6">
        <Link to="/admin" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Admin Dashboard
        </Link>
      </nav>

      <header className="flex items-center gap-4 mb-8 border-b pb-6">
        <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
          {user.image ? (
            <img src={user.image} alt="" className="w-full h-full object-cover" />
          ) : (
            <User className="w-8 h-8 text-gray-400" />
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit User: {user.username}</h1>
          <p className="text-sm text-gray-500">System ID: {user.id}</p>
        </div>
      </header>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2 mb-6">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg flex items-center gap-2 mb-6">
          <CheckCircle2 className="w-5 h-5" />
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <section className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6 border-b pb-2">Profile Details</h2>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">First Name</label>
                  <input
                    type="text"
                    value={user.firstName || ''}
                    onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Last Name</label>
                  <input
                    type="text"
                    value={user.lastName || ''}
                    onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
                  <input
                    type="email"
                    value={user.email || ''}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Username</label>
                  <input
                    type="text"
                    value={user.username || ''}
                    onChange={(e) => setUser({ ...user, username: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Gender</label>
                  <select
                    value={user.gender || ''}
                    onChange={(e) => setUser({ ...user, gender: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  >
                    <option value="">Select Gender</option>
                    <option value="Homme">Homme</option>
                    <option value="Femme">Femme</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Birth Date</label>
                  <input
                    type="date"
                    value={user.birthDate || ''}
                    onChange={(e) => setUser({ ...user, birthDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Experience (XP)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={user.exp || 0}
                    onChange={(e) => setUser({ ...user, exp: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Avatar URL</label>
                  <input
                    type="text"
                    value={user.image || ''}
                    onChange={(e) => setUser({ ...user, image: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">System Role</label>
                  <select
                    value={user.role}
                    onChange={(e) => setUser({ ...user, role: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-bold"
                  >
                    <option value={Role.USER}>USER</option>
                    <option value={Role.ADVANCED}>ADVANCED</option>
                    <option value={Role.EXPERT}>EXPERT</option>
                    <option value={Role.ADMIN}>ADMIN</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Member Category</label>
                  <select
                    value={user.memberType}
                    onChange={(e) => setUser({ ...user, memberType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  >
                    {Object.values(MemberType).map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="enable"
                  checked={user.enable}
                  onChange={(e) => setUser({ ...user, enable: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="enable" className="text-sm font-bold text-gray-700">Account Active</label>
              </div>

              <div className="pt-4 border-t mt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all shadow-sm font-bold uppercase text-xs tracking-wider"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Processing...' : 'Save User Changes'}
                </button>
              </div>
            </form>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
              <Lock className="w-5 h-5 text-gray-400" />
              Reset Security
            </h2>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  placeholder="Enter new password"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={saving || !newPassword}
                className="w-full py-2 bg-gray-900 text-white rounded-lg hover:bg-black disabled:opacity-50 transition-all font-bold uppercase text-xs tracking-wider"
              >
                Force Update Password
              </button>
            </form>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default AdminUserEdit;
