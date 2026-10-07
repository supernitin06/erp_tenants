import React, { useState, useMemo } from 'react';
import { NavLink, Link, useParams } from 'react-router-dom';
import {
    Squares2X2Icon,
    AcademicCapIcon,
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
    BuildingLibraryIcon,
    SparklesIcon,
    BeakerIcon,
    HeartIcon,
    CalendarIcon,
    UsersIcon,
    IdentificationIcon,
    ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { useGetdomainQuery } from '../../api/services/domainapi';
import { useGetSubscriptionPlansQuery } from '../../api/services/planapi';
import { useAuth } from '../context/authcontext';

// Feature pages that are backed by a protected API → permission needed to see the link
const FEATURE_PERMISSIONS = {
    'student': 'READ_STUDENT',
    'class-management': 'READ_CLASS',
    'teacher': 'READ_TEACHER',
    'exam-management': 'READ_EXAM',
    'exam-datesheet': 'READ_EXAM_SCHEDULE',
    'exam-schedule': 'READ_EXAM_SCHEDULE',
    'exam-result': 'READ_EXAM',
};

// Organisation administration (available on every plan, shown by permission)
const ADMIN_LINKS = [
    { path: 'admin/users', label: 'Users', icon: UsersIcon, permission: 'USER_READ' },
    { path: 'admin/staff', label: 'Staff', icon: IdentificationIcon, permission: 'VIEW_TENANT_STAFF' },
    { path: 'admin/roles', label: 'Roles & Permissions', icon: ShieldCheckIcon, permission: 'VIEW_TENANT_ROLES' },
];

const Sidebar = ({ closeSidebar }) => {
    const { tenantName } = useParams();
    const { user, hasPermission, tenantSlug } = useAuth();
    const [expandedDomains, setExpandedDomains] = useState({});
    const [hoveredDomain, setHoveredDomain] = useState(null);

    const { data: plansData } = useGetSubscriptionPlansQuery();
    const plans = plansData?.plans || [];

    const activePlan = useMemo(() => {
        if (user?.subscription_plan) return user.subscription_plan;
        if (user?.subscription_planId && plans.length > 0) {
            return plans.find(p => p.id === user.subscription_planId) || null;
        }
        return null;
    }, [user, plans]);

    const activePlanName = activePlan?.name || user?.planName || user?.tenant?.planName || (user?.isActive ? 'Active Plan' : null);

    // Ensure tenantName is defined before rendering links
    const currentTenant = tenantName || tenantSlug || '';
    // Always re-read the plan when the sidebar mounts, the tab regains focus or the plan changes,
    // so domains / features added in the admin panel show up without logging in again
    const { data, isLoading } = useGetdomainQuery(
        { tenantSlug: currentTenant, planId: user?.subscription_planId },
        { skip: !currentTenant, refetchOnMountOrArgChange: true, refetchOnFocus: true }
    );

    const toggleDomain = (domainId) => {
        setExpandedDomains(prev => {
            const isCurrentlyOpen = !!prev[domainId];
            return isCurrentlyOpen ? {} : { [domainId]: true };
        });
    };

    const getDomainIcon = (domainName) => {
        const name = domainName?.toUpperCase()?.trim();

        // Modern icon mapping with gradients
        const iconMap = [
            { pattern: 'ACADEMIC', icon: AcademicCapIcon, gradient: 'from-emerald-500 to-teal-500' },
            { pattern: 'HOSPITAL', icon: BuildingOfficeIcon, gradient: 'from-rose-500 to-pink-500' },
            { pattern: 'EXAM', icon: ClipboardDocumentCheckIcon, gradient: 'from-amber-500 to-orange-500' },
            { pattern: 'LIBRARY', icon: BookOpenIcon, gradient: 'from-indigo-500 to-purple-500' },
            { pattern: 'CLASS', icon: UserGroupIcon, gradient: 'from-blue-500 to-cyan-500' },
            { pattern: 'SALARY', icon: CurrencyDollarIcon, gradient: 'from-green-500 to-emerald-500' },
            { pattern: 'PAYROLL', icon: CurrencyDollarIcon, gradient: 'from-green-500 to-emerald-500' },
            { pattern: 'FEE', icon: BanknotesIcon, gradient: 'from-yellow-500 to-amber-500' },
            { pattern: 'FINANCE', icon: BanknotesIcon, gradient: 'from-yellow-500 to-amber-500' },
            { pattern: 'TRANSPORT', icon: TruckIcon, gradient: 'from-sky-500 to-blue-500' },
            { pattern: 'HOSTEL', icon: BuildingLibraryIcon, gradient: 'from-violet-500 to-purple-500' },
            { pattern: 'LAB', icon: BeakerIcon, gradient: 'from-cyan-500 to-blue-500' },
            { pattern: 'PATIENT', icon: HeartIcon, gradient: 'from-rose-500 to-red-500' },
            { pattern: 'DOCTOR', icon: UserGroupIcon, gradient: 'from-blue-500 to-indigo-500' },
            { pattern: 'ATTENDANCE', icon: CalendarIcon, gradient: 'from-teal-500 to-cyan-500' }
        ];

        for (let item of iconMap) {
            if (name?.includes(item.pattern)) {
                return { Icon: item.icon, gradient: item.gradient };
            }
        }

        return { Icon: Squares2X2Icon, gradient: 'from-slate-500 to-slate-600' };
    };

    const getFeaturePath = (featureName) => {
        const name = featureName?.toUpperCase()?.trim() || '';
        if (!name) return '';

        // Specific cases MUST come before generic ones
        // Attendance check first
        if (name.includes('TEACHER') && (name.includes('ATTENDANCE') || name.includes('ATTANDANCE'))) return 'teacher-attendance';
        if (name.includes('STUDENT') && (name.includes('ATTENDANCE') || name.includes('ATTANDANCE'))) return 'student-attendance';

        // Management checks
        if (name.includes('STUDENT') && name.includes('MANAGEMENT')) return 'student';
        // Handle "Teacher Management" or just "Teacher" mapping to 'teacher' route
        if (name.includes('TEACHER') && name.includes('MANAGEMENT')) return 'teacher';

        // Exam checks
        if (name.includes('EXAM') && name.includes('DATESHEET')) return 'exam-datesheet';
        if (name.includes('EXAM') && name.includes('RESULT')) return 'exam-result';
        if (name.includes('EXAM') && name.includes('SCHEDULE')) return 'exam-schedule';
        if (name.includes('EXAM') && name.includes('MANAGEMENT')) return 'exam-management';

        // Library checks
        if (name.includes('LIBRARY') && name.includes('BOOKS')) return 'library-books-management';
        if (name.includes('BOOK') && name.includes('MANAGEMENT')) return 'library-books-management';
        if (name.includes('LIBRARY')) return 'library';

        // Other Management checks
        if (name.includes('CLASS')) return 'class-management';
        if (name.includes('SALARY')) return 'salary-management';
        if (name.includes('FEE')) return 'fee-management';

        // Hospital checks
        if (name.includes('PATIENT')) return 'patient-management';
        if (name.includes('DOCTOR') && name.includes('APPOINTMENT')) return 'doctor-appointment';
        if (name.includes('DOCTOR')) return 'doctor-management';
        if (name.includes('LAB')) return 'lab-management';
        if (name.includes('ROOM')) return 'room-management';

        // Fallback: lowercase and replace spaces/underscores with hyphens
        return featureName.toLowerCase().replace(/_/g, '-').replace(/\s+/g, '-');
    };

    // Only show features the user's role can open; hide domains that end up empty
    // (features or plan links switched off in the admin panel are hidden too)
    const visibleDomains = useMemo(() => (data?.domains || [])
        .filter((domain) => domain.isActive !== false)
        .map((domain) => ({
            ...domain,
            features: (domain.features || []).filter((f) =>
                f.isActive !== false &&
                hasPermission(FEATURE_PERMISSIONS[getFeaturePath(f.feature_name)])
            ),
        }))
        .filter((domain) => domain.features.length > 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, hasPermission]);

    const adminLinks = ADMIN_LINKS.filter((link) => hasPermission(link.permission));

    return (
        <div className="w-80 h-full bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col overflow-y-auto transition-all duration-300 shadow-xl shadow-slate-200/20 dark:shadow-slate-900/30">

            {/* Sidebar Header with Decorative Elements */}
            <div className="relative p-6 border-b border-slate-200/80 dark:border-slate-800/80">
                {/* Decorative gradient orbs */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 dark:from-blue-500/5 dark:to-purple-500/5 rounded-full blur-2xl -z-0"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-400/10 to-cyan-400/10 dark:from-emerald-500/5 dark:to-cyan-500/5 rounded-full blur-xl -z-0"></div>

                <div className="flex justify-between items-center relative z-10">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <SparklesIcon className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent capitalize truncate">
                            {currentTenant || 'ERP System'}
                        </h2>
                    </div>

                    <button
                        onClick={closeSidebar}
                        className="md:hidden p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <nav className="flex-1 p-4 flex flex-col gap-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                {/* Dashboard Link with special styling */}
                <NavLink
                    to={`/${currentTenant}`}
                    end
                    onClick={closeSidebar}
                    className={({ isActive }) => `
                        group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 overflow-hidden
                        ${isActive
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }
                    `}
                >
                    {({ isActive }) => (
                        <>
                            {/* Animated background gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></div>

                            {/* Active indicator */}
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full"></div>
                            )}

                            <Squares2X2Icon className={`w-5 h-5 relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${isActive ? 'text-blue-500' : ''}`} />

                            <span className="font-medium relative z-10">Dashboard</span>

                            {/* Sparkle effect on hover */}
                            <SparklesIcon className="absolute right-3 w-4 h-4 text-blue-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </>
                    )}
                </NavLink>

                {isLoading && (
                    <div className="space-y-3 px-4 py-4">
                        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse"></div>
                        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse"></div>
                        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse"></div>
                    </div>
                )}

                {visibleDomains.map((domain) => {
                    const { Icon, gradient } = getDomainIcon(domain.domain_name);
                    const isExpanded = expandedDomains[domain.domainId];
                    const isHovered = hoveredDomain === domain.domainId;
                    const cleanDomainName = domain.domain_name?.trim().toLowerCase().replace(/\s+/g, '-') || 'domain';

                    return (
                        <div key={domain.domainId} className="flex flex-col gap-1">
                            <button
                                onClick={() => toggleDomain(domain.domainId)}
                                onMouseEnter={() => setHoveredDomain(domain.domainId)}
                                onMouseLeave={() => setHoveredDomain(null)}
                                className={`
                                    group relative flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 w-full text-left overflow-hidden
                                    ${isExpanded
                                        ? 'text-slate-900 dark:text-white bg-slate-100/80 dark:bg-slate-800/50 backdrop-blur-sm'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                    }
                                `}
                            >
                                {/* Animated gradient background on hover/expand */}
                                <div className={`
                                    absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 transition-opacity duration-300
                                    ${isExpanded ? 'opacity-5' : 'group-hover:opacity-5'}
                                `}></div>

                                {/* Glass morphism effect */}
                                <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                <div className="flex items-center gap-3 relative z-10">
                                    <div className={`
                                        relative p-1.5 rounded-lg bg-gradient-to-br ${gradient} 
                                        transition-all duration-300 group-hover:scale-110 group-hover:rotate-3
                                        ${isExpanded ? 'scale-110' : 'opacity-80 group-hover:opacity-100'}
                                    `}>
                                        <Icon className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="font-medium">{domain.domain_name}</span>
                                </div>

                                {domain.features?.length > 0 && (
                                    <div className={`
                                        relative z-10 p-1 rounded-lg transition-all duration-300
                                        ${isExpanded ? 'bg-slate-200 dark:bg-slate-700' : 'group-hover:bg-slate-200 dark:group-hover:bg-slate-700'}
                                    `}>
                                        {isExpanded ?
                                            <ChevronDownIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" /> :
                                            <ChevronRightIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                        }
                                    </div>
                                )}
                            </button>

                            {isExpanded && domain.features?.length > 0 && (
                                <div className="flex flex-col gap-1 pl-4 ml-4 mt-1 relative">
                                    {/* Vertical line connector */}
                                    <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-300 dark:via-slate-700 to-transparent"></div>

                                    {domain.features.map((feature, featureIndex) => (
                                        <NavLink
                                            key={feature.featureId}
                                            to={`/${currentTenant}/${cleanDomainName}/${getFeaturePath(feature.feature_name)}`}
                                            onClick={closeSidebar}
                                            className={({ isActive }) => `
                                                group relative flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300 overflow-hidden
                                                ${isActive
                                                    ? 'text-blue-600 dark:text-blue-400'
                                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                                }
                                            `}
                                        >
                                            {/* Animated background */}
                                            <div className={`
                                                absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 
                                                transition-opacity duration-300 ${({ isActive }) => isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                                            `}></div>

                                            {/* Active/Connection dot */}
                                            <div className="relative">
                                                <div className={`
                                                    w-1.5 h-1.5 rounded-full transition-all duration-300
                                                    ${({ isActive }) =>
                                                        isActive
                                                            ? 'bg-blue-500 scale-125'
                                                            : 'bg-slate-400 dark:bg-slate-600 group-hover:bg-slate-600 dark:group-hover:bg-slate-400'
                                                    }
                                                `} />

                                                {/* Connecting line to main domain */}
                                                {featureIndex === 0 && (
                                                    <div className="absolute top-0 left-0.5 -translate-y-full h-3 w-px bg-gradient-to-b from-slate-300 dark:from-slate-700 to-transparent"></div>
                                                )}
                                            </div>

                                            <span className="font-medium text-sm relative z-10 truncate">
                                                {feature.feature_name}
                                            </span>

                                            {/* Subtle hover arrow */}
                                            <ChevronRightIcon className="absolute right-2 w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                                        </NavLink>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}

                {adminLinks.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col gap-1">
                        <p className="px-4 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            Administration
                        </p>
                        {adminLinks.map(({ path, label, icon: LinkIcon }) => (
                            <NavLink
                                key={path}
                                to={`/${currentTenant}/${path}`}
                                onClick={closeSidebar}
                                className={({ isActive }) => `
                                    flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200
                                    ${isActive
                                        ? 'text-blue-600 dark:text-blue-400 bg-blue-500/10'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'}
                                `}
                            >
                                <LinkIcon className="w-5 h-5" />
                                <span className="font-medium text-sm">{label}</span>
                            </NavLink>
                        ))}
                    </div>
                )}
            </nav>

            {/* Settings Footer with Modern Design */}
            <div className="relative p-4 border-t border-slate-200/80 dark:border-slate-800/80">
                {/* Decorative gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent"></div>

                {/* Active Plan Widget */}
                {activePlanName && (
                    <div className="relative mb-3 p-3 rounded-2xl bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-indigo-500/10 border border-violet-200/60 dark:border-violet-500/30">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-black uppercase tracking-wider text-violet-700 dark:text-violet-300 flex items-center gap-1">
                                <SparklesIcon className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                                Current Plan
                            </span>
                            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                                Active
                            </span>
                        </div>
                        <div className="text-xs font-bold text-slate-800 dark:text-white truncate">
                            {activePlanName}
                        </div>
                        <Link
                            to={`/${currentTenant}/pricing`}
                            onClick={closeSidebar}
                            className="mt-2 text-[11px] font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 flex items-center justify-between group"
                        >
                            <span>Manage Plan</span>
                            <ChevronRightIcon className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    </div>
                )}

                <div className="relative px-2 py-1">
                    <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{user?.name || user?.email}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        {user?.type === 'TENANT' ? 'Organisation admin' : user?.role || 'No role assigned'}
                    </p>
                </div>

                {/* Version info */}
                <div className="mt-3 px-4 text-xs text-slate-400 dark:text-slate-600 flex items-center gap-2">
                    <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span>v2.0.1 • System Online</span>
                </div>
            </div>

            {/* Custom Scrollbar Styles */}
            <style>{`
                .scrollbar-thin::-webkit-scrollbar {
                    width: 4px;
                }
                
                .scrollbar-thin::-webkit-scrollbar-track {
                    background: transparent;
                }
                
                .scrollbar-thin::-webkit-scrollbar-thumb {
                    border-radius: 20px;
                }
                
                .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
                
                .dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                    background: #475569;
                }
            `}</style>
        </div>
    );
};

export default Sidebar;