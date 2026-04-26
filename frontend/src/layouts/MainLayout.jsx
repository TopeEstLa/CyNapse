import React from 'react';
import {Outlet} from 'react-router-dom';
import Navbar from '../components/Navbar';

const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-transparent">
            <Navbar/>
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-4 md:py-8">
                <Outlet/>
            </main>
        </div>
    );
};

export default MainLayout;
