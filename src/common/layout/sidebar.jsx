import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import {
    Squares2X2Icon,
    UserGroupIcon,
    AcademicCapIcon,
    ChatBubbleLeftRightIcon,
    Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { useGetdomainQuery } from '../../api/services/domainapi';
import { useAuth } from '../context/authcontext';

const Sidebar = () => {
    const { tenantName } = useParams();
    const authData = useAuth();
    console.log("Auth Context Data:", authData);
    const { planId } = authData;
    const { data } = useGetdomainQuery(planId);
    console.log("doamiss", data);
    const navItems = [
        { name: 'Dashboard', icon: <Squares2X2Icon className="w-5 h-5" />, path: `/${tenantName}` },
        { name: 'Students', icon: <UserGroupIcon className="w-5 h-5" />, path: `/${tenantName}/student` },
        { name: 'Teachers', icon: <AcademicCapIcon className="w-5 h-5" />, path: `/${tenantName}/teacher` },
        { name: 'Rooms', icon: <ChatBubbleLeftRightIcon className="w-5 h-5" />, path: `/${tenantName}/room` },
    ];

    return (
        <div className="w-64 h-screen bg-slate-900 border-r border-slate-800 flex flex-col fixed left-0 top-0">
            <div className="p-6 border-b border-slate-800">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent capitalize">
                    {tenantName || 'ERP System'}
                </h2>
            </div>

            <nav className="flex-1 p-4 flex flex-col gap-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        end={item.path === `/${tenantName}`}
                        className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${isActive
                                ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_20px_rgba(37,99,235,0.1)]'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }
            `}
                    >
                        {item.icon}
                        <span className="font-medium">{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
                    <Cog6ToothIcon className="w-5 h-5" />
                    <span className="font-medium">Settings</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
