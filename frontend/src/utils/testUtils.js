// Testing utilities for React components
import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { LanguageContext } from '../context/LanguageContext';
import { LikeContext } from '../context/LikeContext';

// Mock contexts for testing
const mockAuthContext = {
  user: null,
  login: jest.fn(),
  logout: jest.fn(),
  register: jest.fn(),
  isLoading: false
};

const mockThemeContext = {
  theme: 'light',
  toggleTheme: jest.fn()
};

const mockLanguageContext = {
  language: 'en',
  setLanguage: jest.fn(),
  t: (key) => key // Simple translation mock
};

const mockLikeContext = {
  likedProperties: [],
  isLiked: jest.fn(() => false),
  addLike: jest.fn(),
  removeLike: jest.fn()
};

// Custom render function that includes all providers
export const renderWithProviders = (
  ui,
  {
    authContext = mockAuthContext,
    themeContext = mockThemeContext,
    languageContext = mockLanguageContext,
    likeContext = mockLikeContext,
    route = '/',
    ...renderOptions
  } = {}
) => {
  window.history.pushState({}, 'Test page', route);

  const Wrapper = ({ children }) => (
    <BrowserRouter>
      <AuthContext.Provider value={authContext}>
        <ThemeContext.Provider value={themeContext}>
          <LanguageContext.Provider value={languageContext}>
            <LikeContext.Provider value={likeContext}>
              {children}
            </LikeContext.Provider>
          </LanguageContext.Provider>
        </ThemeContext.Provider>
      </AuthContext.Provider>
    </BrowserRouter>
  );

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    mockAuthContext,
    mockThemeContext,
    mockLanguageContext,
    mockLikeContext
  };
};

// Helper to create authenticated user context
export const createAuthenticatedUser = (overrides = {}) => ({
  ...mockAuthContext,
  user: {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    role: 'user',
    ...overrides
  }
});

// Helper to create admin user context
export const createAdminUser = (overrides = {}) => ({
  ...mockAuthContext,
  user: {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    ...overrides
  }
});

// Mock property data for testing
export const mockProperty = {
  id: 1,
  title: 'Test Property',
  description: 'A beautiful test property',
  type: 'sale',
  price: 1000000,
  location: 'Test Location, Cartagena',
  neighborhood: 'Test Neighborhood',
  bedrooms: 3,
  bathrooms: 2,
  sqft: 150,
  images: ['https://example.com/image1.jpg'],
  features: ['Pool', 'Garden'],
  amenities: ['WiFi', 'AC'],
  isLuxury: true,
  isOceanfront: false,
  isFeatured: true,
  agentName: 'Test Agent',
  agentContact: 'agent@test.com'
};

// Mock rental property
export const mockRentalProperty = {
  ...mockProperty,
  type: 'rental',
  price: null,
  pricePerNight: 250000,
  minStay: 2,
  maxGuests: 6,
  checkInTime: '15:00',
  checkOutTime: '11:00',
  houseRules: 'No smoking, No pets',
  cancellationPolicy: 'Flexible'
};

// Helper to wait for async operations
export const waitForLoadingToFinish = () =>
  new Promise(resolve => setTimeout(resolve, 0));

// Re-export everything from React Testing Library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';