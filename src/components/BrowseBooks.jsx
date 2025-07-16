import { useState } from 'react';
import BookCard from './BookCard';
import FilterBar from './FilterBar';
import { useGetBooksQuery, useGetGenresQuery, useBorrowBookMutation, useReturnBookMutation, useGetUserBorrowStatusQuery, useGetRecommendationsQuery } from '../api/apiSlice';

const BrowseBooks = () => {
  const [filters, setFilters] = useState({
    search: '',
    genre: '',
    author: '',
    available: ''
  });

  const { data: booksData, isLoading, error } = useGetBooksQuery({
    search: filters.search,
    genre__name: filters.genre,
    author: filters.author,
    available: filters.available
  });
  
  const { data: genresData } = useGetGenresQuery();
  const { data: borrowedBookIds = [] } = useGetUserBorrowStatusQuery();
  const { data: recommendationsData } = useGetRecommendationsQuery();
  const [borrowBook] = useBorrowBookMutation();
  const [returnBook] = useReturnBookMutation();
  
  const recommendedBooks = recommendationsData?.books || [];

  const books = booksData?.results || [];
  const genres = genresData || [];

  console.log('All Books Data:', books);
  console.log('Recommendations Data:', recommendationsData);
  console.log('Recommended Books Array:', recommendedBooks);
  console.log('Recommendations Length:', recommendedBooks.length);

  const handleBorrowToggle = async (bookId) => {
    try {
      if (borrowedBookIds.includes(bookId)) {
        await returnBook(bookId).unwrap();
      } else {
        await borrowBook(bookId).unwrap();
      }
    } catch (err) {
      console.error('Failed to toggle borrow status:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Loading books...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">Error loading books</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Browse Books</h2>
        <p className="text-gray-600">Discover your next great read</p>
      </div>

      <FilterBar filters={filters} setFilters={setFilters} genres={genres} />

      <h3 className="text-xl font-semibold text-gray-900 mb-4">All Books</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map(book => {
          const isBorrowedByUser = borrowedBookIds.includes(book.id);
          return (
            <BookCard
              key={book.id}
              book={{
                ...book,
                genre: book.genre_name || book.genre?.name || 'Unknown',
                isBorrowedByUser
              }}
              onBorrow={handleBorrowToggle}
            />
          );
        })}
      </div>

      {books.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No books found matching your criteria.</p>
        </div>
      )}

      <div className="mt-12">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Recommended for You</h3>
        <p className="text-gray-600 mb-6">
          {recommendationsData?.message || 'Based on your reading history and popular books'}
        </p>
        {recommendedBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recommendedBooks.map(book => {
              const isBorrowedByUser = borrowedBookIds.includes(book.id);
              return (
                <BookCard
                  key={book.id}
                  book={{
                    ...book,
                    genre: book.genre?.name || book.genre_name || 'Unknown',
                    isBorrowedByUser
                  }}
                  onBorrow={handleBorrowToggle}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No recommendations available. Borrow some books to get personalized suggestions!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseBooks;