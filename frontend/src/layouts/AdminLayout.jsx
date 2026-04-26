import React, {useState} from 'react';
import {Link, Navigate, Outlet, useLocation} from 'react-router-dom';
import {Home as HomeIcon, LayoutDashboard, Menu, Tag, Trash2, UserCheck, Users, X} from 'lucide-react';
import {useAuth} from '../context/AuthContext';
import {Role} from '../utils/constants';

const AdminLayout = () => {
    const {user, loading} = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    if (loading) return <div>Loading...</div>;
    if (!user || user.role !== Role.ADMIN) return <Navigate to="/"/>;

    const menuItems = [
        {label: 'Dashboard', path: '/admin', icon: LayoutDashboard},
        {label: 'Users', path: '/admin/users', icon: Users},
        {label: 'Pending', path: '/admin/pending', icon: UserCheck},
        {label: 'Rooms', path: '/admin/rooms', icon: HomeIcon},
        {label: 'News', path: '/admin/news', icon: Tag},
        {label: 'Requests', path: '/admin/requests', icon: Trash2},
    ];

    return (
        <div className="min-h-screen bg-transparent flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside
                className={`bg-white border-r w-full md:w-64 space-y-2 p-4 ${isMobileMenuOpen ? 'block' : 'hidden md:block'}`}>
                <div className="flex items-center justify-between mb-6">
                    <span className="font-bold text-xl">Admin Panel</span>
                    <button className="md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
                        <X size={24}/>
                    </button>
                </div>
                <nav className="space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                                    isActive ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <Icon size={20}/>
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <header className="bg-white border-b h-16 flex items-center justify-between px-4">
                    <button className="md:hidden" onClick={() => setIsMobileMenuOpen(true)}>
                        <Menu size={24}/>
                    </button>
                    <div className="flex items-center space-x-4 ml-auto">
                        <span>{user.username}</span>
                        <Link to="/" className="text-sm text-blue-600 hover:underline">Exit Admin</Link>
                    </div>
                </header>
                <main className="p-6">
                    <Outlet/>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
