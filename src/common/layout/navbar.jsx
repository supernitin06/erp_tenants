


import React from 'react';
import { useAuth } from '../context/authcontext';
import { BellIcon, UserCircleIcon, Bars3Icon } from '@heroicons/react/24/outline';

const Navbar = ({ onMenuClick }) => {
    const { user, logout } = useAuth();

    return (
        <nav className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">

            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg md:hidden transition-colors"
                >
                    <Bars3Icon className="w-6 h-6" />
                </button>

                <div className="relative hidden sm:block">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-slate-800 border-none rounded-lg px-4 py-2 text-sm text-slate-300 focus:ring-1 focus:ring-blue-500 w-48 lg:w-64 transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 md:gap-6">
                <button className="text-slate-400 hover:text-white transition-colors p-1">
                    <BellIcon className="w-6 h-6" />
                </button>

                <div className="h-8 w-[1px] bg-slate-800 hidden xs:block" />

                <div className="flex items-center gap-2 md:gap-3">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-medium text-white truncate max-w-[120px]">
                            {user?.name || 'Admin User'}
                        </p>
                        <p className="text-xs text-slate-500 capitalize">Administrator</p>
                    </div>

                    <button
                        onClick={logout}
                        className="hover:scale-105 transition-transform shrink-0"
                        title="Logout"
                    >
                        <UserCircleIcon className="w-9 h-9 md:w-10 md:h-10 text-slate-400" />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
