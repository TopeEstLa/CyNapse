import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Building2, LogOut, Menu, User as UserIcon, X} from 'lucide-react';
import {useAuth} from '../context/AuthContext';
import {Role} from '../utils/constants';

const Navbar = () => {
    const {user, logout} = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
        setIsOpen(false);
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const navLinks = [
        {to: "/", label: "Home"},
        {to: "/news", label: "News"},
    ];

    const protectedLinks = user ? [
        {to: "/monitoring", label: "Monitoring"},
        {to: "/all-devices", label: "All Devices"},
        {to: "/find-room", label: "Find Room"},
        {to: "/users", label: "Users"},
        ...(user.role === Role.EXPERT || user.role === Role.ADMIN ? [{
            to: "/my-requests",
            label: "My Delete Requests"
        }] : []),
    ] : [];

    const allLinks = [...navLinks, ...protectedLinks];

    return (
        <nav
            className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50 px-4 sm:px-6 py-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-4 lg:space-x-10">
                <Link to="/" className="flex items-center group">
                    <div
                        className="bg-blue-50 text-blue-600 p-1.5 rounded-lg mr-2 shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <Building2 className="w-5 h-5"/>
                    </div>
                    <span
                        className="font-black text-xl tracking-tighter text-gray-900 group-hover:text-blue-600 transition-colors">CyNapse</span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden lg:flex items-center space-x-1">
                    {allLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className="px-3 py-2 rounded-lg text-sm font-bold text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Desktop Right Side */}
            <div className="hidden lg:flex items-center space-x-6">
                {user ? (
                    <div className="flex items-center space-x-6">
                        <Link to="/profile" className="flex items-center space-x-3 group pr-6 border-r border-gray-100">
                            <div
                                className="h-9 w-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xs border border-blue-200 overflow-hidden shadow-sm group-hover:border-blue-400 transition-all">
                                {user.image ? (
                                    <img src={user.image} alt="" className="w-full h-full object-cover"/>
                                ) : (
                                    <UserIcon size={18}/>
                                )}
                            </div>
                            <span
                                className="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition-colors">{user.username}</span>
                        </Link>
                        {user.role === Role.ADMIN && (
                            <Link
                                to="/admin"
                                className="bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-gray-900/10"
                            >
                                Admin
                            </Link>
                        )}
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-1.5 text-gray-400 hover:text-red-600 font-bold text-sm transition-colors"
                        >
                            <LogOut size={16}/>
                            <span>Logout</span>
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center space-x-4">
                        <Link to="/login" className="text-sm font-bold text-gray-600 hover:text-gray-900">Login</Link>
                        <Link to="/register"
                              className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">Register</Link>
                    </div>
                )}
            </div>

            {/* Mobile Menu Button & Profile */}
            <div className="lg:hidden flex items-center space-x-3">
                {user && (
                    <Link to="/profile"
                          className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-200 overflow-hidden shadow-sm">
                        {user.image ? (
                            <img src={user.image} alt="" className="w-full h-full object-cover"/>
                        ) : (
                            <UserIcon size={14}/>
                        )}
                    </Link>
                )}
                <button
                    onClick={toggleMenu}
                    className="p-2 text-gray-600 hover:text-blue-600 focus:outline-none bg-gray-50 rounded-lg"
                >
                    {isOpen ? <X size={24}/> : <Menu size={24}/>}
                </button>
            </div>

            {/* Mobile Menu Panel */}
            {isOpen && (
                <div
                    className="absolute top-full left-0 right-0 bg-white border-b shadow-xl lg:hidden animate-in slide-in-from-top duration-300">
                    <div className="flex flex-col p-4 space-y-2">
                        {allLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="px-4 py-3 rounded-xl text-base font-bold text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="h-px bg-gray-100 my-2"></div>
                        {user ? (
                            <div className="flex flex-col space-y-2">
                                <Link
                                    to="/profile"
                                    className="px-4 py-3 rounded-xl text-base font-bold text-gray-700 flex items-center space-x-3"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <div
                                        className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xs border border-blue-200 overflow-hidden">
                                        {user.image ? (
                                            <img src={user.image} alt="" className="w-full h-full object-cover"/>
                                        ) : (
                                            <UserIcon size={20}/>
                                        )}
                                    </div>
                                    <span>{user.username}</span>
                                </Link>
                                {user.role === Role.ADMIN && (
                                    <Link
                                        to="/admin"
                                        className="mx-4 py-3 px-4 bg-gray-900 text-white rounded-xl text-sm font-black uppercase tracking-widest text-center"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Admin Panel
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="mx-4 py-3 px-4 text-red-600 font-bold text-base text-left flex items-center space-x-2"
                                >
                                    <LogOut size={18}/>
                                    <span>Logout</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col space-y-2 p-2">
                                <Link
                                    to="/login"
                                    className="px-4 py-3 rounded-xl text-base font-bold text-gray-600 text-center"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-3 bg-blue-600 text-white rounded-xl text-base font-bold text-center shadow-lg shadow-blue-600/20"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
