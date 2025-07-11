import React, { useState } from 'react';

function SearchFilter({ onFilter, totalProperties }) {
  const [filters, setFilters] = useState({
    location: '',
    maxPrice: '',
    bedrooms: '',
    propertyType: 'all'
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      location: '',
      maxPrice: '',
      bedrooms: '',
      propertyType: 'all'
    };
    setFilters(clearedFilters);
    onFilter(clearedFilters);
  };

  return (
    <div className="search-filter">
      <div className="filter-header">
        <div className="search-main">
          <input
            type="text"
            placeholder="🔍 Search location, area, or postcode..."
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="search-input"
          />
          <button 
            className="filter-toggle"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <span>Filters</span>
            <span className={`arrow ${isExpanded ? 'up' : 'down'}`}>▼</span>
          </button>
        </div>
        
        <div className="results-count">
          {totalProperties} properties found
        </div>
      </div>

      {isExpanded && (
        <div className="filter-options">
          <div className="filter-row">
            <div className="filter-group">
              <label>Price Range</label>
              <select
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              >
                <option value="">Any Price</option>
                <option value="200000">Up to £200k</option>
                <option value="300000">Up to £300k</option>
                <option value="500000">Up to £500k</option>
                <option value="750000">Up to £750k</option>
                <option value="1000000">Up to £1M</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Bedrooms</label>
              <select
                value={filters.bedrooms}
                onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
              >
                <option value="">Any</option>
                <option value="1">1+ bed</option>
                <option value="2">2+ beds</option>
                <option value="3">3+ beds</option>
                <option value="4">4+ beds</option>
                <option value="5">5+ beds</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Property Type</label>
              <select
                value={filters.propertyType}
                onChange={(e) => handleFilterChange('propertyType', e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="house">Houses</option>
                <option value="apartment">Apartments</option>
                <option value="townhouse">Townhouses</option>
                <option value="flat">Flats</option>
              </select>
            </div>

            <div className="filter-actions">
              <button 
                className="clear-btn"
                onClick={clearFilters}
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Quick Filter Tags */}
          <div className="quick-filters">
            <span className="quick-filter-label">Quick filters:</span>
            <button 
              className="quick-filter-tag"
              onClick={() => handleFilterChange('maxPrice', '300000')}
            >
              Under £300k
            </button>
            <button 
              className="quick-filter-tag"
              onClick={() => handleFilterChange('bedrooms', '2')}
            >
              2+ bedrooms
            </button>
            <button 
              className="quick-filter-tag"
              onClick={() => handleFilterChange('location', 'London')}
            >
              Central London
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchFilter;