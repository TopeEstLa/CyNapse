import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { User, Shield, Loader2, Mail, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminPendingUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authorizing, setAuthorizing] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await api.get('/api/admin/user/list');
      // Assume "pending" means enable is false or role is not yet fully authorized
      // In this context, we'll show users where enable === false
      setUsers(data.filter(u => !u.enable));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthorize = async (userId) => {
    setAuthorizing(userId);
    try {
      await api.post(`/api/auth/authorize?user_id=${userId}`);
      alert('Utilisateur autorisé avec succès ! Un mail lui a été envoyé.');
      fetchUsers();
    } catch (err) {
      alert('Erreur lors de l\'autorisation : ' + (err.message || 'Erreur inconnue'));
    } finally {
      setAuthorizing(null);
    }
  };

  if (loading) return <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Utilisateurs en attente</h1>
        <p className="text-gray-500">Validez les nouveaux comptes pour leur donner accès à la plateforme.</p>
      </div>

      {users.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-dashed border-gray-200 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Aucun utilisateur en attente</h3>
          <p className="text-gray-500 mt-1">Tous les utilisateurs sont actuellement validés.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Membre</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date d'inscription</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center overflow-hidden border border-gray-100">
                          {u.image ? <img src={u.image} alt="" className="w-full h-full object-cover" /> : <User className="w-4 h-4 text-accent" />}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">{u.firstName} {u.lastName}</div>
                          <div className="text-xs text-gray-500">@{u.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{u.birthDate || 'Date inconnue'}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleAuthorize(u.id)}
                        disabled={authorizing === u.id}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-xl text-xs font-bold hover:bg-accent/90 transition-all shadow-md shadow-accent/20 disabled:opacity-50"
                      >
                        {authorizing === u.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Mail className="w-3.5 h-3.5" />
                        )}
                        AUTORISER
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
