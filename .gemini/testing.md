# Testing Guidelines for Rentev

## 🎯 Testing Philosophy

**Testing is not optional** - Every feature must have corresponding tests. We follow the **testing pyramid**:
- **70% Unit Tests** - Fast, isolated, specific
- **20% Integration Tests** - Component interactions  
- **10% E2E Tests** - Full user workflows

## 🏗️ Testing Framework Stack

### **Frontend Testing (React)**

**Primary Framework**: **Jest + React Testing Library**
```bash
# Install dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom
```

**Component Testing**: Use React Testing Library for user-centric tests
**Snapshot Testing**: For UI regression prevention
**Hook Testing**: For custom hooks like `useAuth`, `useTheme`

### **Backend Testing (Python Flask)**

**Primary Framework**: **pytest + pytest-flask**
```bash
# Install dependencies
pip install pytest pytest-flask pytest-cov requests-mock
```

**API Testing**: Test endpoints, status codes, response data
**Database Testing**: Test models, relationships, queries
**Authentication Testing**: Test JWT, OAuth flows, permissions

### **End-to-End Testing**

**Framework**: **Playwright** (recommended for Colombian market testing)
```bash
# Install Playwright
npm install --save-dev @playwright/test
```

**Why Playwright**: Better mobile testing (important for Colombian users), multiple browsers, network simulation

## 📋 Testing Standards & File Structure

### **Frontend Test Structure**
```
frontend/src/
├── components/
│   ├── AuthModal.js
│   └── __tests__/
│       └── AuthModal.test.js
├── context/
│   ├── AuthContext.js
│   └── __tests__/
│       └── AuthContext.test.js
├── hooks/
│   ├── useAuth.js
│   └── __tests__/
│       └── useAuth.test.js
└── utils/
    ├── api.js
    └── __tests__/
        └── api.test.js
```

### **Backend Test Structure**
```
backend/
├── tests/
│   ├── __init__.py
│   ├── conftest.py           # pytest configuration
│   ├── test_auth.py          # Authentication tests
│   ├── test_models.py        # Database model tests
│   ├── test_api.py           # API endpoint tests
│   └── fixtures/             # Test data
│       └── users.json
├── app.py
└── models.py
```

### **E2E Test Structure**
```
e2e/
├── tests/
│   ├── auth.spec.js          # Authentication flows
│   ├── properties.spec.js    # Property management
│   └── colombian.spec.js     # Colombia-specific features
├── fixtures/                 # Test data
├── utils/                    # Test helpers
└── playwright.config.js
```

## 🧪 Testing Templates & Examples

### **React Component Test Template**
```javascript
// components/__tests__/AuthModal.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageContext } from '../../context/LanguageContext';
import AuthModal from '../AuthModal';

const mockLanguageContext = {
  language: 'en'
};

const renderWithContext = (component) => {
  return render(
    <LanguageContext.Provider value={mockLanguageContext}>
      {component}
    </LanguageContext.Provider>
  );
};

describe('AuthModal', () => {
  test('displays login tab by default', () => {
    renderWithContext(<AuthModal isOpen={true} onClose={() => {}} />);
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  test('switches to register tab when clicked', async () => {
    const user = userEvent.setup();
    renderWithContext(<AuthModal isOpen={true} onClose={() => {}} />);
    
    await user.click(screen.getByText('Sign Up'));
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  test('validates email format', async () => {
    const user = userEvent.setup();
    renderWithContext(<AuthModal isOpen={true} onClose={() => {}} />);
    
    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'invalid-email');
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
    });
  });
});
```

### **Flask API Test Template**
```python
# tests/test_auth.py
import pytest
import json
from app import app, db, User

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client
            db.drop_all()

def test_register_new_user(client):
    """Test user registration with valid data"""
    response = client.post('/api/auth/register', json={
        'name': 'Juan Pérez',
        'email': 'juan@example.com',
        'password': 'password123'
    })
    
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['message'] == 'User created successfully'

def test_register_duplicate_email(client):
    """Test registration with existing email"""
    # Create first user
    client.post('/api/auth/register', json={
        'name': 'Juan Pérez',
        'email': 'juan@example.com',  
        'password': 'password123'
    })
    
    # Try to create duplicate
    response = client.post('/api/auth/register', json={
        'name': 'María García',
        'email': 'juan@example.com',
        'password': 'password456'
    })
    
    assert response.status_code == 409
    data = json.loads(response.data)
    assert 'already registered' in data['error']

def test_login_valid_credentials(client):
    """Test login with correct credentials"""
    # Register user first
    client.post('/api/auth/register', json={
        'name': 'Juan Pérez',
        'email': 'juan@example.com',
        'password': 'password123'
    })
    
    # Login
    response = client.post('/api/auth/login', json={
        'email': 'juan@example.com',
        'password': 'password123'
    })
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'access_token' in data
```

