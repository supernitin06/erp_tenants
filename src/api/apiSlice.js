import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import toast from 'react-hot-toast';
import { API_BASE_URL, getAuthToken } from './config';

// Backend URL comes from api/config.js (Render in production, .env locally)
const baseQuery = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers) => {
        const token = getAuthToken();
        if (token) headers.set('authorization', `Bearer ${token}`);
        return headers;
    },
});

const baseQueryWithToast = async (args, api, extraOptions) => {
    // Determine if we should show toasts
    // Show loading/success only for mutations (non-GET)
    // Show error for everything

    const method = args.method || 'GET';
    const isMutation = method !== 'GET';
    // Session checks must stay silent (a 401 there just means "not logged in")
    const silent = args.url === 'auth/me' || api.endpoint === 'verifySession';

    let toastId;
    if (isMutation) {
        toastId = toast.loading('Processing...');
    }

    try {
        const result = await baseQuery(args, api, extraOptions);

        if (result.error) {
            // Handle error
            const errorMessage =
                result.error.data?.message ||
                result.error.error ||
                'Something went wrong';

            if (isMutation) {
                toast.error(errorMessage, { id: toastId });
            } else if (!silent) {
                toast.error(errorMessage);
            }
        } else if (isMutation) {
            // Handle success for mutations
            const successMessage = result.data?.message || 'Operation successful';
            toast.success(successMessage, { id: toastId });
        }

        return result;
    } catch (error) {
        const errorMessage = error.message || 'Network error';
        if (isMutation) {
            toast.error(errorMessage, { id: toastId });
        } else {
            toast.error(errorMessage);
        }
        return { error: { status: 'CUSTOM_ERROR', error: errorMessage } };
    }
};

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithToast,
    tagTypes: ['User', 'Domain', 'Sidebar', 'Students', 'Teachers', 'Examination', 'Class', 'Library', 'Books', 'Subscription', 'TenantRoles', 'TenantPermissions', 'TenantStaff', 'TenantUsers'],
    endpoints: (builder) => ({}),
});
