import { apiSlice } from '../apiSlice';

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Organisation admin: { tenantUsername, password }
        login: builder.mutation({
            query: (credentials) => ({
                url: 'auth/tenant/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        // Staff member or user of an organisation: { tenantSlug, email, password }
        memberLogin: builder.mutation({
            query: ({ tenantSlug, ...credentials }) => ({
                url: `tenant/${encodeURIComponent(tenantSlug)}/login`,
                method: 'POST',
                body: credentials,
            }),
        }),
        registerTenant: builder.mutation({
            query: (data) => ({
                url: 'auth/tenant/register',
                method: 'POST',
                body: data,
            }),
        }),
        verifySession: builder.query({
            query: () => ({
                url: 'auth/me',
                method: 'GET',
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: 'auth/logout',
                method: 'POST',
            }),
        }),
    }),
});

export const { useLoginMutation, useMemberLoginMutation, useRegisterTenantMutation, useVerifySessionQuery, useLogoutMutation } = authApi;