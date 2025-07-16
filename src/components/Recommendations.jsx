import BookCard from './BookCard';
import { useGetRecommendationsQuery, useBorrowBookMutation, useReturnBookMutation, useGetUserStatsQuery, useGetUserBorrowStatusQuery } from '../api/apiSlice';

const Recommendations = () => {
  const { data: recommendationsData, isLoading, error } = useGetRecommendationsQuery();
  const { data: userStats } = useGetUserStatsQuery();
  const { data: borrowedBookIds = [] } = useGetUserBorrowStatusQuery();
  const [borrowBook] = useBorrowBookMutation();
  const [returnBook] = useReturnBookMutation();

  const recommendedBooks = recommendationsData?.books || [];
  const favoriteGenres = userStats?.favorite_genres || [];

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
          <p className="text-gray-500 text-lg">Loading recommendations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">Error loading recommendations</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Recommended for You</h2>
        <p className="text-gray-600">
          {recommendationsData?.message || 'Discover your next great read'}
        </p>
      </div>

      {favoriteGenres.length > 0 && (
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Reading Preferences</h3>
          <div className="flex flex-wrap gap-2">
            {favoriteGenres.map(genre => (
              <span
                key={genre.book__genre__name}
                className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
              >
                {genre.book__genre__name} ({genre.count})
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {recommendedBooks.map(book => {
          const isBorrowedByUser = borrowedBookIds.includes(book.id);
          return (
            <BookCard
              key={book.id}
              book={{
                ...book,
                genre: book.genre?.name || 'Unknown',
                cover: `https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop&sig=${book.id}`,
                isBorrowedByUser
              }}
              onBorrow={handleBorrowToggle}
            />
          );
        })}
      </div>

      {recommendedBooks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No recommendations available at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default Recommendations;