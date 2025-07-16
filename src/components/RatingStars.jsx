import { FaStar } from 'react-icons/fa';

const RatingStars = ({ rating, onRatingChange, readonly = false, size = 'text-lg' }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center space-x-1">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onRatingChange && onRatingChange(star)}
          disabled={readonly}
          className={`${size} ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
        >
          <FaStar
            className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}
          />
        </button>
      ))}
      {readonly && rating > 0 && (
        <span className="ml-2 text-sm text-gray-600">
          {rating.toFixed(1)} ({Math.round((rating / 5) * 100)}%)
        </span>
      )}
    </div>
  );
};

export default RatingStars;