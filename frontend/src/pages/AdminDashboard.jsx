import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Users, UserPlus, UserCheck, UserX, Loader2, TrendingUp, Shield } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const users = await api.get('/api/admin/user/list');
        const active = users.filter(u => u.enable).length;
        const pending = users.filter(u => !u.enable).length;
        const admins = users.filter(u => u.role === 'ADMIN').length;

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
      <Loader2 className="w-8 h-8 animate-spin text-accent" />
    </div>
  );

  const statCards = [
    { label: 'Total Utilisateurs', value: stats.total, icon: Users, color: 'bg-blue-500' },
    { label: 'Utilisateurs Actifs', value: stats.active, icon: UserCheck, color: 'bg-green-500' },
    { label: 'En Attente', value: stats.pending, icon: UserPlus, color: 'bg-amber-500' },
    { label: 'Administrateurs', value: stats.admins, icon: Shield, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Dashboard</h1>
        <p className="text-gray-500 text-sm">Vue d'ensemble du système.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${card.color} bg-opacity-10 text-white`}>
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
        <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm">
           <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
             <Shield className="w-5 h-5 text-accent" />
             Sécurité & Accès
           </h3>
           <div className="space-y-4">
             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-green-500"></div>
                   <span className="text-sm font-bold text-gray-700">Pare-feu actif</span>
                </div>
                <span className="text-[10px] font-black text-green-600 uppercase">Protégé</span>
             </div>
             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                   <span className="text-sm font-bold text-gray-700">Logs système</span>
                </div>
                <span className="text-[10px] font-black text-blue-600 uppercase">Consultables</span>
             </div>
           </div>
        </div>

        <div className="bg-slate-900 p-6 md:p-8 rounded-[2rem] text-white shadow-xl">
           <h3 className="text-lg font-black mb-6">État du Système</h3>
           <div className="space-y-6">
              <div>
                 <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-tighter opacity-60">
                    <span>Charge Serveur</span>
                    <span>24%</span>
                 </div>
                 <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-accent w-[24%]"></div>
                 </div>
              </div>
              <div>
                 <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-tighter opacity-60">
                    <span>Stockage IoT</span>
                    <span>12.4 GB / 50 GB</span>
                 </div>
                 <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-[35%]"></div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
