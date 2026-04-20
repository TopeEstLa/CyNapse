import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, UserCheck, Settings, ChevronRight, Shield, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Utilisateurs', path: '/admin/users', icon: Users },
    { label: 'Utilisateurs en attente', path: '/admin/pending', icon: UserCheck },
    { label: 'Paramètres', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-[calc(100-4rem)] bg-gray-50/50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="p-2 bg-accent rounded-xl">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Administration</h2>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">CyNapse Panel</p>
            </div>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                    isActive 
                      ? "bg-accent text-white shadow-md shadow-accent/20" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600")} />
                    {item.label}
                  </div>
                  <ChevronRight className={cn("w-3 h-3 transition-transform", isActive ? "opacity-100" : "opacity-0 group-hover:opacity-40")} />
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-gray-100">
           <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-xl bg-accent/10 overflow-hidden flex items-center justify-center">
                {user.image ? <img src={user.image} alt="" className="w-full h-full object-cover" /> : <Users className="w-5 h-5 text-accent" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{user.username}</p>
                <p className="text-xs text-gray-500 truncate">{user.role}</p>
              </div>
           </div>
        </div>
      </aside>

      {/* Content area */}
      <main className="flex-1 p-8 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
