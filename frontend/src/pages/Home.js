import React, { useState, useEffect, useContext } from 'react'; // 1. Importar useContext
import { Link } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext'; // 2. Importar el contexto
import LuxurySearchBar from '../components/LuxurySearchBar';
import WhatsAppFloat from '../components/WhatsAppFloat';
import { TbBed, TbBath, TbRuler2, TbMapPin, TbDiamond } from 'react-icons/tb';

function Home() {
  const { language } = useContext(LanguageContext); // 3. Usar el contexto global
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState({});
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
      image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop",
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
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
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
      image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop",
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
      image: "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&h=600&fit=crop",
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
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
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
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
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
      image: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=800&h=600&fit=crop",
      description: "Espaciosa villa familiar con jardín privado y acceso directo a la laguna.",
      features: ["Jardín Privado", "Acceso Laguna", "Zona Niños"],
      agent: "Roberto Vargas",
    },
    {
      id: 10,
      title: "Casa Republicana San Diego",
      type: "sale",
      price: 1800000000,
      location: "San Diego, Cartagena",
      bedrooms: 4,
      bathrooms: 4,
      sqft: 320,
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
      description: "Elegante casa republicana restaurada con detalles arquitectónicos originales.",
      features: ["Arquitectura Original", "Patio Colonial", "Parking"],
      agent: "Isabella Torres",
    },
    {
      id: 11,
      title: "Apartamento Luxury Bocagrande",
      type: "rental",
      pricePerNight: 520000,
      location: "Bocagrande, Cartagena",
      bedrooms: 3,
      bathrooms: 3,
      sqft: 220,
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      description: "Moderno apartamento con vista al mar y amenidades de lujo.",
      features: ["Vista al Mar", "Piscina", "Gym"],
      agent: "Carlos Mendez",
    },
    {
      id: 12,
      title: "Villa Colonial Castillogrande",
      type: "sale",
      price: 3200000000,
      location: "Castillogrande, Cartagena",
      bedrooms: 5,
      bathrooms: 5,
      sqft: 420,
      image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop",
      description: "Espectacular villa colonial con diseño contemporáneo y jardines tropicales.",
      features: ["Jardín Tropical", "Piscina Privada", "Terraza"],
      agent: "Ana Gutierrez",
    },
    {
      id: 13,
      title: "Loft Moderno Centro Histórico",
      type: "rental",
      pricePerNight: 390000,
      location: "Centro Histórico, Cartagena",
      bedrooms: 2,
      bathrooms: 2,
      sqft: 140,
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
      description: "Loft contemporáneo en edificio colonial restaurado del centro histórico.",
      features: ["Diseño Moderno", "Ubicación Central", "WiFi"],
      agent: "Miguel Rodríguez",
    },
    {
      id: 14,
      title: "Casa Boutique Getsemaní",
      type: "rental",
      pricePerNight: 460000,
      location: "Getsemaní, Cartagena",
      bedrooms: 3,
      bathrooms: 3,
      sqft: 180,
      image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop",
      description: "Casa boutique con decoración artística y ambiente bohemio único.",
      features: ["Arte Local", "Patio Interno", "AC"],
      agent: "Lucia Fernandez",
    },
    {
      id: 15,
      title: "Penthouse Ejecutivo Manga",
      type: "sale",
      price: 1650000000,
      location: "Manga, Cartagena",
      bedrooms: 3,
      bathrooms: 3,
      sqft: 280,
      image: "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&h=600&fit=crop",
      description: "Penthouse moderno con terraza panorámica y acabados de primera.",
      features: ["Terraza Panorámica", "Parqueadero", "Seguridad"],
      agent: "David Silva",
    },
    {
      id: 16,
      title: "Apartamento Frente al Mar",
      type: "rental",
      pricePerNight: 350000,
      location: "Bocagrande, Cartagena",
      bedrooms: 2,
      bathrooms: 2,
      sqft: 160,
      image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=600&fit=crop",
      description: "Apartamento con vista directa al mar Caribe y balcón privado.",
      features: ["Vista al Mar", "Balcón Privado", "Piscina"],
      agent: "Carmen López",
    },
    {
      id: 17,
      title: "Casa Colonial La Matuna",
      type: "sale",
      price: 980000000,
      location: "La Matuna, Cartagena",
      bedrooms: 3,
      bathrooms: 3,
      sqft: 250,
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
      description: "Casa colonial restaurada en el emergente barrio de La Matuna.",
      features: ["Restaurada", "Patio Central", "Parking"],
      agent: "Fernando Aguilar",
    },
    {
      id: 18,
      title: "Villa Moderna El Laguito",
      type: "rental",
      pricePerNight: 680000,
      location: "El Laguito, Cartagena",
      bedrooms: 4,
      bathrooms: 4,
      sqft: 300,
      image: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=800&h=600&fit=crop",
      description: "Villa moderna con piscina privada y acceso directo a la laguna.",
      features: ["Piscina Privada", "Jardín", "BBQ"],
      agent: "Patricia Morales",
    },
    {
      id: 19,
      title: "Estudio de Diseño Bocagrande",
      type: "rental",
      pricePerNight: 280000,
      location: "Bocagrande, Cartagena",
      bedrooms: 1,
      bathrooms: 1,
      sqft: 75,
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      description: "Estudio minimalista con diseño contemporáneo y vista parcial al mar.",
      features: ["Diseño Minimalista", "Vista Parcial", "WiFi"],
      agent: "Andrés Castro",
    },
    {
      id: 20,
      title: "Casa Señorial San Diego",
      type: "sale",
      price: 2800000000,
      location: "San Diego, Cartagena",
      bedrooms: 5,
      bathrooms: 5,
      sqft: 380,
      image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop",
      description: "Majestuosa casa señorial con arquitectura colonial y jardines exuberantes.",
      features: ["Arquitectura Colonial", "Jardines", "Garaje"],
      agent: "Ricardo Herrera",
    },
    {
      id: 21,
      title: "Apartamento Luxury Castillogrande",
      type: "rental",
      pricePerNight: 420000,
      location: "Castillogrande, Cartagena",
      bedrooms: 2,
      bathrooms: 2,
      sqft: 130,
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
      description: "Apartamento de lujo con acabados premium y vista espectacular.",
      features: ["Acabados Premium", "Vista Espectacular", "Gym"],
      agent: "Valentina Cruz",
    },
    {
      id: 22,
      title: "Loft Artístico Getsemaní",
      type: "rental",
      pricePerNight: 320000,
      location: "Getsemaní, Cartagena",
      bedrooms: 1,
      bathrooms: 1,
      sqft: 95,
      image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop",
      description: "Loft con decoración artística en el corazón cultural de Cartagena.",
      features: ["Arte Original", "Ubicación Cultural", "AC"],
      agent: "Gabriel Ospina",
    },
    {
      id: 23,
      title: "Villa Ejecutiva Manga",
      type: "sale",
      price: 1450000000,
      location: "Manga, Cartagena",
      bedrooms: 4,
      bathrooms: 4,
      sqft: 310,
      image: "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&h=600&fit=crop",
      description: "Villa ejecutiva en exclusivo sector residencial con todas las comodidades.",
      features: ["Sector Exclusivo", "Piscina", "Seguridad 24h"],
      agent: "Mónica Jiménez",
    },
    {
      id: 24,
      title: "Casa Boutique Centro Histórico",
      type: "sale",
      price: 2100000000,
      location: "Centro Histórico, Cartagena",
      bedrooms: 3,
      bathrooms: 3,
      sqft: 260,
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
      description: "Casa boutique completamente renovada en el corazón del centro histórico.",
      features: ["Completamente Renovada", "Ubicación Premium", "Patio"],
      agent: "Sebastián Vega",
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
      image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop",
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
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
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
      image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop",
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
      image: "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&h=600&fit=crop",
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
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
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
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
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
      image: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=800&h=600&fit=crop",
      description: "Spacious family villa with private garden and direct lagoon access.",
      features: ["Private Garden", "Lagoon Access", "Kids Area"],
      agent: "Roberto Vargas",
    },
    {
      id: 10,
      title: "Republican House San Diego",
      type: "sale",
      price: 480000,
      location: "San Diego, Cartagena",
      bedrooms: 4,
      bathrooms: 4,
      sqft: 3440,
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
      description: "Elegant restored republican house with original architectural details.",
      features: ["Original Architecture", "Colonial Patio", "Parking"],
      agent: "Isabella Torres",
    },
    {
      id: 11,
      title: "Luxury Bocagrande Apartment",
      type: "rental",
      pricePerNight: 140,
      location: "Bocagrande, Cartagena",
      bedrooms: 3,
      bathrooms: 3,
      sqft: 2370,
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      description: "Modern apartment with ocean view and luxury amenities.",
      features: ["Ocean View", "Pool", "Gym"],
      agent: "Carlos Mendez",
    },
    {
      id: 12,
      title: "Colonial Villa Castillogrande",
      type: "sale",
      price: 850000,
      location: "Castillogrande, Cartagena",
      bedrooms: 5,
      bathrooms: 5,
      sqft: 4520,
      image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop",
      description: "Spectacular colonial villa with contemporary design and tropical gardens.",
      features: ["Tropical Garden", "Private Pool", "Terrace"],
      agent: "Ana Gutierrez",
    },
    {
      id: 13,
      title: "Modern Loft Historic Center",
      type: "rental",
      pricePerNight: 105,
      location: "Historic Center, Cartagena",
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1505,
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
      description: "Contemporary loft in restored colonial building in historic center.",
      features: ["Modern Design", "Central Location", "WiFi"],
      agent: "Miguel Rodríguez",
    },
    {
      id: 14,
      title: "Boutique House Getsemaní",
      type: "rental",
      pricePerNight: 125,
      location: "Getsemaní, Cartagena",
      bedrooms: 3,
      bathrooms: 3,
      sqft: 1940,
      image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop",
      description: "Boutique house with artistic decoration and unique bohemian atmosphere.",
      features: ["Local Art", "Internal Patio", "AC"],
      agent: "Lucia Fernandez",
    },
    {
      id: 15,
      title: "Executive Penthouse Manga",
      type: "sale",
      price: 440000,
      location: "Manga, Cartagena",
      bedrooms: 3,
      bathrooms: 3,
      sqft: 3010,
      image: "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&h=600&fit=crop",
      description: "Modern penthouse with panoramic terrace and premium finishes.",
      features: ["Panoramic Terrace", "Parking", "Security"],
      agent: "David Silva",
    },
    {
      id: 16,
      title: "Oceanfront Apartment",
      type: "rental",
      pricePerNight: 95,
      location: "Bocagrande, Cartagena",
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1720,
      image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=600&fit=crop",
      description: "Apartment with direct Caribbean Sea view and private balcony.",
      features: ["Ocean View", "Private Balcony", "Pool"],
      agent: "Carmen López",
    },
    {
      id: 17,
      title: "Colonial House La Matuna",
      type: "sale",
      price: 260000,
      location: "La Matuna, Cartagena",
      bedrooms: 3,
      bathrooms: 3,
      sqft: 2690,
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
      description: "Restored colonial house in the emerging La Matuna neighborhood.",
      features: ["Restored", "Central Patio", "Parking"],
      agent: "Fernando Aguilar",
    },
    {
      id: 18,
      title: "Modern Villa El Laguito",
      type: "rental",
      pricePerNight: 185,
      location: "El Laguito, Cartagena",
      bedrooms: 4,
      bathrooms: 4,
      sqft: 3230,
      image: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=800&h=600&fit=crop",
      description: "Modern villa with private pool and direct lagoon access.",
      features: ["Private Pool", "Garden", "BBQ"],
      agent: "Patricia Morales",
    },
    {
      id: 19,
      title: "Design Studio Bocagrande",
      type: "rental",
      pricePerNight: 75,
      location: "Bocagrande, Cartagena",
      bedrooms: 1,
      bathrooms: 1,
      sqft: 805,
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      description: "Minimalist studio with contemporary design and partial ocean view.",
      features: ["Minimalist Design", "Partial View", "WiFi"],
      agent: "Andrés Castro",
    },
    {
      id: 20,
      title: "Stately House San Diego",
      type: "sale",
      price: 750000,
      location: "San Diego, Cartagena",
      bedrooms: 5,
      bathrooms: 5,
      sqft: 4090,
      image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop",
      description: "Majestic stately house with colonial architecture and lush gardens.",
      features: ["Colonial Architecture", "Gardens", "Garage"],
      agent: "Ricardo Herrera",
    },
    {
      id: 21,
      title: "Luxury Apartment Castillogrande",
      type: "rental",
      pricePerNight: 115,
      location: "Castillogrande, Cartagena",
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1400,
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
      description: "Luxury apartment with premium finishes and spectacular view.",
      features: ["Premium Finishes", "Spectacular View", "Gym"],
      agent: "Valentina Cruz",
    },
    {
      id: 22,
      title: "Artistic Loft Getsemaní",
      type: "rental",
      pricePerNight: 85,
      location: "Getsemaní, Cartagena",
      bedrooms: 1,
      bathrooms: 1,
      sqft: 1022,
      image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop",
      description: "Loft with artistic decoration in the cultural heart of Cartagena.",
      features: ["Original Art", "Cultural Location", "AC"],
      agent: "Gabriel Ospina",
    },
    {
      id: 23,
      title: "Executive Villa Manga",
      type: "sale",
      price: 385000,
      location: "Manga, Cartagena",
      bedrooms: 4,
      bathrooms: 4,
      sqft: 3335,
      image: "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&h=600&fit=crop",
      description: "Executive villa in exclusive residential sector with all amenities.",
      features: ["Exclusive Sector", "Pool", "24h Security"],
      agent: "Mónica Jiménez",
    },
    {
      id: 24,
      title: "Boutique House Historic Center",
      type: "sale",
      price: 560000,
      location: "Historic Center, Cartagena",
      bedrooms: 3,
      bathrooms: 3,
      sqft: 2795,
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
      description: "Boutique house completely renovated in the heart of the historic center.",
      features: ["Completely Renovated", "Premium Location", "Patio"],
      agent: "Sebastián Vega",
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

  // Generate multiple images from Unsplash URL for carousel
  const generateCarouselImages = (baseUrl) => {
    if (!baseUrl || !baseUrl.includes('unsplash')) return [baseUrl];

    const variations = [
      baseUrl,
      baseUrl.replace('?w=800&h=600', '?w=800&h=600&crop=entropy'),
      baseUrl.replace('?w=800&h=600', '?w=800&h=600&auto=format&fit=crop&q=80'),
      baseUrl.replace('photo', 'photo-1580587771525-78b9dba3b914').replace('?w=800&h=600', '?w=800&h=600&crop=faces'),
    ];
    return variations;
  };

  // Carousel effect on hover
  useEffect(() => {
    let interval;
    if (hoveredCard !== null) {
      interval = setInterval(() => {
        setCarouselIndex(prev => {
          const property = filteredProperties.find(p => p.id === hoveredCard);
          if (!property) return prev;

          const images = generateCarouselImages(property.image);
          const currentIndex = prev[hoveredCard] || 0;
          const nextIndex = (currentIndex + 1) % images.length;

          return { ...prev, [hoveredCard]: nextIndex };
        });
      }, 4000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [hoveredCard, filteredProperties]);

  // USD to COP conversion rate
  const USD_TO_COP_RATE = 4000;

  // Price formatting function
  const formatPrice = (price, currency, locale) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Get price display for each property
  const getPriceDisplay = (property) => {
    let price;
    if (property.type === 'rental') {
      price = property.pricePerNight || property.price_per_night || 450000;
    } else {
      price = property.price || 1200000000;
    }

    let display = '';
    if (language === 'es') {
      display = formatPrice(price, 'COP', 'es-CO');
    } else {
      const priceUSD = price / USD_TO_COP_RATE;
      display = formatPrice(priceUSD, 'USD', 'en-US');
    }

    if (property.type === 'rental') {
      return language === 'es' ? `${display}/noche` : `${display}/night`;
    } else {
      return display;
    }
  };

  if (loading) return <div className="loading">{t.loadingText}</div>;

  return (
    <div className="home">
      {/* 5. Eliminar el botón de idioma de aquí */}

      {/* Enhanced Colombian Hero Section */}
      <section className="hero colombian-hero">
        <div className="colombian-flag-accent"></div>
        <div className="hero-content">
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
            {filteredProperties.map(property => {
              const carouselImages = generateCarouselImages(property.image);
              const currentImageIndex = carouselIndex[property.id] || 0;
              const currentImage = carouselImages[currentImageIndex];

              return (
              <Link key={property.id} to={`/property/${property.id}`} className="property-card-link">
                <div
                  className="property-card"
                  onMouseEnter={() => setHoveredCard(property.id)}
                  onMouseLeave={() => {
                    setHoveredCard(null);
                    setCarouselIndex(prev => ({ ...prev, [property.id]: 0 }));
                  }}
                >
                  <div className="property-image">
                    <img
                      src={currentImage}
                      alt={property.title}
                      className="carousel-image"
                    />
                    <div className={`property-type-badge ${property.type}`}>
                      {property.type === 'rental' ? t.forRent : t.forSale}
                    </div>
                    <div className="price-badge">
                      {getPriceDisplay(property)}
                    </div>
                  </div>
                <div className="property-content">
                  {/* Strategic Engagement Indicators - Applied to select properties */}
                  {property.id <= 3 && (
                    <div className="engagement-indicators">
                      {property.id === 2 && (
                        <div className="urgency-badge shimmer">
                          ⚡ Solo 3 disponibles
                        </div>
                      )}
                      {property.id === 3 && (
                        <div className="trending-badge glow">
                          🔥 Tendencia popular
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="property-header">
                    <h3 className="property-title">{property.title}</h3>
                    {/* Premium badges for high-value properties */}
                    {property.id <= 2 && (
                      <span className="premium-badge">✨ Premium</span>
                    )}
                  </div>
                  
                  <p className="property-location"><TbMapPin className="icon" /> {property.location}</p>

                  <div className="property-features">
                    <span className="feature"><TbBed className="icon" /> {property.bedrooms}</span>
                    <span className="feature"><TbBath className="icon" /> {property.bathrooms}</span>
                    <span className="feature"><TbRuler2 className="icon" /> {property.sqft}m²</span>
                    {/* Value indicators for select properties */}
                    {property.type === 'sale' && property.id <= 4 && (
                      <span className="value-indicator"><TbDiamond className="icon" /> Gran valor</span>
                    )}
                  </div>
                  
                  <div className="property-footer">
                    <div className="amenities-section">
                      {property.features.slice(0, 2).map((feature, index) => (
                        <span key={index} className="amenity-tag">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                </div>
              </Link>
            );
            })}
          </div>
        </div>
      </section>
      
      {/* WhatsApp Business Float */}
      <WhatsAppFloat />
    </div>
  );
}

export default Home;