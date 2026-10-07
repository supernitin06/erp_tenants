import { apiSlice } from "../apiSlice";

export const domainApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Feature domains (and features) included in the logged-in tenant's plan
        // planId is only part of the cache key, so a plan change triggers a refetch
        getdomain: builder.query({
            query: ({ tenantSlug }) => `tenant/${tenantSlug}/plan/domains`,
            providesTags: ['Domain'],
        }),

    }),
});

export const { useGetdomainQuery } = domainApi;
