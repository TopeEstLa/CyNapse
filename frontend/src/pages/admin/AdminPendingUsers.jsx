import React, { useState, useEffect } from 'react';
import { adminApi, api } from '../../utils/api.js';
import { User, Check, Loader2, Search, Mail } from 'lucide-react';

const AdminPendingUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const data = await adminApi.users();
      setUsers(data.filter(u => !u.enable));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthorize = async (userId) => {
    setActionLoading(userId);
    try {
      await api.post(`/api/auth/authorize?user_id=${userId}`);
      fetchPendingUsers();
    } catch (err) {
      console.error(err);
      alert('Error during authorization');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="space-y-6 text-gray-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pending</h1>
          <p className="text-sm text-gray-500">New users to validate.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-surface border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none w-full text-sm font-medium"
          />
        </div>
      </div>

      {users.length === 0 ? (
        <div className="bg-surface rounded-[2rem] border-2 border-dashed border-gray-100 py-20 text-center text-gray-400">
           <User className="w-12 h-12 text-gray-200 mx-auto mb-4" />
           <p className="font-bold uppercase tracking-widest text-xs">No pending requests</p>
        </div>
      ) : (
        <div className="bg-surface rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-background-light border-b border-gray-100">
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">User</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Registration date</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-background-light transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center flex-shrink-0">
                          {u.image ? <img src={u.image} alt="" className="w-full h-full object-cover rounded-xl" /> : <User className="w-5 h-5 text-warning" />}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-gray-900 truncate">{u.username}</div>
                          <div className="text-[10px] text-gray-400 truncate flex items-center gap-1">
                             <Mail className="w-2.5 h-2.5" /> {u.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-tighter">
                      Recently
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleAuthorize(u.id)}
                        disabled={actionLoading === u.id}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-xl hover:bg-secondary/90 transition-colors text-[10px] font-black uppercase tracking-widest disabled:opacity-50 shadow-md shadow-secondary/10"
                      >
                        {actionLoading === u.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                        Validate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPendingUsers;
