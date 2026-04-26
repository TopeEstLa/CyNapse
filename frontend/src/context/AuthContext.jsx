import React, {createContext, useContext, useEffect, useState} from 'react';
import {authApi} from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const userData = await authApi.me();
            setUser(userData);
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        const userData = await authApi.signIn(credentials);
        setUser(userData);
        return userData;
    };

    const logout = async () => {
        try {
            await authApi.signOut();
        } catch (err) {
            console.error("Sign out error:", err);
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{user, setUser, loading, login, logout, checkAuth}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
