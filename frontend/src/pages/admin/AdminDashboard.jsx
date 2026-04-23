import React, { useState, useEffect } from 'react';
import { adminApi } from '../../utils/api.js';
import { Users, UserPlus, UserCheck, Loader2, TrendingUp, Shield } from 'lucide-react';
import { Role } from '../../utils/constants.js';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const users = await adminApi.users();
        const active = users.filter(u => u.enable).length;
        const pending = users.filter(u => !u.enable).length;
        const admins = users.filter(u => u.role === Role.ADMIN).length;

        setStats({
          total: users.length,
          active,
          pending,
          admins
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  const statCards = [
    { label: 'Total Users', value: stats.total, icon: Users, color: 'bg-primary' },
    { label: 'Active Users', value: stats.active, icon: UserCheck, color: 'bg-secondary' },
    { label: 'Pending', value: stats.pending, icon: UserPlus, color: 'bg-warning' },
    { label: 'Administrators', value: stats.admins, icon: Shield, color: 'bg-primary-dark' },
  ];

  return (
    <div className="space-y-8 text-gray-900">
      <div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight">Dashboard</h1>
        <p className="text-gray-500 text-sm">System overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((card, i) => (
          <div key={i} className="bg-surface p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${card.color} bg-opacity-10`}>
                <card.icon className={`w-6 h-6 ${card.color.replace('bg-', 'text-')}`} />
              </div>
              <TrendingUp className="w-4 h-4 text-gray-300" />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{card.label}</p>
            <p className="text-3xl font-black text-gray-900 mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm">
           <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
             <Shield className="w-5 h-5 text-primary" />
             Security & Access
           </h3>
           <div className="space-y-4">
             <div className="flex items-center justify-between p-4 bg-background-light rounded-2xl">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-secondary"></div>
                   <span className="text-sm font-bold text-gray-700">Firewall active</span>
                </div>
                <span className="text-[10px] font-black text-secondary uppercase">Protected</span>
             </div>
             <div className="flex items-center justify-between p-4 bg-background-light rounded-2xl">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-primary"></div>
                   <span className="text-sm font-bold text-gray-700">System logs</span>
                </div>
                <span className="text-[10px] font-black text-primary uppercase">Viewable</span>
             </div>
           </div>
        </div>

        <div className="bg-background-dark p-6 md:p-8 rounded-[2rem] text-white shadow-xl">
           <h3 className="text-lg font-black mb-6">System Status</h3>
           <div className="space-y-6">
              <div>
                 <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-tighter opacity-60">
                    <span>Server Load</span>
                    <span>24%</span>
                 </div>
                 <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[24%]"></div>
                 </div>
              </div>
              <div>
                 <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-tighter opacity-60">
                    <span>IoT Storage</span>
                    <span>12.4 GB / 50 GB</span>
                 </div>
                 <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-secondary w-[35%]"></div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
