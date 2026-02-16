import React, { useState, useEffect } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import {
    Squares2X2Icon,
    AcademicCapIcon,
    Cog6ToothIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    BuildingOfficeIcon,
    XMarkIcon,
    ClipboardDocumentCheckIcon,
    BookOpenIcon,
    UserGroupIcon,
    CurrencyDollarIcon,
    BanknotesIcon,
    TruckIcon,
    BuildingLibraryIcon
} from '@heroicons/react/24/outline';
import { useGetdomainQuery } from '../../api/services/domainapi';
import { useAuth } from '../context/authcontext';

const Sidebar = ({ closeSidebar }) => { // closeSidebar prop Layout se aayega
    const { tenantName } = useParams();
    const { planId, user } = useAuth();
    const navigate = useNavigate();
    const { data, isLoading } = useGetdomainQuery(planId);
    const [expandedDomains, setExpandedDomains] = useState({});

    useEffect(() => {
        // If user is logged in but visiting another tenant's URL, redirect them to their own dashboard
        if (user && tenantName && user.tenantUsername?.toLowerCase() !== tenantName.toLowerCase()) {
            console.warn(`Session mismatch: Logged in as ${user.tenantUsername} but visiting ${tenantName}. Redirecting...`);
            navigate(`/${user.tenantUsername}`, { replace: true });
        }
    }, [user, tenantName, navigate]);

    const toggleDomain = (domainId) => {
        setExpandedDomains(prev => ({
            ...prev,
            [domainId]: !prev[domainId]
        }));
    };

    const getDomainIcon = (domainName) => {
        const name = domainName?.toUpperCase();
        if (name?.includes('ACADEMIC')) return <AcademicCapIcon className="w-5 h-5" />;
        if (name?.includes('HOSPITAL')) return <BuildingOfficeIcon className="w-5 h-5" />;
        if (name?.includes('EXAMINATION')) return <ClipboardDocumentCheckIcon className="w-5 h-5" />;
        if (name?.includes('LIBRARY')) return <BookOpenIcon className="w-5 h-5" />;
        if (name?.includes('CLASS')) return <UserGroupIcon className="w-5 h-5" />;
        if (name?.includes('SALARY') || name?.includes('PAYROLL')) return <CurrencyDollarIcon className="w-5 h-5" />;
        if (name?.includes('FEE') || name?.includes('FINANCE')) return <BanknotesIcon className="w-5 h-5" />;
        if (name?.includes('TRANSPORT')) return <TruckIcon className="w-5 h-5" />;
        if (name?.includes('HOSTEL')) return <BuildingLibraryIcon className="w-5 h-5" />;
        return <Squares2X2Icon className="w-5 h-5" />;
    };

    const getFeaturePath = (featureName) => {
        const name = featureName?.toUpperCase() || '';
        if (name.includes('STUDENT')) return 'student';
        if (name.includes('TEACHER')) return 'teacher';

        // School & Academic Features
        if (name.includes('EXAM') && name.includes('DATESHEET')) return 'exam-datesheet';
        if (name.includes('EXAM') && name.includes('RESULT')) return 'exam-result';
        if (name.includes('LIBRARY') && name.includes('BOOKS')) return 'library-books-mangement'; // Matches route path
        if (name.includes('LIBRARY')) return 'library';
        if (name.includes('CLASS')) return 'class-management';
        if (name.includes('SALARY')) return 'salary-manageement'; // Matches route path typo
        if (name.includes('FEE')) return 'fee-manageemnt'; // Matches route path typo

        // Hospital Features (Placeholder)
        if (name.includes('PATIENT')) return 'patient-management';
        if (name.includes('DOCTOR') && name.includes('APPOINTMENT')) return 'doctor-appointment';
        if (name.includes('DOCTOR')) return 'doctor-management';
        if (name.includes('LAB')) return 'lab-management';
        if (name.includes('ROOM')) return 'room-management';

        // Default fallback: slugify
        return featureName.toLowerCase().replace(/_/g, '-').replace(/\s+/g, '-');
    };

    return (
        /* Responsive Width: Mobile pe full h-screen rahega lekin Layout iski positioning handle karega */
        <div className="w-64 h-full bg-slate-900 border-r border-slate-800 flex flex-col overflow-y-auto">

            {/* Sidebar Header with Close Button for Mobile */}
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent capitalize truncate">
                    {tenantName || 'ERP System'}
                </h2>
                {/* Close button: Sirf Mobile (hidden on md) */}
                <button
                    onClick={closeSidebar}
                    className="md:hidden p-2 text-slate-400 hover:text-white"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>
            </div>

            <nav className="flex-1 p-4 flex flex-col gap-2">
                <NavLink
                    to={`/${tenantName}`}
                    end
                    onClick={closeSidebar} // Link click hote hi sidebar band
                    className={({ isActive }) => `
                        flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                        ${isActive
                            ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }
                    `}
                >
                    <Squares2X2Icon className="w-5 h-5" />
                    <span className="font-medium">Dashboard</span>
                </NavLink>

                {isLoading && (
                    <div className="text-slate-500 text-sm px-4 py-2 animate-pulse">Loading menu...</div>
                )}

                {data?.domains?.map((domain) => (
                    <div key={domain.domainId} className="flex flex-col gap-1">
                        <button
                            onClick={() => toggleDomain(domain.domainId)}
                            className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 w-full text-left
                                ${expandedDomains[domain.domainId] ? 'text-white bg-slate-800/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
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

                        {expandedDomains[domain.domainId] && domain.features?.length > 0 && (
                            <div className="flex flex-col gap-1 pl-4 border-l border-slate-800/50 ml-4 mt-1">
                                {domain.features.map((feature) => (
                                    <NavLink
                                        key={feature.featureId}
                                        to={`/${tenantName}/${domain.domain_name}/${getFeaturePath(feature.feature_name)}`}
                                        onClick={closeSidebar} // Link click hote hi sidebar band
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
