import React, {useEffect, useState} from 'react';
import {adminApi} from '../../utils/api.js';
import {Loader2, Shield, TrendingUp, UserCheck, UserPlus, Users} from 'lucide-react';
import {Role} from '../../utils/constants.js';

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
            <Loader2 className="w-8 h-8 animate-spin text-primary"/>
        </div>
    );

    const statCards = [
        {label: 'Total Users', value: stats.total, icon: Users, color: 'bg-primary'},
        {label: 'Active Users', value: stats.active, icon: UserCheck, color: 'bg-secondary'},
        {label: 'Pending', value: stats.pending, icon: UserPlus, color: 'bg-warning'},
        {label: 'Administrators', value: stats.admins, icon: Shield, color: 'bg-primary-dark'},
    ];

    return (
        <main className="space-y-8 text-gray-900">
            <header className="border-b pb-4">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-gray-500 text-sm">System overview.</p>
            </header>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {statCards.map((card, i) => (
                    <div key={i}
                         className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg ${card.color} bg-opacity-10`}>
                                <card.icon className={`w-6 h-6 ${card.color.replace('bg-', 'text-')}`}/>
                            </div>
                            <TrendingUp className="w-4 h-4 text-gray-300"/>
                        </div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{card.label}</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
                    </div>
                ))}
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <section className="bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-blue-600"/>
                        Security & Access
                    </h3>
                    <div className="space-y-4">
                        <div
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                <span className="text-sm font-medium text-gray-700">Firewall active</span>
                            </div>
                            <span className="text-[10px] font-bold text-green-600 uppercase">Protected</span>
                        </div>
                        <div
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                <span className="text-sm font-medium text-gray-700">System logs</span>
                            </div>
                            <span className="text-[10px] font-bold text-blue-600 uppercase">Viewable</span>
                        </div>
                    </div>
                </section>

                <section className="bg-gray-900 p-6 md:p-8 rounded-xl text-white shadow-lg">
                    <h3 className="text-lg font-bold mb-6">System Status</h3>
                    <div className="space-y-6">
                        <div>
                            <div
                                className="flex justify-between text-xs font-semibold mb-2 uppercase tracking-wider opacity-70">
                                <span>Server Load</span>
                                <span>24%</span>
                            </div>
                            <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                                <div className="h-full bg-blue-500 w-[24%]"></div>
                            </div>
                        </div>
                        <div>
                            <div
                                className="flex justify-between text-xs font-semibold mb-2 uppercase tracking-wider opacity-70">
                                <span>IoT Storage</span>
                                <span>12.4 GB / 50 GB</span>
                            </div>
                            <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                                <div className="h-full bg-green-500 w-[35%]"></div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default AdminDashboard;
