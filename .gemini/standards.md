# Coding Standards & Best Practices for Rentev

## 🎯 Code Quality Principles

### **1. Security First**
- Never commit secrets, API keys, or passwords
- Always validate user input (client AND server-side)
- Use parameterized queries to prevent SQL injection
- Implement proper authentication and authorization
- Hash passwords with bcrypt (never store plain text)
- Use HTTPS in production
- Sanitize user-generated content

### **2. Performance & Scalability**
- Optimize for Colombian internet speeds (often slower)
- Implement lazy loading for images and components  
- Use efficient database queries with proper indexing
- Cache frequently accessed data
- Minimize bundle sizes
- Consider mobile-first performance (80% of users)

### **3. Maintainability**
- Write self-documenting code with clear naming
- Follow DRY (Don't Repeat Yourself) principle
- Create reusable components and utilities
- Maintain consistent code formatting
- Add comments for complex business logic
- Use TypeScript when adding new major features

## 📝 Naming Conventions

### **Files & Directories**
```
# React Components - PascalCase
AuthModal.js
PropertyCard.js
SearchFilter.js

# Utilities & Hooks - camelCase  
useAuth.js
formatPrice.js
validateEmail.js

# CSS Files - match component name
AuthModal.css
PropertyCard.css

# Test Files - match source file + .test
AuthModal.test.js
useAuth.test.js

# Directories - kebab-case
components/
auth-forms/
property-listings/
```

### **Variables & Functions**
```javascript
// Variables - camelCase, descriptive
const userAuthToken = 'abc123';
const colombianProperties = [];
const cartagenaListings = [];

// Functions - camelCase, verb-based
function validateColombianAddress() {}
function formatCurrencyCOP() {}
function sendWhatsAppMessage() {}

// Constants - SCREAMING_SNAKE_CASE
const COLOMBIAN_CITIES = ['Cartagena', 'Bogotá', 'Medellín'];
const DEFAULT_CURRENCY = 'COP';
const MAX_PROPERTY_IMAGES = 10;

// Boolean variables - is/has/can prefix
const isAuthenticated = true;
const hasProperty = false;
const canEditListing = user.role === 'admin';
```

### **CSS Classes**
```css
/* BEM Methodology for components */
.property-card { }
.property-card__title { }
.property-card__price { }
.property-card__image--featured { }

/* Utility classes - prefix with 'u-' */
.u-hidden { display: none; }
.u-text-center { text-align: center; }

/* Colombian-specific classes */
.colombia-flag { }
.cartagena-theme { }
.peso-currency { }
```

## 🏗️ Component Architecture Standards

### **React Component Structure**
```javascript
// 1. Imports - external libraries first, then internal
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/currency';
import './PropertyCard.css';

// 2. Component definition with clear props
function PropertyCard({ 
  property, 
  onFavorite, 
  showActions = true,
  displayCurrency = 'COP' 
}) {
  // 3. State and hooks at top
  const [isFavorite, setIsFavorite] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // 4. Effects after state
  useEffect(() => {
    // Load favorite status
  }, [property.id]);

  // 5. Event handlers
  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
    onFavorite?.(property.id);
  };

  // 6. Render helpers (if complex)
  const renderPrice = () => {
    if (displayCurrency === 'COP') {
      return formatPrice(property.priceCOP, 'COP');
    }
    return formatPrice(property.priceUSD, 'USD');
  };

  // 7. Return JSX
  return (
    <div className="property-card">
      {/* Clear, semantic JSX */}
    </div>
  );
}

// 8. PropTypes or default export
export default PropertyCard;
```

### **Custom Hook Pattern**
```javascript
// hooks/useColombianCurrency.js
import { useState, useEffect } from 'react';

export function useColombianCurrency() {
  const [exchangeRate, setExchangeRate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExchangeRate();
  }, []);

  const fetchExchangeRate = async () => {
    try {
      // Fetch COP to USD rate from Colombian central bank API
      const response = await fetch('/api/exchange-rate/cop-usd');
      const data = await response.json();
      setExchangeRate(data.rate);
    } catch (error) {
      console.error('Failed to fetch exchange rate:', error);
    } finally {
      setLoading(false);
    }
  };

  const convertCOPToUSD = (amountCOP) => {
    return exchangeRate ? amountCOP / exchangeRate : null;
  };

  return { exchangeRate, loading, convertCOPToUSD };
}
```

## 🛡️ Error Handling Standards

### **Frontend Error Handling**
```javascript
// API calls with proper error handling
const handleLogin = async (credentials) => {
  setError('');
  setLoading(true);

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      // Handle HTTP errors
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    login(data.access_token);
    
  } catch (error) {
    // User-friendly error messages in Spanish/English
    const errorMessage = error.message.includes('network') 
      ? 'Error de conexión. Por favor, verifica tu internet.'
      : error.message;
    
    setError(errorMessage);
    console.error('Login error:', error);
    
  } finally {
    setLoading(false);
  }
};
```

### **Backend Error Handling**
```python
# Flask API with Colombian context
@app.route('/api/properties', methods=['POST'])
@jwt_required()
def create_property():
    try:
        data = request.get_json()
        
        # Validate Colombian address
        if not validate_colombian_address(data.get('address')):
            return jsonify({
                'error': 'Dirección colombiana inválida',
                'code': 'INVALID_COLOMBIAN_ADDRESS'
            }), 400
        
        # Validate Colombian postal code
        if not validate_colombian_postal_code(data.get('postal_code')):
            return jsonify({
                'error': 'Código postal colombiano inválido', 
                'code': 'INVALID_POSTAL_CODE'
            }), 400
            
        # Create property
        property = Property(**data)
        db.session.add(property)
        db.session.commit()
        
        return jsonify(property.to_dict()), 201
        
    except ValidationError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        app.logger.error(f"Property creation failed: {e}")
        return jsonify({
            'error': 'Error interno del servidor',
            'code': 'INTERNAL_ERROR'
        }), 500
```

## 🌍 Colombian Localization Standards

### **Currency Formatting**
```javascript
// utils/currency.js
export function formatCOPPrice(amount) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(amount);
}

export function formatUSDPrice(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', 
    currency: 'USD'
  }).format(amount);
}

// Usage examples
formatCOPPrice(1500000); // "$1.500.000"
formatUSDPrice(375);     // "$375.00"
```

### **Date Formatting**
```javascript
// Colombian date format
export function formatColombianDate(date) {
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric'
  }).format(date);
}

// Usage: formatColombianDate(new Date()) => "05/09/2024"
```

### **Address Validation**
```javascript
// utils/colombianValidation.js
export function validateColombianAddress(address) {
  // Colombian address format: "Calle 32 #5-41, Centro, Cartagena"
  const colombianAddressRegex = /^(Calle|Carrera|Avenida|Diagonal|Transversal)\s+\d+[A-Za-z]?\s*#\s*\d+-\d+/i;
  return colombianAddressRegex.test(address);
}

export function validateColombianPhone(phone) {
  // Colombian mobile: +57 300 123 4567 or 3001234567
  const mobileRegex = /^(\+57\s?)?(3\d{2}\s?\d{3}\s?\d{4}|[0-9]{10})$/;
  return mobileRegex.test(phone);
}
```

## 📱 Responsive Design Standards

### **Breakpoints (Colombian Mobile Usage)**
```css
/* Mobile First - Colombian users are 80% mobile */
.property-grid {
  display: grid;
  grid-template-columns: 1fr; /* Mobile: single column */
  gap: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .property-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .property-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Large screens */
@media (min-width: 1400px) {
  .property-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### **Touch-Friendly Design**
```css
/* Minimum 44px touch targets (Colombian mobile users) */
.button, .nav-link, .property-card {
  min-height: 44px;
  min-width: 44px;
}

/* Adequate spacing for thumbs */
.button-group .button {
  margin-right: 12px;
  margin-bottom: 12px;
}
```

## 🔐 Security Standards

### **Input Sanitization**
```javascript
// Frontend validation
export function sanitizePropertyTitle(title) {
  return title
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML
    .substring(0, 100);   // Limit length
}

// Backend validation (Python)
from flask import escape

def sanitize_user_input(text):
    return escape(text).strip()[:255]  # Escape HTML, limit length
```

### **Authentication Headers**
```javascript
// Include JWT token in requests
const authenticatedFetch = (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  return fetch(url, {
    ...options,
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
};
```

## 📊 Performance Standards

### **Image Optimization**
```javascript
// Lazy loading for property images
const PropertyImage = ({ src, alt, className }) => {
  const [imageSrc, setImageSrc] = useState('/images/placeholder.jpg');
  const [imageRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    if (inView) {
      setImageSrc(src);
    }
  }, [inView, src]);

  return (
    <img 
      ref={imageRef}
      src={imageSrc} 
      alt={alt}
      className={className}
      loading="lazy"
    />
  );
};
```

### **Bundle Size Monitoring**
```javascript
// Dynamic imports for large components
const PropertyMap = lazy(() => import('./PropertyMap'));

// Usage with suspense
<Suspense fallback={<div>Cargando mapa...</div>}>
  <PropertyMap properties={properties} />
</Suspense>
```

## 🎯 Code Review Checklist

Before any PR is approved:

### **Functionality**
- [ ] Feature works as specified
- [ ] Error handling implemented
- [ ] Edge cases considered
- [ ] Colombian context addressed

### **Code Quality**  
- [ ] Follows naming conventions
- [ ] No code duplication
- [ ] Proper component structure
- [ ] Comments for complex logic

### **Security**
- [ ] No hardcoded secrets
- [ ] Input validation present
- [ ] SQL injection prevention
- [ ] XSS protection implemented

### **Performance**
- [ ] No unnecessary re-renders
- [ ] Images optimized
- [ ] Database queries efficient
- [ ] Mobile performance tested

### **Accessibility**
- [ ] Semantic HTML used
- [ ] ARIA labels where needed
- [ ] Keyboard navigation works
- [ ] Color contrast adequate

### **Colombian Specific**
- [ ] Spanish translations accurate
- [ ] Currency formatting correct
- [ ] Address validation works
- [ ] Mobile-first design

Remember: **These standards ensure Rentev scales successfully across Colombian cities while maintaining excellent code quality!**
