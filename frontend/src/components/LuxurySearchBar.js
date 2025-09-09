import React, { useState, useEffect, useRef } from 'react';
import './LuxurySearchBar.css';
import { LanguageContext } from '../context/LanguageContext';

const LuxurySearchBar = ({ onSearch, className = '' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  
  const { language } = React.useContext(LanguageContext);

  const translations = {
    es: {
      searchPlaceholder: "Cartagena, Bocagrande...",
      location: "Ubicación",
      checkIn: "Entrada",
      checkOut: "Salida", 
      guests: "Huéspedes",
      search: "Buscar",
      exploreSuggestions: [
        "Propiedades frente al mar",
        "Desarrollos en Bocagrande",
        "Centro Histórico", 
        "Villas de lujo en Castillogrande",
        "Apartamentos modernos en Manga"
      ]
    },
    en: {
      searchPlaceholder: "Cartagena, Bocagrande...",
      location: "Location",
      checkIn: "Check-in",
      checkOut: "Check-out",
      guests: "Guests", 
      search: "Search",
      exploreSuggestions: [
        "Oceanfront properties",
        "Bocagrande developments", 
        "Historic Center",
        "Luxury villas in Castillogrande",
        "Modern apartments in Manga"
      ]
    }
  };

  const t = translations[language];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const searchData = {
      query: searchQuery,
      location,
      checkIn,
      checkOut,
      guests,
      type: 'all'
    };
    onSearch && onSearch(searchData);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    onSearch && onSearch({ query: suggestion, type: 'suggestion' });
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  return (
    <div className={`luxury-search-container ${className}`} ref={searchRef}>
      {/* Always visible transparent search bar with calendar-like design */}
      <div className="search-bar-transparent">
        <div className="search-sections">
          {/* Location Section */}
          <div className="search-section location-section">
            <div className="section-icon">📍</div>
            <div className="section-content">
              <label>{t.location}</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleInputFocus}
                placeholder={t.searchPlaceholder}
                className="transparent-input"
              />
            </div>
          </div>

          {/* Check-in Section */}
          <div className="search-section date-section">
            <div className="section-icon">📅</div>
            <div className="section-content">
              <label>{t.checkIn}</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="transparent-input calendar-input"
              />
            </div>
          </div>

          {/* Check-out Section */}
          <div className="search-section date-section">
            <div className="section-icon">📅</div>
            <div className="section-content">
              <label>{t.checkOut}</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="transparent-input calendar-input"
              />
            </div>
          </div>

          {/* Guests Section */}
          <div className="search-section guests-section">
            <div className="section-icon">👥</div>
            <div className="section-content">
              <label>{t.guests}</label>
              <select
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value))}
                className="transparent-input"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                  <option key={num} value={num}>
                    {num} {language === 'es' ? 'persona' + (num > 1 ? 's' : '') : 'guest' + (num > 1 ? 's' : '')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Button */}
          <div className="search-section search-button-section">
            <button 
              type="button" 
              className="elegant-search-btn"
              onClick={handleSearchSubmit}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Suggestions dropdown - shows when focused on location */}
        {showSuggestions && (
          <div className="transparent-suggestions">
            <div className="suggestions-content">
              <div className="suggestions-section">
                <h4>🏖️ Explorar Colecciones</h4>
                {t.exploreSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <span className="suggestion-icon">✨</span>
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LuxurySearchBar;