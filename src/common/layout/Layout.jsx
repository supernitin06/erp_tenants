
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar';
import Navbar from './navbar';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-[#0B1120] relative">
            <div className={`
                fixed inset-y-0 left-0 z-50 transform 
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
                md:translate-x-0 md:static md:inset-0 
                transition-transform duration-300 ease-in-out
                w-64 bg-[#0B1120] border-r border-slate-800
            `}>
                <Sidebar closeSidebar={() => setIsSidebarOpen(false)} />
            </div>

            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className="flex-1 flex flex-col min-w-0">
                <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

                <main className="p-4 md:p-8 overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;