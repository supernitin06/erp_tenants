
import React, { useMemo, useState } from 'react';

// import { useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import {
    Squares2X2Icon,
    UserGroupIcon,
    AcademicCapIcon,
    ChatBubbleLeftRightIcon,
    Cog6ToothIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { useGetdomainQuery } from '../../api/services/domainapi';
import { useAuth } from '../context/authcontext';

const Sidebar = () => {
    const { tenantName } = useParams();
    const { planId } = useAuth();
    const { data, isLoading } = useGetdomainQuery(planId);

    // State for expanded domains
    const [expandedDomains, setExpandedDomains] = useState({});

    const toggleDomain = (domainId) => {
        setExpandedDomains(prev => ({
            ...prev,
            [domainId]: !prev[domainId]
        }));
    };

    // Static icon mapping
    const getDomainIcon = (domainName) => {
        const name = domainName?.toUpperCase();
        if (name?.includes('ACADEMIC')) return <AcademicCapIcon className="w-5 h-5" />;
        if (name?.includes('HOSPITAL')) return <BuildingOfficeIcon className="w-5 h-5" />; // Example
        return <Squares2X2Icon className="w-5 h-5" />;
    };

    // Helper to map feature names to paths (heuristic based on existing routes)
    const getFeaturePath = (featureName) => {
        const name = featureName?.toUpperCase() || '';
        if (name.includes('STUDENT')) return 'student';
        if (name.includes('TEACHER')) return 'teacher';
        if (name.includes('ROOM')) return 'room';
        // Default slugify
        return name.toLowerCase().replace(/_/g, '-').replace(/\s+/g, '-');
    };

    return (
        <div className="w-64 h-screen bg-slate-900 border-r border-slate-800 flex flex-col fixed left-0 top-0 overflow-y-auto">
            <div className="p-6 border-b border-slate-800">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent capitalize">
                    {tenantName || 'ERP System'}
                </h2>
            </div>

            <nav className="flex-1 p-4 flex flex-col gap-2">
                {/* Static Dashboard Link */}
                <NavLink
                    to={`/${tenantName}`}
                    end
                    className={({ isActive }) => `
                        flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                        ${isActive
                            ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_20px_rgba(37,99,235,0.1)]'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }
                    `}
                >
                    <Squares2X2Icon className="w-5 h-5" />
                    <span className="font-medium">Dashboard</span>
                </NavLink>

                {/* Loading State */}
                {isLoading && (
                    <div className="text-slate-500 text-sm px-4 py-2">Loading menu...</div>
                )}

                {/* Dynamic Domains & Features */}
                {data?.domains?.map((domain) => (
                    <div key={domain.domainId} className="flex flex-col gap-1">
                        {/* Domain Header (Clickable to Toggle) */}
                        <button
                            onClick={() => toggleDomain(domain.domainId)}
                            className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 w-full text-left
                                ${expandedDomains[domain.domainId] ? 'text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                            `}
                        >
                            <div className="flex items-center gap-3">
                                {getDomainIcon(domain.domain_name)}
                                <span className="font-medium">{domain.domain_name}</span>
                            </div>
                            {domain.features?.length > 0 && (
                                expandedDomains[domain.domainId] ?
                                    <ChevronDownIcon className="w-4 h-4 text-slate-500" /> :
                                    <ChevronRightIcon className="w-4 h-4 text-slate-500" />
                            )}
                        </button>

                        {/* Features Dropdown */}
                        {expandedDomains[domain.domainId] && domain.features?.length > 0 && (
                            <div className="flex flex-col gap-1 pl-4 border-l border-slate-800/50 ml-4">
                                {domain.features.map((feature) => (
                                    <NavLink
                                        key={feature.featureId}
                                        to={`/${tenantName}/${domain.domain_name}/${getFeaturePath(feature.feature_name)}`}
                                        className={({ isActive }) => `
                                            flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm
                                            ${isActive
                                                ? 'bg-blue-600/10 text-blue-400 border border-blue-500/10'
                                                : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                                            }
                                        `}
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />
                                        <span className="font-medium truncate">{feature.feature_name}</span>
                                    </NavLink>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800 mt-auto">
                <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
                    <Cog6ToothIcon className="w-5 h-5" />
                    <span className="font-medium">Settings</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
