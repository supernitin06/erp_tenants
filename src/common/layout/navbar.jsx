import React from 'react';
import { useAuth } from '../context/authcontext';
import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10">
            <div className="flex items-center gap-4">
                {/* Search Bar or Breadcrumbs could go here */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-slate-800 border-none rounded-lg px-4 py-2 text-sm text-slate-300 focus:ring-1 focus:ring-blue-500 w-64 transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <button className="text-slate-400 hover:text-white transition-colors">
                    <BellIcon className="w-6 h-6" />
                </button>

                <div className="h-8 w-[1px] bg-slate-800" />

                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-sm font-medium text-white">{user?.name || 'Admin User'}</p>
                        <p className="text-xs text-slate-500 capitalize">Administrator</p>
                    </div>
                    <button
                        onClick={logout}
                        className="hover:scale-105 transition-transform"
                    >
                        <UserCircleIcon className="w-10 h-10 text-slate-400" />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