### **Playwright E2E Test Template**
```javascript
// e2e/tests/auth.spec.js
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001');
  });

  test('should register new user successfully', async ({ page }) => {
    // Click register button in nav
    await page.click('button:has-text("Register")');
    
    // Wait for modal to appear
    await expect(page.locator('.auth-modal')).toBeVisible();
    
    // Fill registration form
    await page.fill('input[type="text"]', 'Juan Pérez');
    await page.fill('input[type="email"]', 'juan@test.com');
    await page.fill('input[type="password"]', 'password123');
    
    // Submit form
    await page.click('button:has-text("Sign Up")');
    
    // Wait for success message
    await expect(page.locator('.auth-success')).toBeVisible();
  });

  test('should handle mobile viewport correctly', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.click('button:has-text("Login")');
    
    // Modal should be mobile-responsive
    const modal = page.locator('.auth-modal');
    await expect(modal).toHaveCSS('width', '95%');
  });

  test('should work with slow Colombian internet speeds', async ({ page }) => {
    // Simulate slow 3G connection
    await page.route('**/*', route => route.continue({ 
      delay: Math.random() * 2000 // 0-2 second delay
    }));
    
    await page.click('button:has-text("Login")');
    
    // Should still work with delays
    await expect(page.locator('.auth-modal')).toBeVisible({ timeout: 10000 });
  });
});
```

## 🌟 Colombian-Specific Testing Requirements

### **Currency Testing**
```javascript
test('displays prices in both COP and USD', async () => {
  // Test Colombian peso formatting
  expect(formatPrice(1000000, 'COP')).toBe('$1.000.000 COP');
  // Test USD formatting  
  expect(formatPrice(250, 'USD')).toBe('$250 USD');
});
```

### **Address Validation Testing**
```javascript
test('validates Colombian addresses', () => {
  const validCartagenaAddress = 'Calle 32 #5-41, Centro Histórico, Cartagena';
  expect(validateColombianAddress(validCartagenaAddress)).toBe(true);
});
```

### **Language Testing**
```javascript
test('switches between Spanish and English correctly', async () => {
  // Test Spanish translations
  renderWithLanguage('es');
  expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
  
  // Test English translations
  renderWithLanguage('en');  
  expect(screen.getByText('Login')).toBeInTheDocument();
});
```

## 🚀 Testing Commands

### **Frontend Testing**
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test AuthModal.test.js
```

### **Backend Testing**
```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test file
pytest tests/test_auth.py

# Run tests matching pattern
pytest -k "test_register"
```

### **E2E Testing**
```bash
# Run all E2E tests
npx playwright test

# Run specific browser
npx playwright test --browser=chromium

# Run with UI mode
npx playwright test --ui

# Generate test report
npx playwright show-report
```

## 📊 Testing Checklist for New Features

Before marking any feature as complete:

- [ ] **Unit tests written** and passing
- [ ] **Integration tests** for API interactions  
- [ ] **Component tests** for React components
- [ ] **E2E test** for critical user paths
- [ ] **Mobile responsive** testing
- [ ] **Spanish/English** language testing
- [ ] **Colombian currency** formatting tests
- [ ] **Error handling** scenarios tested
- [ ] **Accessibility** testing included
- [ ] **Performance** testing on slow connections

## 🎯 Test Coverage Goals

- **Minimum 80% code coverage** for all modules
- **100% coverage** for authentication and payment flows
- **All API endpoints** must have corresponding tests
- **All React components** must have test files
- **Critical user journeys** must have E2E tests

Remember: **Good tests prevent production bugs and enable confident refactoring for Colombian market expansion!**
