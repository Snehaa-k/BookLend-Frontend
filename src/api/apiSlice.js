import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://booklend-backend-1.onrender.com',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Book', 'Borrow', 'User', 'Genre', 'Review'],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation({
      query: (credentials) => ({
        url: 'login/',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: 'register/',
        method: 'POST',
        body: userData,
      }),
    }),

    // Books endpoints
    getBooks: builder.query({
      query: (params = {}) => ({
        url: 'books/',
        params,
      }),
      providesTags: ['Book'],
    }),
    getBook: builder.query({
      query: (id) => `books/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Book', id }],
    }),
    borrowBook: builder.mutation({
      query: (id) => ({
        url: `books/${id}/borrow/`,
        method: 'POST',
      }),
      invalidatesTags: ['Book', 'Borrow'],
    }),
    returnBook: builder.mutation({
      query: (id) => ({
        url: `books/${id}/return_book/`,
        method: 'POST',
      }),
      invalidatesTags: ['Book', 'Borrow'],
    }),
    getRecommendations: builder.query({
      query: () => 'books/recommendations/',
      providesTags: ['Book'],
    }),

    // Borrows endpoints
    getBorrowedBooks: builder.query({
      query: (params = {}) => ({
        url: 'borrows/',
        params: { returned: false, page_size: 100, ...params },
      }),
      providesTags: ['Borrow'],
      transformResponse: (response) => {
        return response.results || response || [];
      },
    }),
    getBorrowHistory: builder.query({
      query: () => 'borrows/history/',
      providesTags: ['Borrow'],
    }),

    // Genres endpoints
    getGenres: builder.query({
      query: () => 'genres/',
      providesTags: ['Genre'],
    }),

    // User profile endpoints
    getUserStats: builder.query({
      query: () => 'profile/stats/',
      providesTags: ['User'],
    }),
    getUserBorrowStatus: builder.query({
      query: () => 'borrows/?returned=false&page_size=100',
      providesTags: ['Borrow'],
      transformResponse: (response) => {
        if (!response) return [];
        const results = response.results || response;
        if (!Array.isArray(results)) return [];
        const borrowedBookIds = results.map(borrow => borrow.book.id);
        return borrowedBookIds;
      },
    }),

    // Admin endpoints
    createBook: builder.mutation({
      query: (bookData) => ({
        url: 'books/',
        method: 'POST',
        body: bookData,
      }),
      invalidatesTags: ['Book'],
    }),
    updateBook: builder.mutation({
      query: ({ id, ...bookData }) => ({
        url: `books/${id}/`,
        method: 'PUT',
        body: bookData,
      }),
      invalidatesTags: ['Book'],
    }),
    deleteBook: builder.mutation({
      query: (id) => ({
        url: `books/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Book'],
    }),
    createGenre: builder.mutation({
      query: (genreData) => ({
        url: 'genres/',
        method: 'POST',
        body: genreData,
      }),
      invalidatesTags: ['Genre'],
    }),
    updateGenre: builder.mutation({
      query: ({ id, ...genreData }) => ({
        url: `genres/${id}/`,
        method: 'PUT',
        body: genreData,
      }),
      invalidatesTags: ['Genre'],
    }),
    deleteGenre: builder.mutation({
      query: (id) => ({
        url: `genres/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Genre'],
    }),

    // Reviews endpoints
    createReview: builder.mutation({
      query: (reviewData) => ({
        url: 'reviews/',
        method: 'POST',
        body: reviewData,
      }),
      invalidatesTags: ['Review', 'Book'],
    }),
    getReviews: builder.query({
      query: (params = {}) => ({
        url: 'reviews/',
        params,
      }),
      providesTags: ['Review'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetBooksQuery,
  useGetBookQuery,
  useBorrowBookMutation,
  useReturnBookMutation,
  useGetRecommendationsQuery,
  useGetBorrowedBooksQuery,
  useGetBorrowHistoryQuery,
  useGetGenresQuery,
  useGetUserStatsQuery,
  useGetUserBorrowStatusQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useCreateGenreMutation,
  useUpdateGenreMutation,
  useDeleteGenreMutation,
  useCreateReviewMutation,
  useGetReviewsQuery,
} = apiSlice;