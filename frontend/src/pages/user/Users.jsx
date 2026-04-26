import React, { useState, useEffect } from 'react';
import { userApi } from '../../utils/api';
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
    <main className="max-w-6xl mx-auto p-4 space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Discover People</h1>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
          />
        </div>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {filteredUsers.map((u) => (
          <Link 
            key={u.id} 
            to={`/user/${u.id}`}
            className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-500 transition-all group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-gray-100 flex items-center justify-center mb-3 md:mb-4 overflow-hidden border border-gray-200">
                {u.image ? (
                  <img src={u.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 md:w-10 md:h-10 text-gray-400" />
                )}
              </div>
              <h3 className="font-bold text-gray-900 text-sm md:text-base truncate w-full">{u.username}</h3>
              <div className="flex flex-col gap-1 mt-2">
                <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-1.5 md:px-2 py-0.5 rounded border border-blue-100">
                  {u.role || 'USER'}
                </span>
                <p className="text-[10px] md:text-xs text-gray-500 font-medium">
                  {Math.floor(u.exp || 0)} XP
                </p>
              </div>
              
              <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-100 w-full hidden xs:block">
                <span className="text-blue-600 text-xs md:text-sm font-semibold group-hover:underline">View Profile</span>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
};

export default Users;
