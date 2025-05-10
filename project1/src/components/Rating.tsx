import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingProps {
  onSubmit: (rating: number) => void;
}

const Rating: React.FC<RatingProps> = ({ onSubmit }) => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(rating);
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center p-4 bg-green-50 rounded-lg">
        <p className="text-green-600 font-medium">Thank you for your rating!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4 bg-white/50 backdrop-blur-sm rounded-lg shadow-sm">
      <p className="text-gray-700 font-medium">Rate this site!</p>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            onClick={() => setRating(value)}
            onMouseEnter={() => setHoveredRating(value)}
            onMouseLeave={() => setHoveredRating(0)}
            className="transition-transform hover:scale-110"
          >
            <Star
              size={24}
              className={`transition-colors ${
                value <= (hoveredRating || rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        disabled={rating === 0}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          rating > 0
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        Submit Rating
      </button>
    </div>
  );
};

export default Rating;