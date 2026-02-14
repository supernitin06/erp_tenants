import { apiSlice } from "../../../api/apiSlice";

export const studentApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        // ✅ Get Students
        getStudents: builder.query({
            query: (tenantName) =>
                `/tenant/${tenantName}/students/list`,
            providesTags: ['Students'],
        }),

        // ✅ Get Student Details
        getStudentDetails: builder.query({
            query: ({ tenantName, id }) =>
                `/tenant/${tenantName}/students/details/${id}`,
            providesTags: ['Students'],
        }),

        // ✅ Create Student
        createStudent: builder.mutation({
            query: ({ tenantName, data }) => ({
                url: `/tenant/${tenantName}/students/create`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Students'],
        }),

        // ✅ Update Student
        updateStudent: builder.mutation({
            query: ({ tenantName, id, data }) => ({
                url: `/tenant/${tenantName}/students/update/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Students'],
        }),

        // ✅ Delete Student
        deleteStudent: builder.mutation({
            query: ({ tenantName, id }) => ({
                url: `/tenant/${tenantName}/students/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Students'],
        }),

    }),
});

export const {
    useGetStudentsQuery,
    useGetStudentDetailsQuery,
    useCreateStudentMutation,
    useUpdateStudentMutation,
    useDeleteStudentMutation,
} = studentApi;
