import React, { useState, useEffect, useContext } from 'react'; // 1. Importar useContext
import { Link } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext'; // 2. Importar el contexto
import LuxurySearchBar from '../components/LuxurySearchBar';
import WhatsAppFloat from '../components/WhatsAppFloat';

function Home() {
  const { language } = useContext(LanguageContext); // 3. Usar el contexto global
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  // 4. Eliminar el estado local de idioma: const [language, setLanguage] = useState('es');

  const translations = {
    es: {
      heroTitle: "Vive el Lujo Caribeño",
      heroSubtitle: "Descubre propiedades extraordinarias en Cartagena de Indias. Cada residencia cuenta una historia de elegancia, exclusividad y sofisticación frente al mar Caribe.",
      heroTagline: "Donde la historia colonial se encuentra con el lujo moderno",
      loadingText: "Cargando colección exclusiva...",
      browseProperties: "Colección Exclusiva",
      allProperties: "Todas",
      forSale: "En Venta", 
      forRent: "En Alquiler",
      currency: "COP",
      perNight: "/noche",
      viewDetails: "Explorar Propiedad",
      luxuryBadge: "🏖️ Especialistas en Cartagena",
      trustSignals: {
        certified: "✓ Avalúos Certificados",
        legal: "✓ Proceso Legal Garantizado", 
        financing: "✓ Financiación Exclusiva"
      }
    },
    en: {
      heroTitle: "Experience Caribbean Luxury",
      heroSubtitle: "Discover extraordinary properties in Cartagena de Indias. Each residence tells a story of elegance, exclusivity and sophistication by the Caribbean Sea.",
      heroTagline: "Where colonial history meets modern luxury",
      loadingText: "Loading exclusive collection...",
      browseProperties: "Exclusive Collection",
      allProperties: "All",
      forSale: "For Sale",
      forRent: "For Rent", 
      currency: "USD",
      perNight: "/night",
      viewDetails: "Explore Property",
      luxuryBadge: "🏖️ Cartagena Specialists",
      trustSignals: {
        certified: "✓ Certified Appraisals",
        legal: "✓ Guaranteed Legal Process",
        financing: "✓ Exclusive Financing"
      }
    }
  };

  // ... (El resto del código de mockData, fetchProperties, etc., permanece igual)
  const mockDataES = [
    {
      id: 1,
      title: "Villa de Lujo Frente al Mar",
      type: "sale",
      price: 2800000000,
      location: "Bocagrande, Cartagena",
      bedrooms: 5,
      bathrooms: 6,
      sqft: 450,
      image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=600&fit=crop",
      description: "Espectacular villa moderna con acceso directo a la playa, piscina infinita y acabados de lujo.",
      features: ["Playa Privada", "Piscina Infinita", "Gimnasio"],
      agent: "Laura Gómez",
    },
    {
      id: 2,
      title: "Apartamento Ejecutivo Centro Histórico",
      type: "rental",
      pricePerNight: 450000,
      location: "Ciudad Amurallada, Cartagena",
      bedrooms: 2,
      bathrooms: 2,
      sqft: 120,
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
      description: "Elegante apartamento colonial restaurado en el corazón del centro histórico.",
      features: ["Balcón Colonial", "AC Central", "WiFi"],
      agent: "Carlos Rivas",
    },
    {
      id: 3,
      title: "Penthouse Moderno Bocagrande",
      type: "sale",
      price: 3500000000,
      location: "Bocagrande, Cartagena",
      bedrooms: 4,
      bathrooms: 5,
      sqft: 380,
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      description: "Exclusivo penthouse con terraza panorámica y vista 360° al mar Caribe.",
      features: ["Terraza 360°", "Jacuzzi", "Ascensor Privado"],
      agent: "Sofía Pérez",
    },
    {
      id: 4,
      title: "Casa Colonial Getsemaní",
      type: "rental",
      pricePerNight: 380000,
      location: "Getsemaní, Cartagena",
      bedrooms: 3,
      bathrooms: 3,
      sqft: 200,
      image: "https://images.unsplash.com/photo-1617826359993-23a5165b4617?w=800&h=600&fit=crop",
      description: "Auténtica casa colonial con patio central y arte urbano en las cercanías.",
      features: ["Patio Central", "Arte Local", "Cocina Gourmet"],
      agent: "Andrés Jaramillo",
    },
    {
      id: 5,
      title: "Apartamento Moderno Manga",
      type: "sale",
      price: 1200000000,
      location: "Manga, Cartagena",
      bedrooms: 3,
      bathrooms: 3,
      sqft: 180,
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
      description: "Moderno apartamento en exclusivo conjunto residencial con amenidades completas.",
      features: ["Piscina", "Zona BBQ", "Seguridad 24h"],
      agent: "María Fernández",
    },
    {
      id: 6,
      title: "Loft Artístico La Matuna",
      type: "rental",
      pricePerNight: 320000,
      location: "La Matuna, Cartagena",
      bedrooms: 1,
      bathrooms: 1,
      sqft: 85,
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
      description: "Creativo loft con diseño moderno en el emergente barrio de La Matuna.",
      features: ["Diseño Único", "Luz Natural", "Zona Trabajo"],
      agent: "Diego Martínez",
    },
    {
      id: 7,
      title: "Casa Republicana San Diego",
      type: "sale",
      price: 1800000000,
      location: "San Diego, Cartagena",
      bedrooms: 4,
      bathrooms: 4,
      sqft: 320,
      image: "https://images.unsplash.com/photo-1628744444594-5a345107e335?w=800&h=600&fit=crop",
      description: "Elegante casa republicana restaurada con detalles arquitectónicos originales.",
      features: ["Arquitectura Original", "Patio Colonial", "Parking"],
      agent: "Isabella Torres",
    },
    {
      id: 8,
      title: "Estudio Boutique Castillogrande",
      type: "rental",
      pricePerNight: 280000,
      location: "Castillogrande, Cartagena",
      bedrooms: 1,
      bathrooms: 1,
      sqft: 65,
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&h=600&fit=crop",
      description: "Acogedor estudio con vista al mar en la exclusiva zona de Castillogrande.",
      features: ["Vista al Mar", "Kitchenette", "Balcón"],
      agent: "Camila Rodríguez",
    },
    {
      id: 9,
      title: "Villa Familiar El Laguito",
      type: "sale",
      price: 2200000000,
      location: "El Laguito, Cartagena",
      bedrooms: 4,
      bathrooms: 4,
      sqft: 350,
      image: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=800&h=600&fit=crop",
      description: "Espaciosa villa familiar con jardín privado y acceso directo a la laguna.",
      features: ["Jardín Privado", "Acceso Laguna", "Zona Niños"],
      agent: "Roberto Vargas",
    }
  ];
  const mockDataEN = [
    {
      id: 1,
      title: "Luxury Oceanfront Villa",
      type: "sale",
      price: 750000,
      location: "Bocagrande, Cartagena",
      bedrooms: 5,
      bathrooms: 6,
      sqft: 4850,
      image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=600&fit=crop",
      description: "Spectacular modern villa with direct beach access, infinity pool and luxury finishes.",
      features: ["Private Beach", "Infinity Pool", "Gym"],
      agent: "Laura Gómez",
    },
    {
      id: 2,
      title: "Historic Executive Apartment",
      type: "rental",
      pricePerNight: 120,
      location: "Walled City, Cartagena",
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1290,
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
      description: "Elegant restored colonial apartment in the heart of the historic center.",
      features: ["Colonial Balcony", "Central AC", "WiFi"],
      agent: "Carlos Rivas",
    },
    {
      id: 3,
      title: "Modern Bocagrande Penthouse",
      type: "sale",
      price: 950000,
      location: "Bocagrande, Cartagena",
      bedrooms: 4,
      bathrooms: 5,
      sqft: 4090,
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      description: "Exclusive penthouse with panoramic terrace and 360° Caribbean Sea views.",
      features: ["360° Terrace", "Jacuzzi", "Private Elevator"],
      agent: "Sofia Pérez",
    },
    {
      id: 4,
      title: "Colonial Getsemaní House",
      type: "rental",
      pricePerNight: 95,
      location: "Getsemaní, Cartagena",
      bedrooms: 3,
      bathrooms: 3,
      sqft: 2150,
      image: "https://images.unsplash.com/photo-1617826359993-23a5165b4617?w=800&h=600&fit=crop",
      description: "Authentic colonial house with central courtyard and street art nearby.",
      features: ["Central Courtyard", "Local Art", "Gourmet Kitchen"],
      agent: "Andrés Jaramillo",
    },
    {
      id: 5,
      title: "Modern Manga Apartment",
      type: "sale",
      price: 320000,
      location: "Manga, Cartagena",
      bedrooms: 3,
      bathrooms: 3,
      sqft: 1940,
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
      description: "Modern apartment in exclusive residential complex with complete amenities.",
      features: ["Pool", "BBQ Area", "24h Security"],
      agent: "María Fernández",
    },
    {
      id: 6,
      title: "Artistic La Matuna Loft",
      type: "rental",
      pricePerNight: 85,
      location: "La Matuna, Cartagena",
      bedrooms: 1,
      bathrooms: 1,
      sqft: 915,
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
      description: "Creative loft with modern design in the emerging La Matuna neighborhood.",
      features: ["Unique Design", "Natural Light", "Work Space"],
      agent: "Diego Martínez",
    },
    {
      id: 7,
      title: "Republican San Diego House",
      type: "sale",
      price: 480000,
      location: "San Diego, Cartagena",
      bedrooms: 4,
      bathrooms: 4,
      sqft: 3440,
      image: "https://images.unsplash.com/photo-1628744444594-5a345107e335?w=800&h=600&fit=crop",
      description: "Elegant restored republican house with original architectural details.",
      features: ["Original Architecture", "Colonial Patio", "Parking"],
      agent: "Isabella Torres",
    },
    {
      id: 8,
      title: "Boutique Castillogrande Studio",
      type: "rental",
      pricePerNight: 75,
      location: "Castillogrande, Cartagena",
      bedrooms: 1,
      bathrooms: 1,
      sqft: 700,
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&h=600&fit=crop",
      description: "Cozy studio with sea view in the exclusive Castillogrande area.",
      features: ["Sea View", "Kitchenette", "Balcony"],
      agent: "Camila Rodríguez",
    },
    {
      id: 9,
      title: "Family Villa El Laguito",
      type: "sale",
      price: 590000,
      location: "El Laguito, Cartagena",
      bedrooms: 4,
      bathrooms: 4,
      sqft: 3770,
      image: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=800&h=600&fit=crop",
      description: "Spacious family villa with private garden and direct lagoon access.",
      features: ["Private Garden", "Lagoon Access", "Kids Area"],
      agent: "Roberto Vargas",
    }
  ];

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        // Fetch from real API
        const response = await fetch('http://localhost:5000/api/properties');
        const data = await response.json();
        
        if (data.success) {
          // Transform API data to match frontend format
          const transformedProperties = data.data.map(property => ({
            id: property.id,
            title: property.title,
            type: property.type,
            price: property.price,
            pricePerNight: property.price_per_night,
            location: property.location,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            sqft: property.sqft,
            image: property.image_url,
            description: property.description,
            features: property.features || [],
            agent: property.agent_name || 'Agente Especializado'
          }));
          
          setProperties(transformedProperties);
          setFilteredProperties(transformedProperties);
        } else {
          // Fallback to mock data if API fails
          console.warn('API failed, using mock data');
          const mockData = language === 'es' ? mockDataES : mockDataEN;
          setProperties(mockData);
          setFilteredProperties(mockData);
        }
      } catch (err) {
        console.error("Error fetching properties:", err);
        // Fallback to mock data
        const mockData = language === 'es' ? mockDataES : mockDataEN;
        setProperties(mockData);
        setFilteredProperties(mockData);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [language]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    if (filter === 'all') {
      setFilteredProperties(properties);
    } else {
      setFilteredProperties(properties.filter(property => property.type === filter));
    }
  };

  const formatPrice = (property) => {
    const currency = translations[language].currency;
    const locale = language === 'es' ? 'es-CO' : 'en-US';
    
    if (property.type === 'rental') {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 0
      }).format(property.pricePerNight) + translations[language].perNight;
    } else {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 0
      }).format(property.price);
    }
  };

  const handleSearch = async (searchData) => {
    console.log('Search performed:', searchData);
    setLoading(true);
    
    try {
      let url = 'http://localhost:5000/api/properties';
      const params = new URLSearchParams();
      
      if (searchData.query && searchData.query.trim()) {
        url = 'http://localhost:5000/api/properties/search';
        params.append('q', searchData.query.trim());
      }
      
      if (searchData.type && searchData.type !== 'all') {
        params.append('type', searchData.type);
      }
      
      if (searchData.location) {
        params.append('location', searchData.location);
      }
      
      const fullUrl = params.toString() ? `${url}?${params.toString()}` : url;
      const response = await fetch(fullUrl);
      const data = await response.json();
      
      if (data.success) {
        const transformedProperties = data.data.map(property => ({
          id: property.id,
          title: property.title,
          type: property.type,
          price: property.price,
          pricePerNight: property.price_per_night,
          location: property.location,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          sqft: property.sqft,
          image: property.image_url,
          description: property.description,
          features: property.features || [],
          agent: property.agent_name || 'Agente Especializado'
        }));
        
        setFilteredProperties(transformedProperties);
        setActiveFilter('all'); // Reset filter when searching
      }
    } catch (error) {
      console.error('Search error:', error);
      // Fallback to local filtering if API fails
      if (searchData.query) {
        const filtered = properties.filter(property =>
          property.title.toLowerCase().includes(searchData.query.toLowerCase()) ||
          property.location.toLowerCase().includes(searchData.query.toLowerCase()) ||
          property.description.toLowerCase().includes(searchData.query.toLowerCase())
        );
        setFilteredProperties(filtered);
      }
    } finally {
      setLoading(false);
    }
  };

  const t = translations[language];

  if (loading) return <div className="loading">{t.loadingText}</div>;

  return (
    <div className="home">
      {/* 5. Eliminar el botón de idioma de aquí */}

      {/* Enhanced Colombian Hero Section */}
      <section className="hero colombian-hero">
        <div className="colombian-flag-accent"></div>
        <div className="hero-content">
          <div className="hero-badge">{t.luxuryBadge}</div>
          <h1 className="hero-title">{t.heroTitle}</h1>
          <p className="hero-tagline">✨ {t.heroTagline}</p>
          <div className="hero-stats enhanced-stats">
            <div className="stat premium-stat">
              <strong>500+</strong>
              <span>Propiedades Premium</span>
              <div className="stat-icon">🏘️</div>
            </div>
            <div className="stat premium-stat">
              <strong>98%</strong>
              <span>Clientes Satisfechos</span>
              <div className="stat-icon">⭐</div>
            </div>
            <div className="stat premium-stat">
              <strong>15+</strong>
              <span>Años de Experiencia</span>
              <div className="stat-icon">🏆</div>
            </div>
            <div className="stat premium-stat">
              <strong>24/7</strong>
              <span>Atención Personalizada</span>
              <div className="stat-icon">💎</div>
            </div>
          </div>
          <div className="hero-trust-signals">
            <span className="trust-signal">{t.trustSignals.certified}</span>
            <span className="trust-signal">{t.trustSignals.legal}</span>
            <span className="trust-signal">{t.trustSignals.financing}</span>
          </div>
          
          {/* Luxury Search Bar */}
          <div className="hero-search">
            <LuxurySearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="filter-section">
        <div className="container">
          <div className="property-filters">
            <h2>{t.browseProperties}</h2>
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => handleFilterChange('all')}
              >
                {t.allProperties} ({properties.length})
              </button>
              <button 
                className={`filter-btn ${activeFilter === 'sale' ? 'active' : ''}`}
                onClick={() => handleFilterChange('sale')}
              >
                {t.forSale} ({properties.filter(p => p.type === 'sale').length})
              </button>
              <button 
                className={`filter-btn ${activeFilter === 'rental' ? 'active' : ''}`}
                onClick={() => handleFilterChange('rental')}
              >
                {t.forRent} ({properties.filter(p => p.type === 'rental').length})
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
                    {property.type === 'rental' ? t.forRent : t.forSale}
                  </div>
                </div>
                <div className="property-content">
                  <div className="property-header">
                    <h3 className="property-title">{property.title}</h3>
                  </div>
                  
                  <p className="property-location">📍 {property.location}</p>
                  
                  <div className="property-features">
                    <span className="feature">🛏️ {property.bedrooms}</span>
                    <span className="feature">🚿 {property.bathrooms}</span>
                    <span className="feature">📐 {property.sqft}m²</span>
                  </div>
                  
                  <div className="property-footer">
                    <span className="agent-name">{property.agent}</span>
                    <Link 
                      to={`/property/${property.id}`} 
                      className="view-details-btn premium-cta"
                    >
                      {t.viewDetails}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* WhatsApp Business Float */}
      <WhatsAppFloat />
    </div>
  );
}

export default Home;