// src/mocks/handlers.js
import { rest, HttpResponse } from 'msw';
import { API_CONFIG } from '../config/api';

export const handlers = [
  // Property API mocks (Node.js backend - port 5000)
  rest.get(`${API_CONFIG.PROPERTY_API}/api/properties`, () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          id: 1,
          title: 'Test Property',
          description: 'A test property for unit testing',
          type: 'sale',
          price: 1000000,
          location: 'Test Location',
          bedrooms: 3,
          bathrooms: 2,
          sqft: 150,
          isLuxury: true,
          isOceanfront: false,
          isFeatured: true
        }
      ],
      count: 1
    });
  }),

  rest.get(`${API_CONFIG.PROPERTY_API}/api/properties/:id`, ({ params }) => {
    const { id } = params;
    return HttpResponse.json({
      success: true,
      data: {
        id: parseInt(id),
        title: `Test Property ${id}`,
        description: 'A test property for unit testing',
        type: 'sale',
        price: 1000000,
        location: 'Test Location',
        bedrooms: 3,
        bathrooms: 2,
        sqft: 150,
        isLuxury: true,
        isOceanfront: false,
        isFeatured: true
      }
    });
  }),

  // Auth API mocks (Flask backend - port 5001)
  rest.post(`${API_CONFIG.AUTH_API}/api/auth/login`, () => {
    return HttpResponse.json({
      access_token: 'mock-jwt-token',
      user: {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'user'
      }
    });
  }),

  rest.get(`${API_CONFIG.AUTH_API}/api/auth/me`, () => {
    return HttpResponse.json({
      logged_in_as: {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'user'
      }
    });
  }),

  rest.post(`${API_CONFIG.AUTH_API}/api/auth/register`, async ({ request }) => {
    const newUser = await request.json();
    if (newUser.email === 'existing@example.com') {
      return HttpResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }
    return HttpResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    );
  }),

  // Booking API mocks
  rest.post(`${API_CONFIG.PROPERTY_API}/api/bookings`, () => {
    return HttpResponse.json({
      success: true,
      message: 'Booking created successfully',
      bookingId: 123
    });
  }),

  // Error handlers for testing error states
  rest.get(`${API_CONFIG.PROPERTY_API}/api/properties/error`, () => {
    return HttpResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  })
];