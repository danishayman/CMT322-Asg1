"use client";

import { useState } from "react";
import { FaStar } from "react-icons/fa"; // install with `npm i react-icons`

interface StarRatingProps {
  name?: string;
  value?: number;
  onChange?: (value: number) => void;
  max?: number;
}

export default function StarRating({
  name,
  value = 0,
  onChange,
  max = 5,
}: StarRatingProps) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex space-x-1">
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
        <button
          type="button"
          key={star}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="focus:outline-none"
        >
          <FaStar
            size={24}
            className={`cursor-pointer transition-colors ${
              star <= (hover || value) ? "text-yellow-400" : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
export {StarRating}
