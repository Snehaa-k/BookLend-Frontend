import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useCreateReviewMutation, useGetReviewsQuery } from '../api/apiSlice';
import { useSelector } from 'react-redux';
import RatingStars from './RatingStars';

const QuickRating = ({ bookId, bookTitle, onClose }) => {
  const [createReview, { isLoading }] = useCreateReviewMutation();
  const { data: reviewsData } = useGetReviewsQuery({ book: bookId });
  const user = useSelector(state => state.auth.user);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  
  const reviews = reviewsData?.results || reviewsData || [];
  const userHasReviewed = reviews.some(review => review.user === user?.username);
  
  if (userHasReviewed) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Already Rated</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <FaTimes />
            </button>
          </div>
          <p className="text-gray-600 mb-4">
            You have already rated "{bookTitle}". Each user can only rate a book once.
          </p>
          <button onClick={onClose} className="w-full btn-primary">
            OK
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createReview({
        book: bookId,
        rating,
        comment
      }).unwrap();
      onClose();
    } catch (err) {
      console.error('Failed to submit rating:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Rate "{bookTitle}"</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Rating
            </label>
            <RatingStars
              rating={rating}
              onRatingChange={setRating}
              size="text-2xl"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comment (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Share your thoughts about this book..."
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary disabled:opacity-50"
            >
              {isLoading ? 'Submitting...' : 'Submit Rating'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickRating;