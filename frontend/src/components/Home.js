import React, { useState, useEffect } from 'react';
import PropertyCard from '../components/PropertyCard'; // Ajusta la ruta si es necesario
import SearchBar from '../components/SearchBar'; // Ajusta la ruta si es necesario

function Home() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      // Para la demo, usamos datos mock. En un futuro, esto sería una llamada a tu API.
      const mockData = [
        {
          id: 1,
          title: "Villa de Lujo en Anapoima",
          type: "sale",
          price: 1800000000,
          location: "Anapoima, Cundinamarca",
          bedrooms: 4,
          bathrooms: 5,
          sqft: 400,
          image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=600&fit=crop",
          description: "Espectacular villa moderna con acabados de lujo, piscina privada y vista a las montañas.",
          features: ["Piscina", "Jardín", "Gimnasio"],
          agent: "Laura Gómez",
        },
        {
          id: 2,
          title: "Apartamento Frente al Mar",
          type: "rental",
          pricePerNight: 950000,
          location: "Bocagrande, Cartagena",
          bedrooms: 3,
          bathrooms: 3,
          sqft: 150,
          image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
          description: "Disfruta de la mejor vista al mar Caribe desde este lujoso y moderno apartamento.",
          features: ["Balcón", "Piscina", "Acceso a la playa"],
          agent: "Carlos Rivas",
        },
        {
          id: 3,
          title: "Finca de Recreo en Guatapé",
          type: "rental",
          pricePerNight: 1200000,
          location: "Guatapé, Antioquia",
          bedrooms: 5,
          bathrooms: 4,
          sqft: 500,
          image: "https://images.unsplash.com/photo-1594484208280-efa0ce3c46a7?w=800&h=600&fit=crop",
          description: "Espaciosa finca con acceso directo a la represa, ideal para familias y grupos grandes.",
          features: ["Muelle", "BBQ", "Jacuzzi"],
          agent: "Sofía Pérez",
        },
        {
          id: 4,
          title: "Penthouse Dúplex en El Poblado",
          type: "sale",
          price: 2500000000,
          location: "El Poblado, Medellín",
          bedrooms: 3,
          bathrooms: 4,
          sqft: 320,
          image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
          description: "Exclusivo penthouse con terraza privada, jacuzzi y una vista panorámica de la ciudad.",
          features: ["Terraza", "Jacuzzi", "Vista 360"],
          agent: "Andrés Jaramillo",
        }
      ];
      setProperties(mockData);
      setFilteredProperties(mockData);
    } catch (err) {
      console.error("Error fetching properties:", err);
      // Aquí podrías manejar el estado de error
    } finally {
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

  if (loading) return <div className="loading">Cargando propiedades...</div>;

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Encuentra tu Lugar Ideal</h1>
          <p className="hero-subtitle">
            Explora propiedades exclusivas para comprar o alquilar en los mejores destinos de Colombia.
          </p>
          <SearchBar onSearch={(searchData) => console.log(searchData)} />
        </div>
      </section>

      <main className="container">
        <section className="properties-section">
          <div className="property-filters">
            <h2>Propiedades Destacadas</h2>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => handleFilterChange('all')}
              >
                Todas
              </button>
              <button
                className={`filter-btn ${activeFilter === 'sale' ? 'active' : ''}`}
                onClick={() => handleFilterChange('sale')}
              >
                En Venta
              </button>
              <button
                className={`filter-btn ${activeFilter === 'rental' ? 'active' : ''}`}
                onClick={() => handleFilterChange('rental')}
              >
                En Alquiler
              </button>
            </div>
          </div>
          <div className="properties-grid">
            {filteredProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
