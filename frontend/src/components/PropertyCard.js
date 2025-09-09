import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';

function PropertyCard({ property }) {
  const [isLiked, setIsLiked] = useState(false);
  const { language } = useContext(LanguageContext);

  // Exchange rate for demonstration purposes (1 USD = 4000 COP)
  const USD_TO_COP_RATE = 4000;

  const formatPrice = (price, currencyCode, locale) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getPriceDisplay = () => {
    // Handle both database format (pricePerNight) and frontend format (price_per_night)
    let price;
    if (property.type === 'rental') {
      price = property.pricePerNight || property.price_per_night || 450000; // Default fallback
    } else {
      price = property.price || 1200000000; // Default fallback for sale properties
    }

    let display = '';

    if (language === 'es') {
      display = formatPrice(price, 'COP', 'es-CO');
    } else { // language === 'en'
      const priceUSD = price / USD_TO_COP_RATE;
      display = formatPrice(priceUSD, 'USD', 'en-US');
    }

    if (property.type === 'rental') {
      return language === 'es' ? `${display}/noche` : `${display}/night`;
    } else {
      return display;
    }
  };

  const handleLike = (e) => {
    e.preventDefault();
    setIsLiked(!isLiked);
  };


  const getStatusBadge = () => {
    if (property.type === 'rental') {
      return <div className="status-badge rental">Alquiler</div>;
    } else {
      return <div className="status-badge sale">A la venta</div>;
    }
  };

  const getActionButton = () => {
    if (property.type === 'rental') {
      return (
        <Link to={`/property/${property.id}`} className="btn-primary">
          Revisar Disponibilidad
        </Link>
      );
    } else {
      return (
        <Link to={`/property/${property.id}`} className="btn-primary">
          Agendar una visita
        </Link>
      );
    }
  };

  return (
    <div className="property-card">
      <div className="property-image-container">
        <img src={property.image} alt={property.title} className="property-image" />
        
        <div className="price-badge">
          {getPriceDisplay()}
        </div>
        
        <button 
          className={`favorite-btn ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
          aria-label="Añadir a favoritos"
        >
          {isLiked ? '❤️' : '🤍'}
        </button>
        
        {getStatusBadge()}
      </div>
      
      <div className="property-content">
        <div className="property-header">
          <h3 className="property-title">{property.title}</h3>
          <p className="property-location">📍 {property.location}</p>
        </div>
        
        <div className="property-stats">
          <span className="stat">🛏️ {property.bedrooms}</span>
          <span className="stat">🚿 {property.bathrooms}</span>
          <span className="stat">📐 {property.sqft} sqft</span>
          {property.type === 'rental' && (
            <span className="stat">👥 {property.maxGuests || 4} guests</span>
          )}
        </div>
        
        <div className="property-tags">
          {property.features.slice(0, 3).map((feature, index) => (
            <span key={index} className="feature-tag">{feature}</span>
          ))}
        </div>
        
        <p className="property-preview">
          {property.description.substring(0, 80)}...
        </p>
        
        <div className="agent-preview">
          <div className="agent-avatar">👤</div>
          <span className="agent-name">{property.agent}</span>
        </div>
        
        <div className="property-actions">
          {getActionButton()}
          <button className="btn-secondary">
            📞 Llamar
          </button>
        </div>
      </div>
    </div>
  );
}

export default PropertyCard;