import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar';
import Navbar from './navbar';

const Layout = () => {
    return (
        <div className="flex min-h-screen bg-[#0B1120]">
            <Sidebar />
            <div className="flex-1 ml-64">
                <Navbar />
                <main className="p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
