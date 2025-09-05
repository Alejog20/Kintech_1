const Database = require('better-sqlite3');
const path = require('path');

// Initialize SQLite database
const dbPath = path.join(__dirname, 'luxury_properties.db');
const db = new Database(dbPath);

// Create properties table if it doesn't exist
const createPropertiesTable = `
CREATE TABLE IF NOT EXISTS properties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL, -- 'sale' or 'rental'
    price REAL,
    price_per_night REAL,
    location TEXT NOT NULL,
    neighborhood TEXT,
    address TEXT,
    bedrooms INTEGER,
    bathrooms INTEGER,
    sqft REAL,
    image_url TEXT,
    images TEXT, -- JSON array of image URLs
    features TEXT, -- JSON array of features
    agent_name TEXT,
    agent_contact TEXT,
    is_luxury BOOLEAN DEFAULT 0,
    is_oceanfront BOOLEAN DEFAULT 0,
    is_featured BOOLEAN DEFAULT 0,
    status TEXT DEFAULT 'available', -- 'available', 'pending', 'sold', 'rented'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    latitude REAL,
    longitude REAL,
    video_url TEXT,
    virtual_tour_url TEXT,
    amenities TEXT, -- JSON array of amenities
    nearby_attractions TEXT, -- JSON array of nearby attractions
    availability_calendar TEXT, -- JSON object for rental availability
    min_stay INTEGER, -- minimum stay for rentals
    max_guests INTEGER,
    check_in_time TEXT,
    check_out_time TEXT,
    house_rules TEXT,
    cancellation_policy TEXT
);
`;

// Create indexes for better search performance
const createIndexes = [
    `CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);`,
    `CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(location);`,
    `CREATE INDEX IF NOT EXISTS idx_properties_neighborhood ON properties(neighborhood);`,
    `CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);`,
    `CREATE INDEX IF NOT EXISTS idx_properties_price_per_night ON properties(price_per_night);`,
    `CREATE INDEX IF NOT EXISTS idx_properties_is_luxury ON properties(is_luxury);`,
    `CREATE INDEX IF NOT EXISTS idx_properties_is_oceanfront ON properties(is_oceanfront);`,
    `CREATE INDEX IF NOT EXISTS idx_properties_is_featured ON properties(is_featured);`,
    `CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);`
];

// Create bookings table for rentals
const createBookingsTable = `
CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    property_id INTEGER NOT NULL,
    guest_name TEXT NOT NULL,
    guest_email TEXT NOT NULL,
    guest_phone TEXT,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    guests_count INTEGER NOT NULL,
    total_price REAL NOT NULL,
    status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled', 'completed'
    special_requests TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id)
);
`;

// Create inquiries table for sales
const createInquiriesTable = `
CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    property_id INTEGER NOT NULL,
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT,
    message TEXT,
    inquiry_type TEXT DEFAULT 'general', -- 'general', 'viewing', 'offer'
    status TEXT DEFAULT 'new', -- 'new', 'contacted', 'qualified', 'closed'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id)
);
`;

// Initialize database
try {
    db.exec(createPropertiesTable);
    createIndexes.forEach(index => db.exec(index));
    db.exec(createBookingsTable);
    db.exec(createInquiriesTable);
    console.log('Database initialized successfully');
} catch (error) {
    console.error('Error initializing database:', error);
}

// Prepared statements for better performance
const statements = {
    // Properties
    insertProperty: db.prepare(`
        INSERT INTO properties (
            title, description, type, price, price_per_night, location, neighborhood,
            address, bedrooms, bathrooms, sqft, image_url, images, features,
            agent_name, agent_contact, is_luxury, is_oceanfront, is_featured,
            latitude, longitude, video_url, virtual_tour_url, amenities,
            nearby_attractions, availability_calendar, min_stay, max_guests,
            check_in_time, check_out_time, house_rules, cancellation_policy
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `),
    
    updateProperty: db.prepare(`
        UPDATE properties SET
            title = ?, description = ?, type = ?, price = ?, price_per_night = ?,
            location = ?, neighborhood = ?, address = ?, bedrooms = ?, bathrooms = ?,
            sqft = ?, image_url = ?, images = ?, features = ?, agent_name = ?,
            agent_contact = ?, is_luxury = ?, is_oceanfront = ?, is_featured = ?,
            latitude = ?, longitude = ?, video_url = ?, virtual_tour_url = ?,
            amenities = ?, nearby_attractions = ?, availability_calendar = ?,
            min_stay = ?, max_guests = ?, check_in_time = ?, check_out_time = ?,
            house_rules = ?, cancellation_policy = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `),
    
    deleteProperty: db.prepare('DELETE FROM properties WHERE id = ?'),
    getPropertyById: db.prepare('SELECT * FROM properties WHERE id = ?'),
    getAllProperties: db.prepare('SELECT * FROM properties WHERE status = ? ORDER BY is_featured DESC, created_at DESC'),
    getPropertiesByType: db.prepare('SELECT * FROM properties WHERE type = ? AND status = ? ORDER BY is_featured DESC, created_at DESC'),
    searchProperties: db.prepare(`
        SELECT * FROM properties 
        WHERE status = 'available' AND (
            title LIKE ? OR 
            description LIKE ? OR 
            location LIKE ? OR 
            neighborhood LIKE ? OR 
            address LIKE ?
        )
        ORDER BY is_featured DESC, created_at DESC
    `),
    
    // Bookings
    insertBooking: db.prepare(`
        INSERT INTO bookings (
            property_id, guest_name, guest_email, guest_phone, check_in_date,
            check_out_date, guests_count, total_price, special_requests
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `),
    
    getBookingsByProperty: db.prepare('SELECT * FROM bookings WHERE property_id = ? ORDER BY created_at DESC'),
    
    // Inquiries
    insertInquiry: db.prepare(`
        INSERT INTO inquiries (
            property_id, client_name, client_email, client_phone, message, inquiry_type
        ) VALUES (?, ?, ?, ?, ?, ?)
    `),
    
    getInquiriesByProperty: db.prepare('SELECT * FROM inquiries WHERE property_id = ? ORDER BY created_at DESC')
};

