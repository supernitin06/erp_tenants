import React, { createContext, useContext, useState, useEffect } from 'react';
import { useVerifySessionQuery } from '../../api/services/authapi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [tenantName, setTenantName] = useState(localStorage.getItem('tenantName') || null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [planId, setPlanId] = useState(localStorage.getItem('planId') || null);

    // Verify session on mount or token change
    const { data: verifiedUser, isSuccess } = useVerifySessionQuery(undefined, {
        skip: !token, // Only run if we have a token (or change logic if needed)
    });

    useEffect(() => {
        if (isSuccess && verifiedUser) {
            // Update state with fresh data from backend
            setUser(verifiedUser.user || verifiedUser); // Adjust based on backend response shape
            // If response includes updated tenantName/planId, update those too
            if (verifiedUser.tenantName) setTenantName(verifiedUser.tenantName);
            if (verifiedUser.planId) setPlanId(verifiedUser.planId);
        }
    }, [isSuccess, verifiedUser]);

    const login = (userData) => {
        setUser(userData.user);
        setTenantName(userData.tenantName);
        setToken(userData.token);
        setPlanId(userData.planId);

        localStorage.setItem('user', JSON.stringify(userData.user)); // Persist user
        localStorage.setItem('token', userData.token);
        localStorage.setItem('tenantName', userData.tenantName);
        localStorage.setItem('planId', userData.planId);
    };

    const logout = () => {
        setUser(null);
        setTenantName(null);
        setToken(null);
        setPlanId(null);

        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('tenantName');
        localStorage.removeItem('planId');
    };

    return (
        <AuthContext.Provider value={{ user, tenantName, token, planId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
