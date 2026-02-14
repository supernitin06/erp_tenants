import { apiSlice } from '../../../api/apiSlice';

export const schoolApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTeachers: builder.query({
            query: (tenantName) => `tenant/${tenantName}/teachers`,
            providesTags: ['Teacher'],
            transformResponse: (response) => response?.data || response || [],
        }),
        getTeacher: builder.query({
            query: ({ tenantName, id }) => `tenant/${tenantName}/teachers/${id}`,
            providesTags: (result, error, arg) => [{ type: 'Teacher', id: arg.id }],
        }),
        createTeacher: builder.mutation({
            query: ({ tenantName, data }) => ({
                url: `tenant/${tenantName}/teachers`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Teacher'],
        }),
        updateTeacher: builder.mutation({
            query: ({ tenantName, id, data }) => ({
                url: `tenant/${tenantName}/teachers/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Teacher'],
        }),
        deleteTeacher: builder.mutation({
            query: ({ tenantName, id }) => ({
                url: `tenant/${tenantName}/teachers/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Teacher'],
        }),
    }),
});

export const {
    useGetTeachersQuery,
    useGetTeacherQuery,
    useCreateTeacherMutation,
    useUpdateTeacherMutation,
    useDeleteTeacherMutation,
} = schoolApi;