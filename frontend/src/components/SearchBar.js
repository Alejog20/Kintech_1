import React, { useState } from 'react';

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);

function SearchBar({ onSearch, isDarkMode }) {
  const [searchData, setSearchData] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    propertyType: 'rental'
  });

  const [activeField, setActiveField] = useState(null);

  const handleFieldChange = (field, value) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    console.log("Buscando:", searchData);
    setActiveField(null);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className={`search-bar-container ${isDarkMode ? 'dark' : ''}`}>
        <div className="search-tabs">
            <button
                className={`search-tab ${searchData.propertyType === 'rental' ? 'active' : ''}`}
                onClick={() => handleFieldChange('propertyType', 'rental')}
            >
                Alquilar
            </button>
            <button
                className={`search-tab ${searchData.propertyType === 'sale' ? 'active' : ''}`}
                onClick={() => handleFieldChange('propertyType', 'sale')}
            >
                En venta
            </button>
        </div>

        <div className={`search-bar ${activeField ? 'active' : ''}`}>
            <div
                className={`search-field location ${activeField === 'location' ? 'active' : ''}`}
                onClick={() => setActiveField('location')}
            >
                <label>Ubicación</label>
                <input
                    type="text"
                    placeholder="Explora destinos"
                    value={searchData.location}
                    onChange={(e) => handleFieldChange('location', e.target.value)}
                />
            </div>

            <div className="divider"></div>
            
            {searchData.propertyType === 'rental' ? (
                <>
                    <div
                        className={`search-field check-in ${activeField === 'checkIn' ? 'active' : ''}`}
                        onClick={() => setActiveField('checkIn')}
                    >
                        <label>Llegada</label>
                        <input
                            type="text"
                            placeholder="¿Cuándo?"
                            value={searchData.checkIn}
                            onChange={(e) => handleFieldChange('checkIn', e.target.value)}
                            onFocus={(e) => e.target.type='date'}
                            onBlur={(e) => e.target.type='text'}
                            min={today}
                        />
                    </div>
                    <div className="divider"></div>
                    <div
                        className={`search-field check-out ${activeField === 'checkOut' ? 'active' : ''}`}
                        onClick={() => setActiveField('checkOut')}
                    >
                        <label>Salida</label>
                        <input
                            type="text"
                            placeholder="¿Cuándo?"
                            value={searchData.checkOut}
                            onChange={(e) => handleFieldChange('checkOut', e.target.value)}
                            onFocus={(e) => e.target.type='date'}
                            onBlur={(e) => e.target.type='text'}
                            min={searchData.checkIn || today}
                        />
                    </div>
                    <div className="divider"></div>
                    <div
                        className={`search-field guests ${activeField === 'guests' ? 'active' : ''}`}
                        onClick={() => setActiveField('guests')}
                    >
                        <label>Huéspedes</label>
                        <input
                            type="text"
                            placeholder="¿Cuántos?"
                            value={searchData.guests > 0 ? `${searchData.guests} huésped(es)` : ''}
                            readOnly
                        />
                    </div>
                </>
            ) : (
                <div
                    className={`search-field-sale ${activeField === 'sale-search' ? 'active' : ''}`}
                    onClick={() => setActiveField('sale-search')}
                >
                    <label>Búsqueda</label>
                    <input
                        type="text"
                        placeholder="Busca por ciudad, barrio o dirección"
                        value={searchData.location}
                        onChange={(e) => handleFieldChange('location', e.target.value)}
                    />
                </div>
            )}


            <button className="search-button" onClick={handleSearch}>
                <SearchIcon />
                <span className="search-text">Buscar</span>
            </button>
        </div>
        {activeField && <div className="search-overlay" onClick={() => setActiveField(null)}></div>}
    </div>
  );
}

export default SearchBar;