import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch('/properties');
      const data = await response.json();
      setProperties(data);
      setFilteredProperties(data);
      setLoading(false);
    } catch (err) {
      // Mock data fallback with both sale and rental properties
      const mockData = [
        {
          id: 1,
          title: "Modern Family Home",
          type: "sale",
          price: 450000,
          location: "Hampstead, London",
          bedrooms: 3,
          bathrooms: 2,
          sqft: 1850,
          image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop",
          description: "Beautiful modern family home in prestigious Hampstead area.",
          features: ["Garden", "Parking", "Modern Kitchen"],
          agent: "Sarah Wilson",
          phone: "+44 20 7946 0958"
        },
        {
          id: 2,
          title: "City Centre Apartment",
          type: "rental",
          pricePerNight: 150,
          maxGuests: 4,
          location: "Canary Wharf, London",
          bedrooms: 2,
          bathrooms: 1,
          sqft: 950,
          image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
          description: "Stunning apartment with panoramic city views.",
          features: ["Concierge", "Gym", "Balcony"],
          agent: "James Thompson",
          phone: "+44 20 7946 0959"
        },
        {
          id: 3,
          title: "Victorian Townhouse",
          type: "sale",
          price: 650000,
          location: "Richmond, London",
          bedrooms: 4,
          bathrooms: 3,
          sqft: 2400,
          image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&h=600&fit=crop",
          description: "Charming Victorian townhouse with period features.",
          features: ["Period Features", "Large Garden", "Parking"],
          agent: "Emma Clarke",
          phone: "+44 20 7946 0960"
        },
        {
          id: 4,
          title: "Luxury Studio Apartment",
          type: "rental",
          pricePerNight: 95,
          maxGuests: 2,
          location: "Shoreditch, London",
          bedrooms: 1,
          bathrooms: 1,
          sqft: 500,
          image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
          description: "Modern studio apartment in trendy Shoreditch.",
          features: ["WiFi", "Kitchen", "Workspace"],
          agent: "David Lee",
          phone: "+44 20 7946 0961"
        }
      ];
      setProperties(mockData);
      setFilteredProperties(mockData);
      setLoading(false);
    }
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    if (filter === 'all') {
      setFilteredProperties(properties);
    } else {
      setFilteredProperties(properties.filter(property => property.type === filter));
    }
  };

  const formatPrice = (property) => {
    if (property.type === 'rental') {
      return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        maximumFractionDigits: 0
      }).format(property.pricePerNight || 120) + '/night';
    } else {
      return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        maximumFractionDigits: 0
      }).format(property.price);
    }
  };

  if (loading) return <div className="loading">Loading properties...</div>;

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Find Your Perfect Property in London</h1>
          <p className="hero-subtitle">
            Whether you're looking to buy your dream home or book a perfect rental, 
            we have exceptional properties with expert guidance.
          </p>
          <div className="hero-stats">
            <div className="stat">
              <strong>500+</strong>
              <span>Properties</span>
            </div>
            <div className="stat">
              <strong>98%</strong>
              <span>Satisfaction</span>
            </div>
            <div className="stat">
              <strong>15+</strong>
              <span>Years Experience</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="filter-section">
        <div className="container">
          <div className="property-filters">
            <h2>Browse Properties</h2>
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => handleFilterChange('all')}
              >
                All Properties ({properties.length})
              </button>
              <button 
                className={`filter-btn ${activeFilter === 'sale' ? 'active' : ''}`}
                onClick={() => handleFilterChange('sale')}
              >
                For Sale ({properties.filter(p => p.type === 'sale').length})
              </button>
              <button 
                className={`filter-btn ${activeFilter === 'rental' ? 'active' : ''}`}
                onClick={() => handleFilterChange('rental')}
              >
                For Rent ({properties.filter(p => p.type === 'rental').length})
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section className="properties-section">
        <div className="container">
          <div className="properties-grid">
            {filteredProperties.map(property => (
              <div key={property.id} className="property-card">
                <div className="property-image">
                  <img src={property.image} alt={property.title} />
                  <div className="property-price">{formatPrice(property)}</div>
                  <div className={`property-type-badge ${property.type}`}>
                    {property.type === 'rental' ? 'For Rent' : 'For Sale'}
                  </div>
                </div>
                <div className="property-content">
                  <h3 className="property-title">{property.title}</h3>
                  <p className="property-location">📍 {property.location}</p>
                  <div className="property-features">
                    <span className="feature">🛏️ {property.bedrooms} bed</span>
                    <span className="feature">🚿 {property.bathrooms} bath</span>
                    <span className="feature">📐 {property.sqft} sqft</span>
                    {property.type === 'rental' && (
                      <span className="feature">👥 {property.maxGuests || 4} guests</span>
                    )}
                  </div>
                  <p className="property-description">
                    {property.description.substring(0, 100)}...
                  </p>
                  <Link 
                    to={`/property/${property.id}`} 
                    className="view-details-btn"
                  >
                    {property.type === 'rental' ? 'Check Availability' : 'Schedule Tour'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Models Section */}
      <section className="business-models-section">
        <div className="container">
          <h2>Our Services</h2>
          <div className="business-models-grid">
            <div className="business-model">
              <div className="model-icon">🏠</div>
              <h3>Property Sales</h3>
              <p>Find your dream home with our expert guidance. Schedule personalized tours and get professional advice throughout the buying process.</p>
              <ul>
                <li>✓ Expert property consultations</li>
                <li>✓ Guided property tours</li>
                <li>✓ Market analysis and pricing</li>
                <li>✓ End-to-end buying support</li>
              </ul>
              <button 
                className="cta-button"
                onClick={() => handleFilterChange('sale')}
              >
                Browse Properties for Sale
              </button>
            </div>
            
            <div className="business-model">
              <div className="model-icon">🗓️</div>
              <h3>Short-term Rentals</h3>
              <p>Book perfect accommodations for your London stay. Integrated with Airbnb for seamless booking and availability management.</p>
              <ul>
                <li>✓ Instant booking confirmation</li>
                <li>✓ Real-time availability</li>
                <li>✓ Airbnb synchronization</li>
                <li>✓ Professional property management</li>
              </ul>
              <button 
                className="cta-button"
                onClick={() => handleFilterChange('rental')}
              >
                Browse Rental Properties
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Find Your Perfect Property?</h2>
          <p>Our expert team is here to guide you every step of the way</p>
          <Link to="/contact" className="cta-button-large">
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;