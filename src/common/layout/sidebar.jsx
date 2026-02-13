import React, { useMemo, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import {
    Squares2X2Icon,
    UserGroupIcon,
    AcademicCapIcon,
    ChatBubbleLeftRightIcon,
    Cog6ToothIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    BeakerIcon,
    HeartIcon,
    ClipboardDocumentCheckIcon,
    QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import { useGetdomainQuery } from '../../api/services/domainapi';
import { useAuth } from '../context/authcontext';

const Sidebar = () => {
    const { tenantName } = useParams();
    const { planId } = useAuth();
    
    // 1. Fetch Permissions from API
    const { data: domainData } = useGetdomainQuery(planId);
    
    // DEBUG: Check what data is coming from API
    console.log("Sidebar - Plan ID:", planId);
    console.log("Sidebar - API Data:", domainData);

    // State for Accordion (Groups)
    const [expandedGroups, setExpandedGroups] = useState({
        'Academic': true, // Default Open
        'Hospital': true
    });

    // 2. CONFIGURATION MAP: Backend Name -> Frontend UI
    const moduleConfig = useMemo(() => ({
        // --- School / Academic Modules ---
        'Student Management': { 
            name: 'Students', 
            icon: <UserGroupIcon className="w-5 h-5" />, 
            path: `/${tenantName}/student`,
            group: 'Academic' 
        },
        'student_management': { 
            name: 'Students', 
            icon: <UserGroupIcon className="w-5 h-5" />, 
            path: `/${tenantName}/student`,
            group: 'Academic' 
        },
        'Teacher Management': { 
            name: 'Faculty', 
            icon: <AcademicCapIcon className="w-5 h-5" />, 
            path: `/${tenantName}/teacher`,
            group: 'Academic' 
        },
        'teacher_management': { 
            name: 'Faculty', 
            icon: <AcademicCapIcon className="w-5 h-5" />, 
            path: `/${tenantName}/teacher`,
            group: 'Academic' 
        },
        'Room Management': { 
            name: 'Classrooms', 
            icon: <ChatBubbleLeftRightIcon className="w-5 h-5" />, 
            path: `/${tenantName}/room`,
            group: 'Academic' 
        },
        'room_management': { 
            name: 'Classrooms', 
            icon: <ChatBubbleLeftRightIcon className="w-5 h-5" />, 
            path: `/${tenantName}/room`,
            group: 'Academic' 
        },

        // --- Hospital Modules ---
        'Patient Management': { 
            name: 'Patients', 
            icon: <UserGroupIcon className="w-5 h-5" />, 
            path: `/${tenantName}/patient`,
            group: 'Hospital' 
        },
        'Doctor Management': { 
            name: 'Doctors', 
            icon: <HeartIcon className="w-5 h-5" />, 
            path: `/${tenantName}/doctor`,
            group: 'Hospital' 
        },
    }), [tenantName]);

    // 3. BUILD NAVIGATION TREE
    const navTree = useMemo(() => {
        const tree = [];
        const groups = {};

        // Always add Dashboard
        tree.push({ name: 'Dashboard', icon: <Squares2X2Icon className="w-5 h-5" />, path: `/${tenantName}`, type: 'item' });

        const allowedModules = Array.isArray(domainData) ? domainData : (domainData?.domains || []);

        allowedModules.forEach(module => {
            const backendName = module.domain_name || module.name;
            const config = moduleConfig[backendName];

            if (config) {
                if (config.group) {
                    // Add to Group
                    if (!groups[config.group]) {
                        const groupItem = { name: config.group, type: 'group', children: [] };
                        groups[config.group] = groupItem;
                        tree.push(groupItem);
                    }
                    groups[config.group].children.push(config);
                } else {
                    // Add as Standalone Item
                    tree.push({ ...config, type: 'item' });
                }
            } else if (backendName) {
                // FALLBACK: If name doesn't match config, show it anyway
                tree.push({
                    name: backendName,
                    icon: <QuestionMarkCircleIcon className="w-5 h-5" />,
                    path: `/${tenantName}/${backendName.toLowerCase().replace(/\s+/g, '-')}`,
                    type: 'item'
                });
            }
        });
        return tree;
    }, [domainData, moduleConfig, tenantName]);

    const toggleGroup = (groupName) => {
        setExpandedGroups(prev => ({ ...prev, [groupName]: !prev[groupName] }));
    };

    return (
        <div className="w-64 h-screen bg-slate-900 border-r border-slate-800 flex flex-col fixed left-0 top-0">
            <div className="p-6 border-b border-slate-800">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent capitalize">
                    {tenantName || 'ERP System'}
                </h2>
            </div>

            <nav className="flex-1 p-4 flex flex-col gap-2">
                {navTree.map((item, index) => {
                    // RENDER GROUP (Accordion)
                    if (item.type === 'group') {
                        return (
                            <div key={item.name + index} className="mb-2">
                                <button
                                    onClick={() => toggleGroup(item.name)}
                                    className="flex items-center justify-between w-full px-4 py-2 text-slate-400 hover:text-white transition-colors uppercase text-xs font-bold tracking-wider"
                                >
                                    <span>{item.name}</span>
                                    {expandedGroups[item.name] ? <ChevronDownIcon className="w-3 h-3"/> : <ChevronRightIcon className="w-3 h-3"/>}
                                </button>
                                
                                {expandedGroups[item.name] && (
                                    <div className="mt-1 space-y-1">
                                        {item.children.map((child) => (
                                            <NavLink
                                                key={child.name}
                                                to={child.path}
                                                className={({ isActive }) => `
                                                    flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 mx-2
                                                    ${isActive
                                                        ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                                    }
                                                `}
                                            >
                                                {child.icon}
                                                <span className="font-medium text-sm">{child.name}</span>
                                            </NavLink>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    }

                    // RENDER SINGLE ITEM
                    return (
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
                    );
                })}
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
