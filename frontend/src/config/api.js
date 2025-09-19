// API Configuration for dual backend architecture

// API Base URLs
export const API_CONFIG = {
  // Flask Auth API (port 5001)
  AUTH_API: process.env.REACT_APP_AUTH_API_URL || 'http://localhost:5001',

  // Node.js Property API (port 5000)
  PROPERTY_API: process.env.REACT_APP_PROPERTY_API_URL || 'http://localhost:5000',

  // Frontend URL
  FRONTEND_URL: process.env.REACT_APP_FRONTEND_URL || 'http://localhost:3000'
};

// API Endpoints
export const ENDPOINTS = {
  // Authentication endpoints (Flask - port 5001)
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    GOOGLE_LOGIN: '/api/auth/google/login',
    GOOGLE_CALLBACK: '/api/auth/google/callback',
    ME: '/api/auth/me'
  },

  // Admin endpoints (Flask - port 5001)
  ADMIN: {
    PROPERTIES: '/api/admin/properties',
    UPLOAD_IMAGE: '/api/admin/upload-image'
  },

  // Property endpoints (Node.js - port 5000)
  PROPERTIES: {
    LIST: '/api/properties',
    SEARCH: '/api/properties/search',
    DETAIL: '/api/properties/:id',
    STATS: '/api/stats'
  },

  // Booking endpoints (Node.js - port 5000)
  BOOKINGS: {
    CREATE: '/api/bookings'
  },

  // Inquiry endpoints (Node.js - port 5000)
  INQUIRIES: {
    CREATE: '/api/inquiries'
  }
};

// Helper function to build full API URLs
export const buildApiUrl = (apiType, endpoint, params = {}) => {
  const baseUrl = apiType === 'auth' || apiType === 'admin'
    ? API_CONFIG.AUTH_API
    : API_CONFIG.PROPERTY_API;

  let url = baseUrl + endpoint;

  // Replace URL parameters (e.g., :id)
  Object.keys(params).forEach(key => {
    url = url.replace(`:${key}`, params[key]);
  });

  return url;
};

// Fetch helper with proper API routing
export const apiRequest = async (apiType, endpoint, options = {}) => {
  const url = buildApiUrl(apiType, endpoint, options.params);

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request error for ${url}:`, error);
    throw error;
  }
};