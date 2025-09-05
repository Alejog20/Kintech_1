const { PropertyService } = require('./properties');

// Enhanced luxury properties data for Cartagena
const luxuryProperties = [
    {
        title: "Villa de Lujo Frente al Mar",
        description: "Espectacular villa moderna con acceso directo a la playa, piscina infinita y acabados de lujo. Diseñada por arquitectos reconocidos internacionalmente, esta propiedad única combina elegancia contemporánea con la calidez tropical de Cartagena.",
        type: "sale",
        price: 2800000000,
        location: "Bocagrande, Cartagena",
        neighborhood: "Bocagrande",
        address: "Avenida San Martín #47-123, Bocagrande",
        bedrooms: 5,
        bathrooms: 6,
        sqft: 450,
        imageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=600&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop"
        ],
        features: ["Playa Privada", "Piscina Infinita", "Gimnasio", "Bodega de Vinos", "Cocina Gourmet"],
        agentName: "Laura Gómez",
        agentContact: "laura.gomez@luxurycartagena.com",
        isLuxury: true,
        isOceanfront: true,
        isFeatured: true,
        latitude: 10.3997,
        longitude: -75.5144,
        videoUrl: "https://www.youtube.com/watch?v=example1",
        virtualTourUrl: "https://virtualtour.example.com/villa1",
        amenities: ["Seguridad 24/7", "Servicio de Playa", "Concierge", "Spa", "Marina Privada"],
        nearbyAttractions: ["Club de Playa Bocagrande", "Centro Comercial La Serrezuela", "Restaurante Club de Pesca"],
        maxGuests: 10
    },
    {
        title: "Apartamento Ejecutivo Centro Histórico",
        description: "Elegante apartamento colonial restaurado en el corazón del centro histórico. Esta joya arquitectónica conserva elementos originales del siglo XVII mientras ofrece todas las comodidades modernas.",
        type: "rental",
        pricePerNight: 450000,
        location: "Ciudad Amurallada, Cartagena",
        neighborhood: "Centro Histórico",
        address: "Calle de los Santos de Piedra #33-41",
        bedrooms: 2,
        bathrooms: 2,
        sqft: 120,
        imageUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1617826359993-23a5165b4617?w=800&h=600&fit=crop"
        ],
        features: ["Balcón Colonial", "AC Central", "WiFi", "Terraza Privada"],
        agentName: "Carlos Rivas",
        agentContact: "carlos.rivas@luxurycartagena.com",
        isLuxury: true,
        isOceanfront: false,
        isFeatured: true,
        latitude: 10.4236,
        longitude: -75.5478,
        amenities: ["WiFi de Alta Velocidad", "Aire Acondicionado", "Cocina Equipada", "TV por Cable"],
        nearbyAttractions: ["Plaza de Armas", "Catedral de Cartagena", "Museo del Oro Zenú"],
        minStay: 3,
        maxGuests: 4,
        checkInTime: "15:00",
        checkOutTime: "11:00",
        houseRules: "No fumar, No mascotas, No fiestas",
        cancellationPolicy: "Cancelación gratuita hasta 7 días antes"
    },
    {
        title: "Penthouse Moderno Bocagrande",
        description: "Exclusivo penthouse con terraza panorámica y vista 360° al mar Caribe. Ubicado en el edificio más prestigioso de Bocagrande, ofrece servicios de hotel cinco estrellas.",
        type: "sale",
        price: 3500000000,
        location: "Bocagrande, Cartagena",
        neighborhood: "Bocagrande",
        address: "Carrera 1 #8-89, Torre Aquarela, Piso 28",
        bedrooms: 4,
        bathrooms: 5,
        sqft: 380,
        imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop"
        ],
        features: ["Terraza 360°", "Jacuzzi", "Ascensor Privado", "Smart Home", "Bodega Climatizada"],
        agentName: "Sofía Pérez",
        agentContact: "sofia.perez@luxurycartagena.com",
        isLuxury: true,
        isOceanfront: true,
        isFeatured: true,
        latitude: 10.3997,
        longitude: -75.5144,
        videoUrl: "https://www.youtube.com/watch?v=example2",
        virtualTourUrl: "https://virtualtour.example.com/penthouse1",
        amenities: ["Piscina Infinita", "Spa", "Gimnasio", "Valet Parking", "Room Service"],
        nearbyAttractions: ["Playa de Bocagrande", "Casino Rio", "Centro Comercial Bocagrande"],
        maxGuests: 8
    },
    {
        title: "Casa Colonial Getsemaní",
        description: "Auténtica casa colonial con patio central y arte urbano en las cercanías. Perfectamente renovada manteniendo su encanto histórico mientras incorpora tecnología moderna.",
        type: "rental",
        pricePerNight: 380000,
        location: "Getsemaní, Cartagena",
        neighborhood: "Getsemaní",
        address: "Calle del Arsenal #25-18",
        bedrooms: 3,
        bathrooms: 3,
        sqft: 200,
        imageUrl: "https://images.unsplash.com/photo-1617826359993-23a5165b4617?w=800&h=600&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1617826359993-23a5165b4617?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1628744444594-5a345107e335?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&h=600&fit=crop"
        ],
        features: ["Patio Central", "Arte Local", "Cocina Gourmet", "Terraza en Azotea"],
        agentName: "Andrés Jaramillo",
        agentContact: "andres.jaramillo@luxurycartagena.com",
        isLuxury: false,
        isOceanfront: false,
        isFeatured: false,
        latitude: 10.4278,
        longitude: -75.5456,
        amenities: ["WiFi", "AC", "Cocina Completa", "Lavadora"],
        nearbyAttractions: ["Plaza de la Trinidad", "Murallas de Cartagena", "Café Havana"],
        minStay: 2,
        maxGuests: 6,
        checkInTime: "14:00",
        checkOutTime: "11:00",
        houseRules: "No fumar en interiores, Mascotas permitidas con depósito adicional",
        cancellationPolicy: "Cancelación moderada - 5 días antes"
    },
    {
        title: "Apartamento Moderno Manga",
        description: "Moderno apartamento en exclusivo conjunto residencial con amenidades completas. Diseño contemporáneo con vistas panorámicas de la bahía de Cartagena.",
        type: "sale",
        price: 1200000000,
        location: "Manga, Cartagena",
        neighborhood: "Manga",
        address: "Avenida Primera de Manga #22-45",
        bedrooms: 3,
        bathrooms: 3,
        sqft: 180,
        imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=800&h=600&fit=crop"
        ],
        features: ["Piscina", "Zona BBQ", "Seguridad 24h", "Gimnasio", "Salón Social"],
        agentName: "María Fernández",
        agentContact: "maria.fernandez@luxurycartagena.com",
        isLuxury: false,
        isOceanfront: false,
        isFeatured: false,
        latitude: 10.4089,
        longitude: -75.5356,
        amenities: ["Piscina", "Gimnasio", "Zona BBQ", "Parqueadero", "Portería"],
        nearbyAttractions: ["Club Naval", "Manga Beach", "Centro Comercial La Plazuela"],
        maxGuests: 6
    },
    {
        title: "Loft Artístico La Matuna",
        description: "Creativo loft con diseño moderno en el emergente barrio de La Matuna. Espacio versátil perfecto para creativos y profesionales que buscan un ambiente único.",
        type: "rental",
        pricePerNight: 320000,
        location: "La Matuna, Cartagena",
        neighborhood: "La Matuna",
        address: "Calle 30 #17-89",
        bedrooms: 1,
        bathrooms: 1,
        sqft: 85,
        imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop"
        ],
        features: ["Diseño Único", "Luz Natural", "Zona Trabajo", "Techos Altos"],
        agentName: "Diego Martínez",
        agentContact: "diego.martinez@luxurycartagena.com",
        isLuxury: false,
        isOceanfront: false,
        isFeatured: false,
        latitude: 10.4167,
        longitude: -75.5500,
        amenities: ["WiFi de Alta Velocidad", "AC", "Cocina Americana", "Balcón"],
        nearbyAttractions: ["Centro de Cartagena", "Parque del Centenario", "Universidad de Cartagena"],
        minStay: 1,
        maxGuests: 2,
        checkInTime: "15:00",
        checkOutTime: "11:00",
        houseRules: "No fumar, No mascotas, Respetar horarios de silencio",
        cancellationPolicy: "Cancelación flexible"
    }
];

// Function to seed the database
async function seedDatabase() {
    console.log('Starting database seeding...');
    
    try {
        for (const property of luxuryProperties) {
            const propertyId = PropertyService.createProperty(property);
            console.log(`Created property: ${property.title} (ID: ${propertyId})`);
        }
        
        console.log('Database seeding completed successfully!');
        console.log(`Total properties created: ${luxuryProperties.length}`);
        
        // Display summary
        const allProperties = PropertyService.getAllProperties();
        console.log(`\nDatabase Summary:`);
        console.log(`- Total properties: ${allProperties.length}`);
        console.log(`- For sale: ${allProperties.filter(p => p.type === 'sale').length}`);
        console.log(`- For rental: ${allProperties.filter(p => p.type === 'rental').length}`);
        console.log(`- Luxury properties: ${allProperties.filter(p => p.isLuxury).length}`);
        console.log(`- Oceanfront properties: ${allProperties.filter(p => p.isOceanfront).length}`);
        console.log(`- Featured properties: ${allProperties.filter(p => p.isFeatured).length}`);
        
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    seedDatabase().then(() => {
        console.log('Seeding process completed. Exiting...');
        process.exit(0);
    });
}

module.exports = { seedDatabase, luxuryProperties };