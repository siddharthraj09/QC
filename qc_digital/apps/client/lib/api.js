import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/api" }), // Adjust base URL
  endpoints: (builder) => ({
    getCrops: builder.query({
      query: () => "/crops",
    }),
    analyzeImage: builder.mutation({
      query: (formData) => ({
        url: "/analyze-image",
        method: "POST",
        body: formData,
      }),
    }),
    // Add an endpoint for fetching reports here
  }),
});

export const { useGetCropsQuery, useAnalyzeImageMutation } = apiSlice;
