import { apiSlice } from '../apiSlice';

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: 'auth/tenant/login',
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
                url: 'auth/tenant/me',
                method: 'GET',
            }),
        }),
    }),
});

export const { useLoginMutation, useRegisterTenantMutation, useVerifySessionQuery } = authApi;