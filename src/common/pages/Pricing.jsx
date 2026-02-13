<<<<<<< HEAD
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
=======
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';

const Pricing = () => {
    const navigate = useNavigate();
    const { tenantName } = useParams();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('https://bt-erp-backend-edww.onrender.com/api/v1/super-admin/subscription', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
                if (data.success) {
                    // Mapping your specific data structure
                    const enrichedPlans = data.plans.map((p, index) => {
                        // Extracting features from your domains nesting
                        const extractedFeatures = p.domains?.[0]?.domain?.features?.map(f => f.feature_name) || ['Standard Features'];

                        return {
                            ...p,
                            color: index === 0 ? 'from-emerald-500 to-teal-500' : 'from-violet-600 to-purple-600',
                            recommended: p.name.includes('VALLY'), // Marking your Green Vally plan
                            features: extractedFeatures
                        };
                    });
                    setPlans(enrichedPlans);
                }
            } catch (error) {
                console.error("Fetch plans error", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
    }, []);

    const handleSelectPlan = (plan) => {
        console.log("Navigating to checkout with plan:", plan.id);
        navigate(`/${tenantName}/checkout`, { state: { plan } });
    };

    if (loading) return (
        <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        </div>
    );
>>>>>>> 5160b9dc52ba5a508a9dbc3e43ee5f17a0a53985

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
<<<<<<< HEAD
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
=======
        <div className="min-h-screen bg-[#0B1120] text-white py-20 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto"
            >
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-black bg-gradient-to-r from-blue-400 via-indigo-500 to-violet-600 bg-clip-text text-transparent mb-6">
                        Active Subscription Plans
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Choose the right plan to manage your {tenantName || 'organization'}.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 justify-center">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 hover:border-slate-600 transition-all group overflow-hidden ${plan.recommended ? 'ring-2 ring-indigo-500 shadow-2xl scale-105 z-10' : 'hover:scale-105 z-0'}`}
                        >
                            {plan.recommended && (
                                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-bl-2xl uppercase tracking-wider">
                                    Recommended
                                </div>
                            )}

                            <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                            <div className="flex items-baseline mb-6">
                                <span className="text-5xl font-black text-white">₹{plan.price}</span>
                                <span className="text-slate-500 ml-2 font-medium">/{plan.duration} days</span>
                            </div>

                            <div className="text-sm text-slate-400 mb-6 uppercase tracking-widest font-bold">Included Features:</div>
                            <ul className="space-y-4 mb-8">
                                {plan.features.slice(0, 5).map((feature, idx) => (
                                    <li key={idx} className="flex items-center text-slate-300 text-sm">
                                        <svg className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        {feature.replace(/_/g, ' ')}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleSelectPlan(plan)}
                                className="w-full py-4 rounded-xl font-bold transition-all shadow-lg bg-indigo-600 hover:bg-indigo-500 text-white relative z-20"
                            >
                                Subscribe Now
                            </button>
                        </motion.div>
                    ))}
>>>>>>> 5160b9dc52ba5a508a9dbc3e43ee5f17a0a53985
                </div>
            </div>
        </div>
    );
};

<<<<<<< HEAD
export default Pricing;
=======
export default Pricing;

>>>>>>> 5160b9dc52ba5a508a9dbc3e43ee5f17a0a53985
