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
<<<<<<< HEAD
    tagTypes: ['User', 'Domain', 'Sidebar', 'Teacher'],
=======
    tagTypes: ['User', 'Domain', 'Sidebar', 'Students', 'Teachers'],
>>>>>>> 24cd85471c9f4a4dbd759da1753886c18c073ad1
    endpoints: (builder) => ({}),
});
