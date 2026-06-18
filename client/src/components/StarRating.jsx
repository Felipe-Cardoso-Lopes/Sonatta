import React, { useState } from 'react';

function StarRating({ rating, setRating, readonly = false }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          className={`text-3xl transition-all duration-200 ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} 
            ${(hover || rating) >= star ? 'text-yellow-400' : 'text-gray-600'}`}
          onClick={() => !readonly && setRating(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default StarRating;