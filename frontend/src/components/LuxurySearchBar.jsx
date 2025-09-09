import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './LuxurySearchBar.css';
import { LanguageContext } from '../context/LanguageContext';
import ColombianSnake from './ColombianSnake.tsx';

const LuxurySearchBar = ({ onSearch, className = '' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const searchBarRef = useRef(null);
  const { language } = React.useContext(LanguageContext);

  // Restore state and handlers for inputs
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // onSearch logic here...
  };

  const handleSuggestionClick = (suggestion) => {
    // onSearch logic here...
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const t = {
    es: { searchPlaceholder: "Cartagena, Bocagrande..." },
    en: { searchPlaceholder: "Cartagena, Bocagrande..." },
  }[language];

  const transition = { type: "spring", stiffness: 400, damping: 30 };

  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        ref={searchBarRef}
        className="search-bar-transparent"
        animate={{
          scale: isHovered ? 1.12 : 1.1,
          boxShadow: isHovered
            ? `0px 8px 24px rgba(0,0,0,0.35), -4px 0px 12px rgba(0,0,0,0.15), 4px 0px 12px rgba(0,0,0,0.15)`
            : `0px 8px 30px rgba(0, 0, 0, 0.5)`,
        }}
        transition={transition}
      >
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
      </motion.div>

      <ColombianSnake targetRef={searchBarRef} isHovered={isHovered} />
    </div>
  );
};

export default LuxurySearchBar;