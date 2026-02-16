import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://bt-erp-backend-edww.onrender.com/api/v1', // Adjust this based on your backend URL
        credentials: 'include',
    }),
    tagTypes: ['User', 'Domain', 'Sidebar', 'Students', 'Teachers'],
    endpoints: (builder) => ({}),
});
