import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authcontext';

const FullScreenMessage = ({ title, children }) => (
    <div className="flex flex-col items-center justify-center min-h-screen gap-3 bg-slate-50 dark:bg-slate-900 text-center px-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{title}</h1>
        <div className="text-slate-500 dark:text-slate-400 max-w-md">{children}</div>
    </div>
);

/**
 * 1. Not logged in                → /login
 * 2. URL belongs to another org   → back to the user's own organisation
 * 3. Organisation has no active plan:
 *      - organisation admin → pricing page (only the admin can buy a plan)
 *      - staff / users      → explanation screen
 */
const ProtectedRoute = () => {
    const { user, loading, isTenantAdmin, tenantSlug, logout } = useAuth();
    const location = useLocation();
    // First URL segment is the organisation (e.g. /demo-school/...)
    const tenantName = decodeURIComponent(location.pathname.split('/')[1] || '');

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-900">
                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    if (tenantName && tenantSlug && tenantName.toLowerCase() !== tenantSlug.toLowerCase()) {
        return <Navigate to={`/${tenantSlug}`} replace />;
    }

    const hasActivePlan = !!(user.subscription_planId && user.isActive);
    const isPricingFlow = ['/pricing', '/checkout', '/payment', '/plan-history']
        .some((p) => location.pathname.includes(p));

    if (!hasActivePlan && !isPricingFlow) {
        if (isTenantAdmin) {
            return <Navigate to={`/${tenantSlug}/pricing`} replace />;
        }
        return (
            <FullScreenMessage title="Your organisation is not active yet">
                <p>Your organisation does not have an active subscription plan. Please ask your organisation admin to activate one.</p>
                <button onClick={logout} className="mt-4 px-5 py-2 rounded-lg bg-emerald-600 text-white font-semibold">
                    Log out
                </button>
            </FullScreenMessage>
        );
    }

    return <Outlet />;
};

/**
 * Wrap a page that needs a specific tenant permission.
 * <RequirePermission permission="VIEW_TENANT_STAFF"><StaffPage /></RequirePermission>
 */
export const RequirePermission = ({ permission, children }) => {
    const { hasPermission, user } = useAuth();
    if (hasPermission(permission)) return children;
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-2">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">You don't have access to this page</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-md">
                Your role ({user?.role || 'no role'}) needs the <code className="text-emerald-600">{permission}</code> permission.
                Ask your organisation admin to grant it under Roles &amp; Permissions.
            </p>
        </div>
    );
};

export default ProtectedRoute;
