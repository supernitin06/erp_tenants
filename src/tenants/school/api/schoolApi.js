import { apiSlice } from '../../../api/apiSlice';

export const schoolApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTeachers: builder.query({
            query: (tenantName) => `tenant/${tenantName}/teachers/list`,
            providesTags: ['Teacher'],
            transformResponse: (response) => response?.teachers || [],
        }),
        getTeacher: builder.query({
            query: ({ tenantName, id }) => `tenant/${tenantName}/teachers/details/${id}`,
            providesTags: (result, error, arg) => [{ type: 'Teacher', id: arg.id }],
        }),
        createTeacher: builder.mutation({
            query: ({ tenantName, data }) => ({
                url: `tenant/${tenantName}/teachers/create`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Teacher'],
        }),
        updateTeacher: builder.mutation({
            query: ({ tenantName, id, data }) => ({
                url: `tenant/${tenantName}/teachers/update/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Teacher'],
        }),
        deleteTeacher: builder.mutation({
            query: ({ tenantName, id }) => ({
                url: `tenant/${tenantName}/teachers/delete/${id}`,
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