import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/properties/${id}`);
      const data = await response.json();
      setProperty(data);
      setLoading(false);
    } catch (err) {
      // Mock data fallback
      const mockProperties = [
        {
          id: 1,
          title: "Modern Family Home",
          price: 450000,
          location: "Hampstead, London",
          bedrooms: 3,
          bathrooms: 2,
          sqft: 1850,
          image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop",
          description: "Beautiful modern family home in prestigious Hampstead area. Recently renovated with high-end finishes throughout.",
          features: ["Garden", "Parking", "Modern Kitchen", "En-suite"],
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
          description: "Stunning apartment with panoramic city views. Perfect for professionals.",
          features: ["Concierge", "Gym", "Balcony", "City Views"],
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
          description: "Charming Victorian townhouse with period features and modern amenities.",
          features: ["Period Features", "Large Garden", "Off-Street Parking"],
          agent: "Emma Clarke",
          phone: "+44 20 7946 0960"
        }
      ];
      
      const foundProperty = mockProperties.find(p => p.id === parseInt(id));
      setProperty(foundProperty);
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

  if (loading) return <div className="loading">Loading property details...</div>;
  if (!property) return <div className="error">Property not found</div>;

  return (
    <div className="property-detail">
      <div className="container">
        <nav className="breadcrumb">
          <Link to="/">Properties</Link> 
          <span> / </span>
          <span>{property.title}</span>
        </nav>

        <div className="property-detail-content">
          <div className="property-image-large">
            <img src={property.image} alt={property.title} />
            <div className="property-price-overlay">
              {formatPrice(property.price)}
            </div>
          </div>

          <div className="property-info">
            <div className="property-header">
              <h1>{property.title}</h1>
              <p className="location">📍 {property.location}</p>
            </div>

            <div className="property-stats">
              <div className="stat-item">
                <span className="stat-icon">🛏️</span>
                <span className="stat-value">{property.bedrooms}</span>
                <span className="stat-label">Bedrooms</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🚿</span>
                <span className="stat-value">{property.bathrooms}</span>
                <span className="stat-label">Bathrooms</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">📐</span>
                <span className="stat-value">{property.sqft}</span>
                <span className="stat-label">Sq Ft</span>
              </div>
            </div>

            <div className="property-description">
              <h3>About This Property</h3>
              <p>{property.description}</p>
            </div>

            <div className="property-features">
              <h3>Key Features</h3>
              <div className="features-grid">
                {property.features.map((feature, index) => (
                  <div key={index} className="feature-item">
                    ✓ {feature}
                  </div>
                ))}
              </div>
            </div>

            <div className="agent-contact">
              <h3>Contact Agent</h3>
              <div className="agent-info">
                <div className="agent-details">
                  <h4>{property.agent}</h4>
                  <p>📞 {property.phone}</p>
                  <p>✉️ {property.agent.toLowerCase().replace(' ', '.')}@primeprop.com</p>
                </div>
                <div className="contact-actions">
                  <button className="contact-btn primary">
                    📞 Call Now
                  </button>
                  <button className="contact-btn secondary">
                    ✉️ Send Message
                  </button>
                  <Link to="/contact" className="contact-btn secondary">
                    📋 Book Viewing
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetail;