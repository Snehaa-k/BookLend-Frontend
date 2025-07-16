import { useState } from 'react';
import BookCard from './BookCard';
import QuickRating from './QuickRating';
import { useGetBorrowedBooksQuery, useReturnBookMutation } from '../api/apiSlice';

const BorrowedBooks = () => {
  const { data: borrowedBooks = [], isLoading, error } = useGetBorrowedBooksQuery();
  const [returnBook] = useReturnBookMutation();
  const [showRating, setShowRating] = useState(null);

  const handleReturn = async (bookId) => {
    try {
      await returnBook(bookId).unwrap();
    } catch (err) {
      console.error('Failed to return book:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Loading borrowed books...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">Error loading borrowed books</p>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">My Borrowed Books</h2>
        <p className="text-gray-600">Manage your current book loans</p>
      </div>

      {borrowedBooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {borrowedBooks.map(borrow => (
            <div key={borrow.id} className="space-y-2">
              <BookCard
                book={{
                  ...borrow.book,
                  id: borrow.book.id,
                  genre: borrow.book.genre?.name || 'Unknown',
                  borrowedDate: borrow.borrowed_on,
                  dueDate: new Date(new Date(borrow.borrowed_on).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()
                }}
                onReturn={handleReturn}
                showReturnButton={true}
              />
             
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="card max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No borrowed books</h3>
            <p className="text-gray-600 mb-4">You haven't borrowed any books yet.</p>
            <p className="text-sm text-gray-500">Browse our collection to find your next great read!</p>
          </div>
        </div>
      )}
      {showRating && (
        <QuickRating
          bookId={showRating.id}
          bookTitle={showRating.title}
          onClose={() => setShowRating(null)}
        />
      )}
    </div>
  );
};

export default BorrowedBooks;