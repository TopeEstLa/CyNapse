import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Users, UserPlus, UserCheck, UserX, Loader2, TrendingUp, Shield } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    admins: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const users = await api.get('/api/admin/user/list');
        setStats({
          total: users.length,
          active: users.filter(u => u.enable).length,
          pending: users.filter(u => !u.enable).length,
          admins: users.filter(u => u.role === 'ADMIN').length
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto" />;

  const cards = [
    { label: 'Utilisateurs totaux', value: stats.total, icon: Users, color: 'bg-blue-500' },
    { label: 'Utilisateurs actifs', value: stats.active, icon: UserCheck, color: 'bg-green-500' },
    { label: 'En attente', value: stats.pending, icon: UserPlus, color: 'bg-amber-500' },
    { label: 'Administrateurs', value: stats.admins, icon: Shield, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-500">Aperçu global de votre plateforme.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className={cn("p-3 rounded-2xl text-white", card.color)}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
           <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
             <TrendingUp className="w-5 h-5 text-accent" />
             Activité récente
           </h3>
           <div className="space-y-4">
             <p className="text-sm text-gray-500 text-center py-8">Aucune activité récente à afficher.</p>
           </div>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
           <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
             <Shield className="w-5 h-5 text-accent" />
             Alertes système
           </h3>
           <div className="space-y-4">
             <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3 text-amber-700">
                <UserPlus className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">Il y a {stats.pending} utilisateurs en attente de validation.</p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const cn = (...classes) => classes.filter(Boolean).join(' ');

export default AdminDashboard;
