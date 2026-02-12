import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authcontext';
import { useLoginMutation } from '../../api/services/authapi';

const Login = () => {
    const [tenantUsername, setTenantUsername] = useState('BITMAX');
    const [password, setPassword] = useState('111111');
    const navigate = useNavigate();
    const { login: setAuthContext } = useAuth();
    const [loginApi, { isLoading }] = useLoginMutation();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            // Call the real API
            const response = await loginApi({ tenantUsername, password }).unwrap();

            const { token, tenant } = response;

            // On success, update context and navigate
            setAuthContext({
                user: tenant,
                token: token,
                tenantName: tenant.tenantUsername,
                planId: tenant.subscription_planId
            });

            // Redirect Logic based on Tenant Status
            const { is_plan_assigned, isActive, subscription_planId } = tenant;
            const tenantPath = tenant.tenantUsername;

            if (is_plan_assigned && !isActive) {
                // Plan assigned but inactive -> Plan History
                navigate(`/${tenantPath}/plan-history`);
            } else if (!is_plan_assigned && !isActive && !subscription_planId) {
                // No plan, inactive -> Pricing / Select Plan
                navigate(`/${tenantPath}/pricing`);
            } else {
                // Default / Active -> Dashboard
                navigate(`/${tenantPath}`);
            }
        } catch (error) {
            console.error('Login failed:', error);
            alert(error?.data?.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#0B1120] relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 blur-[120px] rounded-full" />

            <div className="bg-slate-900/50 backdrop-blur-2xl p-10 rounded-3xl border border-slate-800 w-full max-w-md shadow-2xl relative z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex p-4 rounded-3xl bg-blue-600/11 border border-blue-500/20 mb-6 mx-auto">
                        <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent mb-2">
                        ERP Portal
                    </h1>
                    <p className="text-slate-500 text-sm font-medium uppercase tracking-widest text-center">
                        Secure Authentication
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-400 ml-1">Tenant Username</label>
                        <input
                            type="text"
                            value={tenantUsername}
                            onChange={(e) => setTenantUsername(e.target.value)}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                            placeholder="Organization name"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-400 ml-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="space-y-4 pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            {isLoading ? 'Verifying...' : 'Access Dashboard'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
