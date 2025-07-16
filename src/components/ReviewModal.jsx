import { useState } from 'react';
import { FaTimes, FaPlus } from 'react-icons/fa';
import { useGetReviewsQuery, useCreateReviewMutation } from '../api/apiSlice';
import { useSelector } from 'react-redux';
import RatingStars from './RatingStars';

const ReviewModal = ({ bookId, bookTitle, onClose }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  
  const { data: reviewsData, isLoading } = useGetReviewsQuery({ book: bookId });
  const [createReview, { isLoading: isCreating }] = useCreateReviewMutation();
  const user = useSelector(state => state.auth.user);
  
  const reviews = reviewsData?.results || reviewsData || [];
  const userHasReviewed = reviews.some(review => review.user === user?.username);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await createReview({
        book: bookId,
        rating,
        comment
      }).unwrap();
      setShowReviewForm(false);
      setComment('');
      setRating(5);
    } catch (err) {
      console.error('Failed to create review:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-900">
            Reviews for "{bookTitle}"
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-lg font-semibold text-gray-900">
              Reviews ({Array.isArray(reviews) ? reviews.length : 0})
            </h4>
            {userHasReviewed ? (
              <div className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded">
                You have already rated this book
              </div>
            ) : (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="btn-primary flex items-center space-x-2"
              >
                <FaPlus />
                <span>Add Review</span>
              </button>
            )}
          </div>

          {showReviewForm && (
            <div className="card mb-6">
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <RatingStars
                    rating={rating}
                    onRatingChange={setRating}
                    size="text-xl"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comment
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Share your thoughts about this book..."
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="btn-primary disabled:opacity-50"
                  >
                    {isCreating ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading reviews...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Array.isArray(reviews) && reviews.map((review) => (
                <div key={review.id} className="card">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{review.user}</p>
                      <div className="flex items-center space-x-2">
                        <RatingStars rating={review.rating} readonly size="text-sm" />
                        <span className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-gray-700 mt-2">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {(!reviews || reviews.length === 0) && !isLoading && (
            <div className="text-center py-8 text-gray-500">
              No reviews yet. Be the first to review this book!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;