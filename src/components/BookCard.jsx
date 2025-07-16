import { useState } from 'react';
import { FaUser, FaTag, FaEye, FaComment } from 'react-icons/fa';
import ReviewModal from './ReviewModal';
import RatingStars from './RatingStars';

const BookCard = ({ book, onBorrow, onReturn, showReturnButton = false }) => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
  
  // Check if image is already a full URL or just a path
  const getImageUrl = (imageField) => {
    if (!imageField) return null;
    if (imageField.startsWith('http')) return imageField;
    return `${backendUrl}${imageField}`;
  };
  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex flex-col h-full">
        {book.image ? (
          <img
            src={getImageUrl(book.image)}
            alt={book.title}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
            <span className="text-gray-500 text-sm">No Image</span>
          </div>
        )}
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{book.title}</h3>
          
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <FaUser className="mr-1" />
            <span>{book.author}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <FaTag className="mr-1" />
            <span>{book.genre}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <div className="flex items-center">
              <FaEye className="mr-1" />
              <span>Read {book.read_count || book.readCount || '0'} times</span>
            </div>
            {book.average_rating > 0 && (
              <RatingStars rating={book.average_rating} readonly size="text-sm" />
            )}
          </div>
          
          {book.description && (
            <div className="text-sm text-gray-700 mb-4">
              {book.description.length > 100 ? (
                <>
                  <p>
                    {showFullDescription 
                      ? book.description 
                      : `${book.description.substring(0, 100)}...`
                    }
                  </p>
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-primary-600 hover:text-primary-800 text-xs mt-1"
                  >
                    {showFullDescription ? 'Read less' : 'Read more'}
                  </button>
                </>
              ) : (
                <p>{book.description}</p>
              )}
            </div>
          )}
        </div>
        
        <div className="mt-auto space-y-2">
          {showReturnButton ? (
            <div className="space-y-2">
              <div className="text-xs text-gray-500">
                <p>Borrowed: {new Date(book.borrowedDate).toLocaleDateString()}</p>
                <p>Due: {new Date(book.dueDate).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => onReturn(book.id)}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Return Book
              </button>
            </div>
          ) : (
            <button
              onClick={() => onBorrow(book.id)}
              disabled={!book.available && !book.isBorrowedByUser}
              className={`w-full font-medium py-2 px-4 rounded-lg transition-colors ${
                book.isBorrowedByUser
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : book.available
                  ? 'btn-primary'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {book.isBorrowedByUser 
                ? 'Return Book' 
                : book.available 
                ? 'Borrow Book' 
                : 'Not Available'
              }
            </button>
          )}
          
          <button
            onClick={() => setShowReviewModal(true)}
            className="w-full btn-secondary flex items-center justify-center space-x-2"
          >
            <FaComment />
            <span>View Reviews</span>
          </button>
        </div>
        
        {showReviewModal && (
          <ReviewModal
            bookId={book.id}
            bookTitle={book.title}
            onClose={() => setShowReviewModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default BookCard;