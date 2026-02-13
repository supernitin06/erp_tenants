import React from 'react';
import { motion } from 'framer-motion';
import { useGetSubscriptionPlansQuery } from '../../api/services/planapi';
import { 
    HiOutlineCurrencyRupee,
    HiOutlineCheckCircle,
    HiOutlineXCircle,
    HiOutlineStar,
    HiOutlineArrowRight,
    HiOutlineCube,
    HiOutlineRefresh
} from 'react-icons/hi';
import { FiPackage } from 'react-icons/fi';

const Pricing = () => {
    const { data, isLoading, isError } = useGetSubscriptionPlansQuery();
    const plans = data?.plans || [];

    const cardColors = [
        { bg: 'from-emerald-500 to-teal-500', light: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500/30' },
        { bg: 'from-violet-500 to-purple-500', light: 'bg-violet-500/10', text: 'text-violet-500', border: 'border-violet-500/30' },
        { bg: 'from-blue-500 to-cyan-500', light: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/30' },
        { bg: 'from-amber-500 to-orange-500', light: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/30' },
        { bg: 'from-pink-500 to-rose-500', light: 'bg-pink-500/10', text: 'text-pink-500', border: 'border-pink-500/30' }
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-slate-800 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400">Loading plans...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <HiOutlineXCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <p className="text-white font-medium mb-2">Failed to load plans</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="text-sm text-slate-400 hover:text-white flex items-center gap-1 mx-auto"
                    >
                        <HiOutlineRefresh className="w-4 h-4" />
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    if (!plans.length) {
        return (
            <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiPackage className="w-8 h-8 text-slate-500" />
                    </div>
                    <p className="text-white font-medium">No plans available</p>
                    <p className="text-sm text-slate-500 mt-1">Check back later</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B1120] py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
                        Subscription Plans
                    </h1>
                    <p className="text-slate-500 text-sm">
                        Choose the plan that works for you
                    </p>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {plans.map((plan, index) => {
                        const colors = cardColors[index % cardColors.length];
                        const isPopular = plan.name?.includes('BITMAX');

                        return (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -4 }}
                                className="relative group"
                            >
                                {/* Card */}
                                <div className={`relative bg-slate-900/90 backdrop-blur-sm border ${isPopular ? 'border-emerald-500/50' : 'border-slate-800'} rounded-2xl p-5 h-full flex flex-col`}>
                                    
                                    {/* Popular Badge */}
                                    {isPopular && plan.isActive && (
                                        <div className="absolute -top-3 left-4">
                                            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                                                <HiOutlineStar className="w-3 h-3 text-white" />
                                                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Popular</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <div className={`w-10 h-10 ${colors.light} rounded-xl flex items-center justify-center mb-2`}>
                                                <HiOutlineCube className={`w-5 h-5 ${colors.text}`} />
                                            </div>
                                            <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                                        </div>
                                        
                                        {/* Status */}
                                        {plan.isActive ? (
                                            <span className="flex items-center gap-1 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                                <span className="text-[10px] font-medium text-emerald-500">Active</span>
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 px-2 py-1 bg-slate-800 rounded-full">
                                                <HiOutlineXCircle className="w-3 h-3 text-slate-500" />
                                                <span className="text-[10px] font-medium text-slate-500">Inactive</span>
                                            </span>
                                        )}
                                    </div>

                                    {/* Price */}
                                    <div className="flex items-baseline mb-3">
                                        <HiOutlineCurrencyRupee className={`w-5 h-5 ${colors.text} mr-0.5`} />
                                        <span className="text-3xl font-bold text-white">
                                            {plan.price.toLocaleString('en-IN')}
                                        </span>
                                        <span className="text-slate-500 text-xs ml-1.5">
                                            /{plan.duration === 30 ? 'mo' : plan.duration === 365 ? 'yr' : `${plan.duration}d`}
                                        </span>
                                    </div>

                                    {/* Domains */}
                                    {plan.domains?.length > 0 && (
                                        <div className="mb-3">
                                            <p className="text-xs text-slate-500 mb-1.5">Included domains:</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {plan.domains.map((domain, idx) => (
                                                    <span 
                                                        key={idx}
                                                        className={`px-2 py-0.5 ${colors.light} ${colors.text} text-[10px] font-medium rounded-full border ${colors.border}`}
                                                    >
                                                        {domain.domain_name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Features */}
                                    <div className="flex-grow mb-4">
                                        <ul className="space-y-2">
                                            <li className="flex items-center text-xs text-slate-300">
                                                <HiOutlineCheckCircle className="w-3.5 h-3.5 text-emerald-500 mr-2 flex-shrink-0" />
                                                <span>{plan.duration} days validity</span>
                                            </li>
                                            <li className="flex items-center text-xs text-slate-300">
                                                <HiOutlineCheckCircle className="w-3.5 h-3.5 text-emerald-500 mr-2 flex-shrink-0" />
                                                <span>{plan.showon_tenant_dashboard ? 'Visible on dashboard' : 'Hidden from dashboard'}</span>
                                            </li>
                                            {plan.domains?.length === 0 && (
                                                <li className="flex items-center text-xs text-slate-500">
                                                    <HiOutlineXCircle className="w-3.5 h-3.5 text-slate-600 mr-2 flex-shrink-0" />
                                                    <span>No domains included</span>
                                                </li>
                                            )}
                                        </ul>
                                    </div>

                                    {/* Button */}
                                    <button
                                        disabled={!plan.isActive}
                                        className={`w-full py-2.5 px-4 rounded-xl text-sm font-medium flex items-center justify-center gap-1.5 transition-all ${
                                            plan.isActive
                                                ? `bg-gradient-to-r ${colors.bg} text-white shadow-lg ${colors.text.replace('text', 'shadow')}/20 hover:shadow-xl hover:-translate-y-0.5`
                                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                        }`}
                                    >
                                        {plan.isActive ? (
                                            <>
                                                Select Plan
                                                <HiOutlineArrowRight className="w-4 h-4" />
                                            </>
                                        ) : (
                                            'Unavailable'
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Pricing;