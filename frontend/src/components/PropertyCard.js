import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function PropertyCard({ property }) {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleLike = (e) => {
    e.preventDefault();
    setIsLiked(!isLiked);
  };

  return (
    <div className="property-card">
      <div className="property-image-container">
        <img 
          src={property.image} 
          alt={property.title}
          onLoad={() => setImageLoaded(true)}
          className={`property-image ${imageLoaded ? 'loaded' : ''}`}
        />
        
        {/* Price Badge */}
        <div className="price-badge">
          {formatPrice(property.price)}
        </div>
        
        {/* Favorite Button */}
        <button 
          className={`favorite-btn ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
          aria-label="Add to favorites"
        >
          {isLiked ? '❤️' : '🤍'}
        </button>
        
        {/* Property Status */}
        <div className="status-badge">For Sale</div>
      </div>
      
      <div className="property-content">
        <div className="property-header">
          <h3 className="property-title">{property.title}</h3>
          <p className="property-location">📍 {property.location}</p>
        </div>
        
        {/* Quick Stats */}
        <div className="property-stats">
          <span className="stat">🛏️ {property.bedrooms}</span>
          <span className="stat">🚿 {property.bathrooms}</span>
          <span className="stat">📐 {property.sqft} sqft</span>
        </div>
        
        {/* Key Features */}
        <div className="property-tags">
          {property.features.slice(0, 3).map((feature, index) => (
            <span key={index} className="feature-tag">{feature}</span>
          ))}
        </div>
        
        {/* Description Preview */}
        <p className="property-preview">
          {property.description.substring(0, 80)}...
        </p>
        
        {/* Agent Info */}
        <div className="agent-preview">
          <div className="agent-avatar">👤</div>
          <span className="agent-name">{property.agent}</span>
        </div>
        
        {/* Action Buttons */}
        <div className="property-actions">
          <Link to={`/property/${property.id}`} className="btn-primary">
            View Details
          </Link>
          <button className="btn-secondary">
            📞 Call Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default PropertyCard;