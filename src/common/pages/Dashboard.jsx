import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    UserGroupIcon,
    AcademicCapIcon,
    BuildingOfficeIcon,
    ChartBarIcon,
    SparklesIcon,
    ArrowRightIcon,
    CheckBadgeIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/authcontext';
import { useGetSubscriptionPlansQuery } from '../../api/services/planapi';

const DashboardCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all group shadow-sm dark:shadow-none">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-opacity-100`}>
                <Icon className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded"> +12.5% </span>
        </div>
        <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</p>
    </div> 
);

const Dashboard = () => {
    const { tenantName } = useParams();  
    const { user } = useAuth();
    const { data: plansData } = useGetSubscriptionPlansQuery();
    const plans = plansData?.plans || [];

    // Resolve current active plan
    const activePlan = useMemo(() => {
        if (user?.subscription_plan) return user.subscription_plan;
        if (user?.subscription_planId && plans.length > 0) {
            return plans.find(p => p.id === user.subscription_planId) || null;
        }
        return null;
    }, [user, plans]);

    const activePlanName = activePlan?.name || user?.planName || user?.tenant?.planName || 'Active Plan';

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header with Active Plan Banner */}
            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gradient-to-r from-violet-900 via-indigo-900 to-purple-900 text-white p-6 md:p-8 rounded-3xl shadow-xl relative overflow-hidden border border-violet-500/20">
                {/* Background glow decoration */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            Subscription Active
                        </span>
                        <span className="text-xs text-violet-200/70">• Tenant Portal</span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight capitalize">
                        Welcome Back, {tenantName || user?.tenantUsername || 'Organization'}! 👋
                    </h1>
                    <p className="text-violet-200/80 text-sm mt-1 max-w-xl">
                        Here is what's happening in your organization today.
                    </p>
                </div>

                {/* Prominent Active Plan Card */}
                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 p-4 sm:p-5 rounded-2xl">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-400 to-violet-400 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
                        <SparklesIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-violet-200/90 flex items-center gap-1">
                            <CheckBadgeIcon className="w-3.5 h-3.5 text-emerald-300" />
                            Current Subscribed Plan
                        </div>
                        <div className="text-lg font-black text-white tracking-tight flex items-center gap-2 mt-0.5">
                            <span>{activePlanName}</span>
                            <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-300 border border-emerald-400/30">
                                Active
                            </span>
                        </div>
                        <div className="text-xs text-violet-200/80 mt-0.5">
                            {activePlan?.duration ? `${activePlan.duration} Days Validity` : 'Full Enterprise Access'}
                        </div>
                    </div>
                    <Link
                        to={`/${tenantName || user?.tenantUsername}/pricing`}
                        className="mt-2 sm:mt-0 sm:ml-2 px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold tracking-wide transition-all border border-white/25 flex items-center gap-1.5 whitespace-nowrap shadow-sm"
                    >
                        <span>Upgrade / Change</span>
                        <ArrowRightIcon className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardCard
                    title="Total Students"
                    value="1,284"
                    icon={UserGroupIcon}
                    color="bg-blue-500 text-blue-500"
                />

                <DashboardCard
                    title="Active Teachers"
                    value="42"
                    icon={AcademicCapIcon}
                    color="bg-purple-500 text-purple-500"
                />

                <DashboardCard
                    title="Departments"
                    value="12"
                    icon={BuildingOfficeIcon}
                    color="bg-emerald-500 text-emerald-500"
                />

                <DashboardCard
                    title="Revenue"
                    value="$12,450"
                    icon={ChartBarIcon}
                    color="bg-amber-500 text-amber-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 h-64 flex flex-col items-center justify-center text-center shadow-sm dark:shadow-none">
                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-600/10 rounded-full flex items-center justify-center mb-4">
                        <ChartBarIcon className="w-8 h-8 text-blue-500" />
                    </div>
                    <h3 className="text-slate-900 dark:text-white font-semibold mb-1">Growth Analytics</h3>
                    <p className="text-slate-500 text-sm max-w-[250px]">
                        Your organization has grown by 15% compared to last month.
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 h-64 flex flex-col items-center justify-center text-center shadow-sm dark:shadow-none">
                    <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-600/10 rounded-full flex items-center justify-center mb-4">
                        <UserGroupIcon className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h3 className="text-slate-900 dark:text-white font-semibold mb-1">Recent Activity</h3>
                    <p className="text-slate-500 text-sm max-w-[250px]">
                        15 new students enrolled in the last 24 hours.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
