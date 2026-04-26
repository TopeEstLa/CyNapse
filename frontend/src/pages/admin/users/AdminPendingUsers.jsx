import React, {useEffect, useState} from 'react';
import {adminApi, api} from '../../../utils/api.js';
import {Check, Loader2, Mail, Search, User} from 'lucide-react';

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
            <Loader2 className="w-8 h-8 animate-spin text-primary"/>
        </div>
    );

    return (
        <main className="space-y-6 text-gray-900">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Pending Authorization</h1>
                    <p className="text-sm text-gray-500">Validate new user registrations.</p>
                </div>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"/>
                    <input
                        type="text"
                        placeholder="Search by username or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none w-full text-sm font-medium"
                    />
                </div>
            </header>

            {users.length === 0 ? (
                <section
                    className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 py-20 text-center text-gray-400">
                    <User className="w-12 h-12 text-gray-200 mx-auto mb-4"/>
                    <p className="font-bold uppercase tracking-widest text-xs">All users have been processed</p>
                </section>
            ) : (
                <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[700px]">
                            <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Registration
                                    Info
                                </th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                            {filteredUsers.map((u) => (
                                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 rounded bg-yellow-50 flex items-center justify-center flex-shrink-0 border border-yellow-100 overflow-hidden">
                                                {u.image ?
                                                    <img src={u.image} alt="" className="w-full h-full object-cover"/> :
                                                    <User className="w-5 h-5 text-yellow-600"/>}
                                            </div>
                                            <div className="min-w-0">
                                                <div
                                                    className="text-sm font-bold text-gray-900 truncate">{u.username}</div>
                                                <div className="text-xs text-gray-500 truncate flex items-center gap-1">
                                                    <Mail className="w-3.5 h-3.5"/> {u.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        Pending Validation
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleAuthorize(u.id)}
                                            disabled={actionLoading === u.id}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs font-bold uppercase tracking-wider disabled:opacity-50 shadow-sm"
                                        >
                                            {actionLoading === u.id ? <Loader2 className="w-3.5 h-3.5 animate-spin"/> :
                                                <Check className="w-3.5 h-3.5"/>}
                                            Authorize User
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}
        </main>
    );
};

export default AdminPendingUsers;
