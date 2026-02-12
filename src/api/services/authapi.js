import { apiSlice } from "../apiSlice";

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/auth/tenant/login',
                method: 'POST',
                body: {
                    tenantUsername: credentials.tenantUsername,
                    password: credentials.password
                },
            }),
        }),
        getTenantInfo: builder.query({
            query: () => '/auth/tenant-info',
        }),
    }),
});

export const { useLoginMutation, useGetTenantInfoQuery } = authApi;
