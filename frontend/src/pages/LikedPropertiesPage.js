import React, { useContext } from 'react';
import { useLikes } from '../context/LikeContext';
import PropertyCard from '../components/PropertyCard';
import { LanguageContext } from '../context/LanguageContext'; // Correct import
import './LikedPropertiesPage.css';

const LikedPropertiesPage = () => {
  const { likedProperties } = useLikes();
  const { language } = useContext(LanguageContext); // Correct usage

  // USD to COP conversion rate
  const USD_TO_COP_RATE = 4000;

  // Price formatting function (copied from Home.js)
  const formatPrice = (price, currency, locale) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Get price display for each property (copied from Home.js)
  const getPriceDisplay = (property) => {
    let price;
    if (property.type === 'rental') {
      price = property.pricePerNight || property.price_per_night || 450000;
    } else {
      price = property.price || 1200000000;
    }

    let display = '';
    if (language === 'es') {
      display = formatPrice(price, 'COP', 'es-CO');
    } else {
      const priceUSD = price / USD_TO_COP_RATE;
      display = formatPrice(priceUSD, 'USD', 'en-US');
    }

    if (property.type === 'rental') {
      return language === 'es' ? `${display}/noche` : `${display}/night`;
    } else {
      return display;
    }
  };

  // This is a placeholder. You should have a more robust translation system.
  const t = {
    es: { forSale: 'En Venta', forRent: 'En Alquiler' },
    en: { forSale: 'For Sale', forRent: 'For Rent' },
  }[language];

  return (
    <div className="liked-properties-page">
      <div className="container">
        <h1 className="liked-title">My Liked Properties</h1>
        {likedProperties.length > 0 ? (
          <div className="properties-grid">
            {likedProperties.map(property => (
              <PropertyCard 
                key={property.id} 
                property={property} 
                t={t} 
                priceDisplay={getPriceDisplay(property)}
              />
            ))}
          </div>
        ) : (
          <div className="no-likes-message">
            <h2>You haven't liked any properties yet.</h2>
            <p>Click the heart icon on any property to save it here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LikedPropertiesPage;
