import React from 'react';
import { useLikes } from '../context/LikeContext';
import './LikeButton.css';

const LikeButton = ({ property }) => {
  const { isLiked, likeProperty, unlikeProperty } = useLikes();

  const liked = isLiked(property.id);

  const handleLikeClick = (e) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    e.stopPropagation(); // Stop the event from bubbling up to the parent Link

    if (liked) {
      unlikeProperty(property.id);
    } else {
      likeProperty(property);
    }
  };

  return (
    <button 
      className={`like-button ${liked ? 'liked' : ''}`}
      onClick={handleLikeClick}
      aria-label={liked ? 'Unlike this property' : 'Like this property'}
    >
      <svg 
        className="heart-icon"
        viewBox="0 0 24 24"
        fill={liked ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </button>
  );
};

export default LikeButton;
