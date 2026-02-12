import { apiSlice } from "../../../api/apiSlice";

export const studentApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getStudents: builder.query({
            query: () => '/students',
            providesTags: ['Students'],
        }),
    }),
});



export const { useGetStudentsQuery } = studentApi;