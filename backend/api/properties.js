const express = require('express');
const cors = require('cors');
const { PropertyService } = require('../database/properties');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Luxury Real Estate API - Cartagena',
        version: '1.0.0',
        endpoints: {
            properties: '/api/properties',
            search: '/api/properties/search',
            property: '/api/properties/:id',
            bookings: '/api/bookings',
            inquiries: '/api/inquiries'
        }
    });
});

// Get all properties
app.get('/api/properties', async (req, res) => {
    try {
        const { type, status } = req.query;
        let properties;
        
        if (type && type !== 'all') {
            properties = PropertyService.getPropertiesByType(type, status || 'available');
        } else {
            properties = PropertyService.getAllProperties(status || 'available');
        }
        
        res.json({
            success: true,
            data: properties,
            count: properties.length
        });
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching properties',
            error: error.message
        });
    }
});

// Search properties
app.get('/api/properties/search', async (req, res) => {
    try {
        const { q, type, location, minPrice, maxPrice, bedrooms, luxury, oceanfront } = req.query;
        
        let properties;
        
        if (q) {
            properties = PropertyService.searchProperties(q);
        } else {
            properties = PropertyService.getAllProperties();
        }
        
        // Apply additional filters
        if (type && type !== 'all') {
            properties = properties.filter(p => p.type === type);
        }
        
        if (location) {
            properties = properties.filter(p => 
                p.location.toLowerCase().includes(location.toLowerCase()) ||
                p.neighborhood.toLowerCase().includes(location.toLowerCase())
            );
        }
        
        if (minPrice) {
            properties = properties.filter(p => {
                const price = p.type === 'rental' ? p.price_per_night : p.price;
                return price >= parseFloat(minPrice);
            });
        }
        
        if (maxPrice) {
            properties = properties.filter(p => {
                const price = p.type === 'rental' ? p.price_per_night : p.price;
                return price <= parseFloat(maxPrice);
            });
        }
        
        if (bedrooms) {
            properties = properties.filter(p => p.bedrooms >= parseInt(bedrooms));
        }
        
        if (luxury === 'true') {
            properties = properties.filter(p => p.isLuxury);
        }
        
        if (oceanfront === 'true') {
            properties = properties.filter(p => p.isOceanfront);
        }
        
        res.json({
            success: true,
            data: properties,
            count: properties.length,
            query: req.query
        });
    } catch (error) {
        console.error('Error searching properties:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching properties',
            error: error.message
        });
    }
});

// Get property by ID
app.get('/api/properties/:id', async (req, res) => {
    try {
        const property = PropertyService.getPropertyById(parseInt(req.params.id));
        
        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }
        
        res.json({
            success: true,
            data: property
        });
    } catch (error) {
        console.error('Error fetching property:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching property',
            error: error.message
        });
    }
});

// Create new property (for admin use)
app.post('/api/properties', async (req, res) => {
    try {
        const propertyId = PropertyService.createProperty(req.body);
        const newProperty = PropertyService.getPropertyById(propertyId);
        
        res.status(201).json({
            success: true,
            message: 'Property created successfully',
            data: newProperty
        });
    } catch (error) {
        console.error('Error creating property:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating property',
            error: error.message
        });
    }
});

// Create booking
app.post('/api/bookings', async (req, res) => {
    try {
        const {
            propertyId,
            guestName,
            guestEmail,
            guestPhone,
            checkInDate,
            checkOutDate,
            guestsCount,
            totalPrice,
            specialRequests
        } = req.body;
        
        // Validate required fields
        if (!propertyId || !guestName || !guestEmail || !checkInDate || !checkOutDate || !guestsCount) {
            return res.status(400).json({
                success: false,
                message: 'Missing required booking information'
            });
        }
        
        // Check if property exists and is available for rental
        const property = PropertyService.getPropertyById(propertyId);
        if (!property || property.type !== 'rental') {
            return res.status(400).json({
                success: false,
                message: 'Property not available for booking'
            });
        }
        
        const bookingId = PropertyService.createBooking({
            propertyId,
            guestName,
            guestEmail,
            guestPhone,
            checkInDate,
            checkOutDate,
            guestsCount,
            totalPrice: totalPrice || property.price_per_night,
            specialRequests
        });
        
        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            bookingId: bookingId,
            property: {
                title: property.title,
                location: property.location
            }
        });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating booking',
            error: error.message
        });
    }
});

// Create inquiry
app.post('/api/inquiries', async (req, res) => {
    try {
        const {
            propertyId,
            clientName,
            clientEmail,
            clientPhone,
            message,
            inquiryType
        } = req.body;
        
        // Validate required fields
        if (!propertyId || !clientName || !clientEmail) {
            return res.status(400).json({
                success: false,
                message: 'Missing required inquiry information'
            });
        }
        
        // Check if property exists
        const property = PropertyService.getPropertyById(propertyId);
        if (!property) {
            return res.status(400).json({
                success: false,
                message: 'Property not found'
            });
        }
        
        const inquiryId = PropertyService.createInquiry({
            propertyId,
            clientName,
            clientEmail,
            clientPhone,
            message,
            inquiryType: inquiryType || 'general'
        });
        
        res.status(201).json({
            success: true,
            message: 'Inquiry submitted successfully',
            inquiryId: inquiryId,
            property: {
                title: property.title,
                location: property.location
            }
        });
    } catch (error) {
        console.error('Error creating inquiry:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating inquiry',
            error: error.message
        });
    }
});

// Get property statistics (for analytics)
app.get('/api/stats', async (req, res) => {
    try {
        const allProperties = PropertyService.getAllProperties();
        const stats = {
            total: allProperties.length,
            forSale: allProperties.filter(p => p.type === 'sale').length,
            forRental: allProperties.filter(p => p.type === 'rental').length,
            luxury: allProperties.filter(p => p.isLuxury).length,
            oceanfront: allProperties.filter(p => p.isOceanfront).length,
            featured: allProperties.filter(p => p.isFeatured).length,
            neighborhoods: [...new Set(allProperties.map(p => p.neighborhood).filter(Boolean))]
        };
        
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching statistics',
            error: error.message
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`🚀 Luxury Real Estate API running on port ${PORT}`);
    console.log(`📱 API URL: http://localhost:${PORT}`);
    console.log(`📊 Database: SQLite initialized`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
    });
});

module.exports = app;