import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://bt-erp-backend-edww.onrender.com/api/v1', // Adjust this based on your backend URL
        credentials: 'include',
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token || localStorage.getItem('token');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['User', 'Domain', 'Sidebar', 'Teacher'],
    endpoints: (builder) => ({}),
});
