import { apiSlice } from '../../../api/apiSlice';

export const examApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        //  Get All Examinations
        // getExaminations: builder.query({
        //     query: (tenantName) => `tenant/${tenantName}/examination-portal`,
        //     providesTags: ['Examination'],
        //     transformResponse: (response) =>  response?.data || [],
        // }),
        getExaminations: builder.query({
            query: (tenantName) => ({
                url: `tenant/${tenantName}/examination-portal`,
                providesTags: ['Examination'],
            })
        }),

        //  Create Examination
        createExamination: builder.mutation({
            query: ({ tenantName, data }) => ({
                url: `tenant/${tenantName}/examination-portal`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Examination'],
        }),

        // Update Examination
        updateExamination: builder.mutation({
            query: ({ tenantName, id, data }) => ({
                url: `tenant/${tenantName}/examination-portal/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Examination'],
        }),

        // Delete Examination
        deleteExamination: builder.mutation({
            query: ({ tenantName, id }) => ({
                url: `tenant/${tenantName}/examination-portal/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Examination'],
        }),

    }),
});

export const {
    useGetExaminationsQuery,
    useCreateExaminationMutation,
    useUpdateExaminationMutation,
    useDeleteExaminationMutation,
} = examApi;
