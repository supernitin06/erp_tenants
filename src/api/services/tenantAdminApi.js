import { apiSlice } from '../apiSlice';

/**
 * Organisation administration: roles, permissions, staff and users.
 * Every call is scoped to the organisation in the URL (`t` = tenant username).
 * Backend: Multitenant/src/modules/admin/tenantaction/tenant.routes.js
 */
export const tenantAdminApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // ── Roles ────────────────────────────────────────────────────────────
        getTenantRoles: builder.query({
            query: (t) => `tenant/${t}/roles`,
            providesTags: ['TenantRoles'],
        }),
        createTenantRole: builder.mutation({
            query: ({ t, ...body }) => ({ url: `tenant/${t}/roles`, method: 'POST', body }),
            invalidatesTags: ['TenantRoles'],
        }),
        updateTenantRole: builder.mutation({
            query: ({ t, id, ...body }) => ({ url: `tenant/${t}/roles/${id}`, method: 'PUT', body }),
            invalidatesTags: ['TenantRoles', 'TenantStaff', 'TenantUsers'],
        }),
        deleteTenantRole: builder.mutation({
            query: ({ t, id }) => ({ url: `tenant/${t}/roles/${id}`, method: 'DELETE' }),
            invalidatesTags: ['TenantRoles'],
        }),

        // ── Permissions ──────────────────────────────────────────────────────
        getTenantPermissions: builder.query({
            query: (t) => `tenant/${t}/permissions`,
            providesTags: ['TenantPermissions'],
        }),
        setRolePermissions: builder.mutation({
            query: ({ t, roleId, permissions }) => ({
                url: `tenant/${t}/permissions/assign/${roleId}`,
                method: 'POST',
                body: { permissions },
            }),
            invalidatesTags: ['TenantRoles'],
        }),

        // ── Staff ────────────────────────────────────────────────────────────
        getTenantStaff: builder.query({
            query: (t) => `tenant/${t}/management-staff`,
            providesTags: ['TenantStaff'],
        }),
        createTenantStaff: builder.mutation({
            query: ({ t, ...body }) => ({ url: `tenant/${t}/management-staff/register`, method: 'POST', body }),
            invalidatesTags: ['TenantStaff', 'TenantRoles'],
        }),
        updateTenantStaff: builder.mutation({
            query: ({ t, id, ...body }) => ({ url: `tenant/${t}/management-staff/${id}`, method: 'PATCH', body }),
            invalidatesTags: ['TenantStaff', 'TenantRoles'],
        }),
        deleteTenantStaff: builder.mutation({
            query: ({ t, id }) => ({ url: `tenant/${t}/management-staff/${id}`, method: 'DELETE' }),
            invalidatesTags: ['TenantStaff', 'TenantRoles'],
        }),

        // ── Users ────────────────────────────────────────────────────────────
        getTenantUsers: builder.query({
            query: (t) => `tenant/${t}/users`,
            providesTags: ['TenantUsers'],
        }),
        createTenantUser: builder.mutation({
            query: ({ t, ...body }) => ({ url: `tenant/${t}/users/create`, method: 'POST', body }),
            invalidatesTags: ['TenantUsers', 'TenantRoles'],
        }),
        updateTenantUser: builder.mutation({
            query: ({ t, id, ...body }) => ({ url: `tenant/${t}/users/update/${id}`, method: 'PUT', body }),
            invalidatesTags: ['TenantUsers', 'TenantRoles'],
        }),
        deactivateTenantUser: builder.mutation({
            query: ({ t, id }) => ({ url: `tenant/${t}/users/delete/${id}`, method: 'DELETE' }),
            invalidatesTags: ['TenantUsers'],
        }),
        restoreTenantUser: builder.mutation({
            query: ({ t, id }) => ({ url: `tenant/${t}/users/restore/${id}`, method: 'PUT' }),
            invalidatesTags: ['TenantUsers'],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetTenantRolesQuery,
    useCreateTenantRoleMutation,
    useUpdateTenantRoleMutation,
    useDeleteTenantRoleMutation,
    useGetTenantPermissionsQuery,
    useSetRolePermissionsMutation,
    useGetTenantStaffQuery,
    useCreateTenantStaffMutation,
    useUpdateTenantStaffMutation,
    useDeleteTenantStaffMutation,
    useGetTenantUsersQuery,
    useCreateTenantUserMutation,
    useUpdateTenantUserMutation,
    useDeactivateTenantUserMutation,
    useRestoreTenantUserMutation,
} = tenantAdminApi;
