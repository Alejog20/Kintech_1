// Jest setup file for Node.js API tests
const { PropertyService, db } = require('../database/properties');

// Setup test database before all tests
beforeAll(async () => {
  // Initialize test database
  console.log('Setting up test database...');
});

// Clean up after each test
afterEach(async () => {
  // Clean up test data if needed
  // For SQLite, we could delete all test records
});

// Clean up after all tests
afterAll(async () => {
  // Close database connections
  if (db) {
    db.close();
  }
  console.log('Test database cleanup completed');
});

// Global test helpers
global.testHelpers = {
  createTestProperty: (overrides = {}) => ({
    title: 'Test Property',
    description: 'A test property for unit testing',
    type: 'sale',
    price: 1000000,
    location: 'Test Location, Cartagena',
    neighborhood: 'Test Neighborhood',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 150,
    agentName: 'Test Agent',
    agentContact: 'agent@test.com',
    isLuxury: false,
    isOceanfront: false,
    isFeatured: false,
    ...overrides
  }),

  createTestBooking: (overrides = {}) => ({
    propertyId: 1,
    guestName: 'Test Guest',
    guestEmail: 'guest@test.com',
    guestPhone: '+1234567890',
    checkInDate: '2024-12-01',
    checkOutDate: '2024-12-05',
    guestsCount: 2,
    totalPrice: 1000000,
    specialRequests: 'Test request',
    ...overrides
  })
};