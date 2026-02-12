import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: localStorage.getItem('token') || null,
        tenantName: localStorage.getItem('tenantName') || null,
    },
    reducers: {
        setCredentials: (state, action) => {
            const { user, token, tenantName } = action.payload;
            state.user = user;
            state.token = token;
            state.tenantName = tenantName;
            localStorage.setItem('token', token);
            localStorage.setItem('tenantName', tenantName);
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.tenantName = null;
            localStorage.removeItem('token');
            localStorage.removeItem('tenantName');
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectCurrentTenant = (state) => state.auth.tenantName;