// Database service functions
const PropertyService = {
    // Create a new property
    createProperty(propertyData) {
        try {
            const result = statements.insertProperty.run(
                propertyData.title,
                propertyData.description,
                propertyData.type,
                propertyData.price || null,
                propertyData.pricePerNight || null,
                propertyData.location,
                propertyData.neighborhood || null,
                propertyData.address || null,
                propertyData.bedrooms || 0,
                propertyData.bathrooms || 0,
                propertyData.sqft || 0,
                propertyData.imageUrl || null,
                JSON.stringify(propertyData.images || []),
                JSON.stringify(propertyData.features || []),
                propertyData.agentName || null,
                propertyData.agentContact || null,
                propertyData.isLuxury ? 1 : 0,
                propertyData.isOceanfront ? 1 : 0,
                propertyData.isFeatured ? 1 : 0,
                propertyData.latitude || null,
                propertyData.longitude || null,
                propertyData.videoUrl || null,
                propertyData.virtualTourUrl || null,
                JSON.stringify(propertyData.amenities || []),
                JSON.stringify(propertyData.nearbyAttractions || []),
                JSON.stringify(propertyData.availabilityCalendar || {}),
                propertyData.minStay || null,
                propertyData.maxGuests || null,
                propertyData.checkInTime || null,
                propertyData.checkOutTime || null,
                propertyData.houseRules || null,
                propertyData.cancellationPolicy || null
            );
            return result.lastInsertRowid;
        } catch (error) {
            console.error('Error creating property:', error);
            throw error;
        }
    },

    // Get all properties
    getAllProperties(status = 'available') {
        try {
            const properties = statements.getAllProperties.all(status);
            return properties.map(this.parseProperty);
        } catch (error) {
            console.error('Error getting all properties:', error);
            throw error;
        }
    },

    // Get properties by type
    getPropertiesByType(type, status = 'available') {
        try {
            const properties = statements.getPropertiesByType.all(type, status);
            return properties.map(this.parseProperty);
        } catch (error) {
            console.error('Error getting properties by type:', error);
            throw error;
        }
    },

    // Search properties
    searchProperties(query) {
        try {
            const searchTerm = `%${query}%`;
            const properties = statements.searchProperties.all(
                searchTerm, searchTerm, searchTerm, searchTerm, searchTerm
            );
            return properties.map(this.parseProperty);
        } catch (error) {
            console.error('Error searching properties:', error);
            throw error;
        }
    },

    // Get property by ID
    getPropertyById(id) {
        try {
            const property = statements.getPropertyById.get(id);
            return property ? this.parseProperty(property) : null;
        } catch (error) {
            console.error('Error getting property by ID:', error);
            throw error;
        }
    },

    // Parse property data (convert JSON strings back to objects)
    parseProperty(property) {
        return {
            ...property,
            images: property.images ? JSON.parse(property.images) : [],
            features: property.features ? JSON.parse(property.features) : [],
            amenities: property.amenities ? JSON.parse(property.amenities) : [],
            nearbyAttractions: property.nearby_attractions ? JSON.parse(property.nearby_attractions) : [],
            availabilityCalendar: property.availability_calendar ? JSON.parse(property.availability_calendar) : {},
            isLuxury: Boolean(property.is_luxury),
            isOceanfront: Boolean(property.is_oceanfront),
            isFeatured: Boolean(property.is_featured)
        };
    },

    // Create booking
    createBooking(bookingData) {
        try {
            const result = statements.insertBooking.run(
                bookingData.propertyId,
                bookingData.guestName,
                bookingData.guestEmail,
                bookingData.guestPhone || null,
                bookingData.checkInDate,
                bookingData.checkOutDate,
                bookingData.guestsCount,
                bookingData.totalPrice,
                bookingData.specialRequests || null
            );
            return result.lastInsertRowid;
        } catch (error) {
            console.error('Error creating booking:', error);
            throw error;
        }
    },

    // Create inquiry
    createInquiry(inquiryData) {
        try {
            const result = statements.insertInquiry.run(
                inquiryData.propertyId,
                inquiryData.clientName,
                inquiryData.clientEmail,
                inquiryData.clientPhone || null,
                inquiryData.message || null,
                inquiryData.inquiryType || 'general'
            );
            return result.lastInsertRowid;
        } catch (error) {
            console.error('Error creating inquiry:', error);
            throw error;
        }
    }
};

module.exports = {
    db,
    PropertyService
};