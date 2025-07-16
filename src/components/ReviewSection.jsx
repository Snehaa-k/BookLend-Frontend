import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useGetReviewsQuery, useCreateReviewMutation } from '../api/apiSlice';
import RatingStars from './RatingStars';

const ReviewSection = ({ bookId }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  
  const { data: reviewsData, isLoading } = useGetReviewsQuery({ book: bookId });
  const reviews = reviewsData?.results || reviewsData || [];
  const [createReview, { isLoading: isCreating }] = useCreateReviewMutation();

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



  if (isLoading) {
    return <div className="text-center py-4">Loading reviews...</div>;
  }

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold text-gray-900">
          Reviews ({Array.isArray(reviews) ? reviews.length : 0})
        </h4>
        <button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="btn-primary flex items-center space-x-2"
        >
          <FaPlus />
          <span>Add Review</span>
        </button>
      </div>

      {showReviewForm && (
        <div className="card mb-4">
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

      {(!reviews || reviews.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          No reviews yet. Be the first to review this book!
        </div>
      )}
    </div>
  );
};

export default ReviewSection;