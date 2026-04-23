import React, { useState, useEffect } from 'react';
import { userApi } from '../utils/api';
import { User, Search, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userApi.list();
        setUsers(data);
      } catch (err) {
        console.error('Failed to fetch users', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Discover People</h1>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-surface border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredUsers.map((u) => (
          <Link 
            key={u.id} 
            to={`/user/${u.id}`}
            className="bg-surface p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {u.image ? (
                  <img src={u.image} alt="" className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <User className="w-10 h-10 text-primary" />
                )}
              </div>
              <h3 className="font-bold text-gray-900">{u.username}</h3>
              <div className="flex flex-col gap-1 mt-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-2 py-0.5 rounded-full">
                  {u.role || 'USER'}
                </span>
                <p className="text-xs text-gray-400 font-medium">
                  {Math.floor(u.exp || 0)} XP
                </p>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-50 w-full">
                <span className="text-primary text-sm font-semibold">View Profile</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Users;
