import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { authApi } from '../../api/services/authapi';
import { apiSlice } from '../../api/apiSlice';

/**
 * Tenant-side session.
 *
 * Who can log in here:
 *  - TENANT        → the organisation admin account (full access inside the organisation)
 *  - TENANT_STAFF  → a staff member; access comes from their role's permissions
 *  - USER          → a user (e.g. a student); access comes from their role's permissions
 *
 * The backend returns the same shape from every login and from GET /auth/me:
 *  { id, type, name, email, role, roleId, power, permissions: ["*"] | ["READ_STUDENT", ...],
 *    tenantId, tenantName, tenantUsername, tenantType, isActive, subscription_planId, ... }
 */
const AuthContext = createContext();

const STORAGE_KEY = 'user';

const readStoredUser = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const dispatch = useDispatch();
    const [user, setUser] = useState(readStoredUser);
    const [loading, setLoading] = useState(!!readStoredUser());

    const storeUser = useCallback((next) => {
        setUser(next);
        if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        else localStorage.removeItem(STORAGE_KEY);
        // legacy keys from the previous version of this context
        localStorage.removeItem('tenantName');
        localStorage.removeItem('planId');
    }, []);

    // Re-load the session from the server (fresh plan, role and permissions)
    const refreshSession = useCallback(async () => {
        const result = await dispatch(
            authApi.endpoints.verifySession.initiate(undefined, { forceRefetch: true, subscribe: false })
        );
        if (result.data?.user) {
            storeUser(result.data.user);
            return result.data.user;
        }
        if (result.error?.status === 401 || result.error?.status === 403) {
            storeUser(null);
        }
        return null;
    }, [dispatch, storeUser]);

    useEffect(() => {
        if (!readStoredUser()) return;
        refreshSession().finally(() => setLoading(false));
    }, [refreshSession]);

    // Coming back to the tab → pick up plan / role / permission changes made meanwhile
    useEffect(() => {
        const onFocus = () => { if (readStoredUser()) refreshSession(); };
        window.addEventListener('focus', onFocus);
        return () => window.removeEventListener('focus', onFocus);
    }, [refreshSession]);

    const login = useCallback((sessionUser) => {
        const u = sessionUser?.user || sessionUser;
        storeUser(u);
    }, [storeUser]);

    const updateUser = useCallback((patch) => {
        setUser((prev) => {
            const next = { ...(prev || {}), ...patch };
            if (patch.tenant) {
                Object.assign(next, patch.tenant);
            }
            storeUser(next);
            return next;
        });
    }, [storeUser]);

    const logout = useCallback(async () => {
        storeUser(null);
        try {
            await dispatch(authApi.endpoints.logout.initiate()).unwrap();
        } catch {
            /* local session is already cleared */
        }
        dispatch(apiSlice.util.resetApiState());
    }, [dispatch, storeUser]);

    /** hasPermission("READ_STUDENT") or hasPermission(["A", "B"]) → true if any is granted */
    const hasPermission = useCallback((keys) => {
        if (!keys) return true;
        const perms = user?.permissions || [];
        if (perms.includes('*')) return true;
        const list = Array.isArray(keys) ? keys : [keys];
        return list.some((k) => perms.includes(k));
    }, [user]);

    const isTenantAdmin = user?.type === 'TENANT';
    const tenantSlug = user?.tenantUsername || user?.tenantName || null;

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                updateUser,
                refreshSession,
                hasPermission,
                isTenantAdmin,
                tenantSlug,
                // kept for older components
                tenantName: tenantSlug,
                planId: user?.subscription_planId || null,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
