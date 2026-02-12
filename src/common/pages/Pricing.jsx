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

    return (
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
                </div>
            </motion.div>
        </div>
    );
};

export default Pricing;

