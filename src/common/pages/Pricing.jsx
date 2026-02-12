
import React from 'react';
import { motion } from 'framer-motion';

const Pricing = () => {
    const plans = [
        {
            title: 'Starter',
            price: '$29',
            period: '/mo',
            features: ['5 Users', 'Basic Analytics', 'Standard Support'],
            recommended: false,
            color: 'from-blue-500 to-cyan-500'
        },
        {
            title: 'Professional',
            price: '$99',
            period: '/mo',
            features: ['Unlimited Users', 'Advanced Analytics', 'Priority Support', 'Custom Domain'],
            recommended: true,
            color: 'from-violet-600 to-purple-600'
        },
        {
            title: 'Enterprise',
            price: 'Custom',
            period: '',
            features: ['Dedicated Account Manager', 'SLA', 'Custom Integrations', 'Audit Logs'],
            recommended: false,
            color: 'from-emerald-500 to-teal-500'
        }
    ];

    return (
        <div className="min-h-screen bg-[#0B1120] text-white py-20 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto"
            >
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-black bg-gradient-to-r from-blue-400 via-indigo-500 to-violet-600 bg-clip-text text-transparent mb-6">
                        Choose Your Plan
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Scale your organization with plans designed for growth and efficiency.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 hover:border-slate-600 transition-all group overflow-hidden ${plan.recommended ? 'ring-2 ring-violet-500 shadow-2xl shadow-violet-500/20 scale-105 z-10' : 'hover:scale-105 z-0'}`}
                        >
                            {plan.recommended && (
                                <div className="absolute top-0 right-0 bg-violet-600 text-white text-xs font-bold px-4 py-1.5 rounded-bl-2xl uppercase tracking-wider">
                                    Most Popular
                                </div>
                            )}

                            {/* Glow Effect */}
                            <div className={`absolute -inset-1 bg-gradient-to-br ${plan.color} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500`} />

                            <h3 className="text-2xl font-bold text-white mb-2">{plan.title}</h3>
                            <div className="flex items-baseline mb-6">
                                <span className="text-5xl font-black">{plan.price}</span>
                                <span className="text-slate-500 ml-2 font-medium">{plan.period}</span>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center text-slate-300">
                                        <svg className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg ${plan.recommended
                                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:shadow-violet-500/25 hover:from-violet-500 hover:to-purple-500'
                                    : 'bg-slate-800 text-white hover:bg-slate-700 hover:text-white border border-slate-700'
                                }`}>
                                Get Started
                            </button>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default Pricing;
