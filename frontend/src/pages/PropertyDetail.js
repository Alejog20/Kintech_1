import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import TourCalendar from '../components/TourCalendar';
import RentalCalendar from '../components/RentalCalendar';

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
      // Mock data fallback with both sale and rental properties
      const mockProperties = [
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
          description: "Beautiful modern family home in prestigious Hampstead area. Recently renovated with high-end finishes throughout.",
          features: ["Garden", "Parking", "Modern Kitchen", "En-suite"],
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
          description: "Stunning apartment with panoramic city views. Perfect for professionals and short-term stays.",
          features: ["Concierge", "Gym", "Balcony", "City Views", "WiFi", "Kitchen"],
          agent: "James Thompson",
          phone: "+44 20 7946 0959",
          airbnbId: "12345678"
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
          description: "Charming Victorian townhouse with period features and modern amenities.",
          features: ["Period Features", "Large Garden", "Off-Street Parking"],
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
          description: "Modern studio apartment in trendy Shoreditch. Perfect for couples and solo travelers.",
          features: ["WiFi", "Kitchen", "Workspace", "Netflix", "Air Conditioning"],
          agent: "David Lee",
          phone: "+44 20 7946 0961",
          airbnbId: "87654321"
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

  const handleTourBooking = (bookingData) => {
    console.log('Tour booking:', bookingData);
    // In real implementation, send to backend
  };

  const handleRentalBooking = (bookingData) => {
    console.log('Rental booking:', bookingData);
    // In real implementation, send to backend and sync with Airbnb
  };

  const getPriceDisplay = () => {
    if (property.type === 'rental') {
      return `${formatPrice(property.pricePerNight)}/night`;
    } else {
      return formatPrice(property.price);
    }
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
              {getPriceDisplay()}
            </div>
            <div className={`property-type-badge ${property.type}`}>
              {property.type === 'rental' ? 'For Rent' : 'For Sale'}
            </div>
          </div>

          <div className="property-info">
            <div className="property-header">
              <h1>{property.title}</h1>
              <p className="location">📍 {property.location}</p>
              {property.airbnbId && (
                <div className="airbnb-info">
                  <span className="airbnb-icon">🅰️</span>
                  <span>Also available on Airbnb</span>
                </div>
              )}
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
              {property.type === 'rental' && (
                <div className="stat-item">
                  <span className="stat-icon">👥</span>
                  <span className="stat-value">{property.maxGuests}</span>
                  <span className="stat-label">Max Guests</span>
                </div>
              )}
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

            {/* Show appropriate calendar based on property type */}
            <div className="booking-section">
              {property.type === 'rental' ? (
                <RentalCalendar 
                  property={property} 
                  onBookRental={handleRentalBooking}
                />
              ) : (
                <TourCalendar 
                  property={property} 
                  onBookTour={handleTourBooking}
                />
              )}
            </div>

            <div className="agent-contact">
              <h3>Your Property Expert</h3>
              <div className="agent-info">
                <div className="agent-details">
                  <div className="agent-avatar">👤</div>
                  <div>
                    <h4>{property.agent}</h4>
                    <p>{property.type === 'rental' ? 'Property Manager' : 'Senior Property Consultant'}</p>
                    <p>📞 {property.phone}</p>
                    <p>✉️ {property.agent.toLowerCase().replace(' ', '.')}@primeprop.com</p>
                  </div>
                </div>
                <div className="contact-actions">
                  <button className="contact-btn primary">
                    💬 Send Message
                  </button>
                  <button className="contact-btn secondary">
                    📞 Call Now
                  </button>
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