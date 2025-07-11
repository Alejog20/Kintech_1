import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch('/properties');
      const data = await response.json();
      setProperties(data);
      setLoading(false);
    } catch (err) {
      // Mock data fallback
      const mockData = [
        {
          id: 1,
          title: "Modern Family Home",
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
          price: 320000,
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
        }
      ];
      setProperties(mockData);
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) return <div className="loading">Loading properties...</div>;

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Find Your Perfect Home in London</h1>
          <p className="hero-subtitle">
            Discover exceptional properties with our expert guidance. 
            Your dream home awaits in London's finest locations.
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

      {/* Properties Section */}
      <section className="properties-section">
        <div className="container">
          <h2 className="section-title">Featured Properties</h2>
          <div className="properties-grid">
            {properties.map(property => (
              <div key={property.id} className="property-card">
                <div className="property-image">
                  <img src={property.image} alt={property.title} />
                  <div className="property-price">{formatPrice(property.price)}</div>
                </div>
                <div className="property-content">
                  <h3 className="property-title">{property.title}</h3>
                  <p className="property-location">📍 {property.location}</p>
                  <div className="property-features">
                    <span className="feature">🛏️ {property.bedrooms} bed</span>
                    <span className="feature">🚿 {property.bathrooms} bath</span>
                    <span className="feature">📐 {property.sqft} sqft</span>
                  </div>
                  <p className="property-description">
                    {property.description.substring(0, 100)}...
                  </p>
                  <Link 
                    to={`/property/${property.id}`} 
                    className="view-details-btn"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Find Your Dream Home?</h2>
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