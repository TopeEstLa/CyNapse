import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { User, Shield, Loader2, Edit2, CheckCircle2, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await api.get('/api/admin/user/list');
      setUsers(data);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="w-8 h-8 animate-spin text-accent" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
            <div className="p-3 bg-accent/10 rounded-2xl">
                <Shield className="w-6 h-6 text-accent" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 border border-red-100">
          {error}
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">User</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Email</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Role</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center overflow-hidden">
                        {u.image ? (
                          <img src={u.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 h-5 text-accent" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{u.firstName} {u.lastName}</div>
                        <div className="text-sm text-gray-500">@{u.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {u.enable ? (
                      <span className="inline-flex items-center gap-1 text-green-600 text-sm font-medium">
                        <CheckCircle2 className="w-4 h-4" />
                        Enabled
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-600 text-sm font-medium">
                        <XCircle className="w-4 h-4" />
                        Disabled
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/admin/user/${u.id}`}
                      className="p-2 text-gray-400 hover:text-accent transition-colors inline-block"
                      title="Edit User"
                    >
                      <Edit2 className="w-5 h-5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
