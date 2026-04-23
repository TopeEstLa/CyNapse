import React, {useState} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {Building2, ChevronDown, LayoutDashboard, LogIn, LogOut, Menu, User, UserPlus, X, Users as UsersIcon, Shield, Activity, Search, Trash2} from 'lucide-react';
import {cn} from '../utils/ui';
import {useAuth} from '../context/AuthContext';
import {Role} from '../utils/constants';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {user, logout} = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const canRequestDelete = user && [Role.ADVANCED, Role.EXPERT, Role.ADMIN].includes(user.role);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
        setDropdownOpen(false);
        setMobileMenuOpen(false);
    };

    const guestItems = [
        {label: 'Home', path: '/', icon: LayoutDashboard}, 
        {label: 'Login', path: '/login', icon: LogIn}, 
        {label: 'Register', path: '/register', icon: UserPlus},
    ];

    const authItems = [
        {label: 'Dashboard', path: '/', icon: LayoutDashboard},
        {label: 'Monitoring', path: '/monitoring', icon: Activity},
        {label: 'Find a room', path: '/find-room', icon: Search},
        {label: 'Users', path: '/users', icon: UsersIcon},
    ];

    const navItems = user ? authItems : guestItems;

    return (<nav className="bg-surface shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">

                <div className="flex-shrink-0 flex items-center gap-2">
                    <div className="p-1.5 bg-primary rounded-lg">
                        <Building2 className="w-5 h-5 text-white"/>
                    </div>
                    <Link to="/" className="text-xl font-bold text-gray-900">
                        Cy<span className="text-primary">Napse</span>
                    </Link>
                </div>

                <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (<Link
                            key={item.path}
                            to={item.path}
                            className={cn("inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors", isActive ? "text-primary bg-primary/10" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50")}
                        >
                            <Icon className="w-4 h-4 mr-2"/>
                            {item.label}
                        </Link>);
                    })}

                    {user && (<div className="relative ml-4">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100 transition-all"
                        >
                            <div
                                className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center overflow-hidden border border-gray-200">
                                {user.image ? (
                                    <img src={user.image} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-4 h-4"/>
                                )}
                            </div>
                            <span className="max-w-[100px] truncate">{user.username}</span>
                            <ChevronDown
                                className={cn("w-4 h-4 transition-transform", dropdownOpen && "rotate-180")}/>
                        </button>

                        {dropdownOpen && (<div
                            className="absolute right-0 mt-2 w-48 bg-surface border border-gray-200 rounded-xl shadow-lg py-1 z-50">
                            <Link
                                to="/profile"
                                onClick={() => setDropdownOpen(false)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                                <User className="w-4 h-4 mr-2 text-gray-400"/>
                                Profile
                            </Link>
                            {canRequestDelete && (
                                <Link
                                    to="/my-requests"
                                    onClick={() => setDropdownOpen(false)}
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    <Trash2 className="w-4 h-4 mr-2 text-gray-400"/>
                                    My Delete Request
                                </Link>
                            )}
                            {user?.role === Role.ADMIN && (
                                <Link
                                    to="/admin"
                                    onClick={() => setDropdownOpen(false)}
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    <Shield className="w-4 h-4 mr-2 text-gray-400"/>
                                    Admin
                                </Link>
                            )}
                            <div className="border-t border-gray-100 my-1"/>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center px-4 py-2 text-sm text-danger hover:bg-danger/10"
                            >
                                <LogOut className="w-4 h-4 mr-2"/>
                                Logout
                            </button>
                        </div>)}
                    </div>)}
                </div>

                <div className="md:hidden flex items-center">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6"/> : <Menu className="h-6 w-6"/>}
                    </button>
                </div>
            </div>
        </div>

        {mobileMenuOpen && (<div className="md:hidden bg-surface border-b border-gray-200 pb-4 px-4 space-y-2">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (<Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn("flex items-center px-4 py-3 text-base font-medium rounded-lg", isActive ? "text-primary bg-primary/10" : "text-gray-600 hover:bg-gray-50")}
                >
                    <Icon className="w-5 h-5 mr-3"/>
                    {item.label}
                </Link>);
            })}

            {user && (<>
                <div className="border-t border-gray-100 my-2"/>
                <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                    <User className="w-5 h-5 mr-3 text-gray-400"/>
                    Profile
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 text-base font-medium text-danger hover:bg-danger/10 rounded-lg"
                >
                    <LogOut className="w-5 h-5 mr-3"/>
                    Logout
                </button>
            </>)}
        </div>)}
    </nav>);
};

export default Navbar;
