# Real Estate Application - Claude Context

## Project Overview
A sophisticated real estate application built with React frontend and dual backend architecture, featuring luxury property listings for Cartagena, Colombia. The system handles both property sales and vacation rentals with comprehensive booking capabilities, user authentication, and admin management.

## Architecture Overview

### Frontend
- **Framework**: React 18 with Create React App
- **Routing**: React Router v6
- **State Management**: React Context API
- **Authentication**: Google OAuth 2.0
- **UI Components**: Custom components with Swiper.js carousel
- **Styling**: CSS modules with responsive design

### Dual Backend Architecture

#### 1. Python Flask API Server (Primary Auth & Admin)
- **Port**: 5000
- **Framework**: Flask with SQLAlchemy
- **Database**: SQLite (`realestate.db`) with Alembic migrations
- **Authentication**: JWT + Google OAuth integration
- **Purpose**: User management, authentication, admin operations

#### 2. Node.js Express API Server (Property Operations)
- **Port**: 5000 (PORT CONFLICT - needs resolution)
- **Framework**: Express.js with better-sqlite3
- **Database**: SQLite (`luxury_properties.db`) with property data
- **Purpose**: Property search, booking system, public API

## Current Implementation Status

### Implemented Features

#### User Authentication & Management
- Google OAuth 2.0 integration
- JWT token-based authentication
- User roles (admin/user)
- Registration and login functionality
- Password hashing with bcrypt

#### Property Management
- **Dual Property Types**:
  - Sale properties (COP pricing)
  - Rental properties (per-night pricing with Airbnb-style features)
- **Rich Property Data**:
  - Location: Cartagena neighborhoods (Bocagrande, Getsemani, Centro Historico, etc.)
  - Luxury classifications and oceanfront properties
  - High-resolution images and virtual tours
  - Detailed amenities and nearby attractions

#### Property Features
- **Search & Filtering**: Location, price range, bedrooms, luxury status
- **Property Carousel**: Swiper.js "Hottest Properties" showcase
- **Property Details**: Comprehensive property view with booking
- **Property Likes**: Favorite system with backend persistence

#### Booking System (Node.js Backend)
- **Rental Bookings**: Date selection, guest count, pricing calculation
- **Inquiry System**: Sales inquiries with contact management
- **Booking Management**: Confirmation, cancellation policies
- **Property Availability**: Calendar integration

#### Admin Features
- **Property CRUD**: Create, read, update, delete properties
- **Image Upload**: Property image management
- **User Management**: Admin user creation via CLI
- **Admin Dashboard**: Property overview and management

#### UI/UX Features
- **Responsive Design**: Mobile-first approach
- **Dark/Light Theme**: Theme switching with persistence
- **Multi-language Support**: Spanish/English i18n
- **Modern Components**: Modals, calendars, search bars
- **Property Carousel**: Featured properties showcase

### Database Structure

#### Flask Database (`realestate.db`)
```sql
users (id, name, email, password_hash, role)
properties (basic property model with SQLAlchemy)
```

#### Node.js Database (`luxury_properties.db`)
```sql
properties (comprehensive model with luxury features)
bookings (rental booking management)
inquiries (sales inquiry tracking)
```

### API Endpoints

#### Flask API (Authentication & Admin)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `GET /api/auth/google/login` - Google OAuth initiation
- `GET /api/auth/google/callback` - Google OAuth callback
- `POST /api/admin/properties` - Create property (admin)
- `GET /api/admin/properties` - List properties (admin)
- `PUT /api/admin/properties/:id` - Update property (admin)
- `DELETE /api/admin/properties/:id` - Delete property (admin)
- `POST /api/admin/upload-image` - Upload property image (admin)

#### Node.js API (Property Operations)
- `GET /api/properties` - Get all properties
- `GET /api/properties/search` - Search properties
- `GET /api/properties/:id` - Get property by ID
- `POST /api/properties` - Create property
- `POST /api/bookings` - Create booking
- `POST /api/inquiries` - Create inquiry
- `GET /api/stats` - Property statistics

## Current Technical Issues

### Critical Issues
1. **Port Conflict**: Both servers configured for port 5000
2. **Database Isolation**: Two separate SQLite databases with different schemas
3. **Frontend Integration**: Frontend needs to communicate with both APIs

### Recommended Solutions
1. **Port Configuration**:
   - Flask: Port 5000 (auth & admin)
   - Node.js: Port 5001 (property operations)
2. **Database Synchronization**: Implement data sync between systems
3. **API Gateway**: Consider unified API endpoint routing

## Development Commands

### Frontend (React)
```bash
cd frontend
npm start          # Development server (port 3000)
npm run build      # Production build
npm test           # Run tests
npm run api        # JSON server (port 5000)
```

### Flask Backend
```bash
cd backend
python app.py      # Start Flask server (port 5000)
flask db migrate   # Create migration
flask db upgrade   # Apply migration
flask create-admin-user <email> <password>  # Create admin user
```

### Node.js Backend
```bash
cd backend
node api/properties.js     # Start Node.js server (port 5000)
node database/seed.js      # Seed luxury properties
```

## Project Structure
```
realstate-app/
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── HottestPropertiesCarousel.js
│   │   │   ├── LikeButton.js
│   │   │   ├── PropertyCard.js
│   │   │   ├── SearchFilter.js
│   │   │   ├── BookingModal.js
│   │   │   └── AdminLayout.js
│   │   ├── pages/          # Route components
│   │   │   ├── Home.js
│   │   │   ├── PropertyDetail.js
│   │   │   ├── LikedPropertiesPage.js
│   │   │   └── AdminDashboard.js
│   │   ├── context/        # React Context providers
│   │   │   ├── AuthContext.js
│   │   │   ├── ThemeContext.js
│   │   │   ├── LanguageContext.js
│   │   │   └── LikeContext.js
│   │   └── mockData.js     # Development data
│   └── package.json
├── backend/
│   ├── app.py             # Flask server (auth & admin)
│   ├── api/
│   │   └── properties.js  # Node.js server (property operations)
│   ├── database/
│   │   ├── properties.js  # Node.js database service
│   │   ├── seed.js        # Property data seeding
│   │   └── luxury_properties.db
│   ├── migrations/        # Flask database migrations
│   ├── pyproject.toml     # Python dependencies
│   └── package.json       # Node.js dependencies
└── CLAUDE.md             # This file
```

## Key Components

### Frontend Components
- `Header`: Navigation with auth, theme, language toggles
- `Hero`: Landing page with search functionality
- `PropertyCard`: Individual property display component
- `HottestPropertiesCarousel`: Swiper-based featured properties
- `SearchFilter`: Advanced property search and filtering
- `BookingModal`: Rental property booking interface
- `ContractModal`: Sales inquiry and contract management
- `AdminLayout`: Admin dashboard layout with navigation
- `LikeButton`: Property favoriting with heart animation

### Context Providers
- `AuthContext`: User authentication state and Google OAuth
- `ThemeContext`: Light/dark theme management
- `LanguageContext`: Spanish/English internationalization
- `LikeContext`: Property favorites with backend synchronization

### Pages
- `Home`: Landing page with property listings and carousel
- `PropertyDetail`: Comprehensive property view with booking
- `LikedPropertiesPage`: User's saved properties
- `AdminDashboard`: Admin property management interface
- `About`: Company information
- `Contact`: Contact form and information

## Environment Variables

### Frontend
- `REACT_APP_GOOGLE_CLIENT_ID`: Google OAuth client ID

### Backend (Flask)
- `JWT_SECRET_KEY`: JWT token signing key
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret

## Code Style Guidelines

### NO EMOJIS POLICY
- **CRITICAL**: Never use emojis in ANY code files, comments, or documentation
- This applies to ALL file extensions: .js, .jsx, .ts, .tsx, .css, .md, .json, .py, etc.
- Use descriptive text instead of emojis for clarity and professionalism
- Comments should be clear and text-based only
- Error messages and user feedback should not contain emojis

### Other Style Guidelines
- Use descriptive variable and function names
- Follow existing code patterns and conventions
- Maintain consistent indentation and formatting
- Use modern JavaScript/React patterns (hooks, functional components)
- Follow React best practices for state management
- Use proper Python PEP 8 style for Flask backend

## Property Data Model

### Luxury Properties (Cartagena Focus)
- **Locations**: Bocagrande, Centro Historico, Getsemani, Manga, Castillogrande
- **Property Types**: Luxury villas, colonial houses, modern penthouses, apartments
- **Price Range**: COP 290,000 - 650,000 per night (rentals), COP 1.2B - 5.2B (sales)
- **Features**: Oceanfront, luxury amenities, private pools, historical architecture

### Property Attributes
- Comprehensive image galleries
- Virtual tour URLs
- Detailed amenities lists
- Nearby attractions
- Booking calendars and availability
- House rules and cancellation policies
- Agent contact information

## Testing Strategy
- React Testing Library for component tests
- Jest for unit testing
- Integration tests for authentication flows
- E2E tests for booking and property management workflows
- API testing for both Flask and Node.js endpoints

## Deployment Considerations
- **Frontend**: Static build deployment (Netlify/Vercel)
- **Flask Backend**: Python hosting (Heroku/Railway/PythonAnywhere)
- **Node.js Backend**: Node.js hosting (Heroku/Railway)
- **Database**: SQLite for development, PostgreSQL for production
- **Environment Variables**: Secure management for OAuth keys
- **CORS Configuration**: Proper cross-origin setup for dual backend
- **Load Balancing**: Consider API gateway for backend routing

## Security Considerations
- JWT token expiration and refresh
- Secure Google OAuth implementation
- File upload validation and sanitization
- Admin role-based access control
- SQL injection prevention
- Environment variable security

## Performance Optimizations
- Image optimization and CDN usage
- Property search indexing
- Database query optimization
- Frontend code splitting
- Lazy loading for property images
- Caching strategies for property data

## Future Development Roadmap
- Resolve port conflict between backends
- Implement unified database schema
- Add real-time booking availability
- Implement payment processing
- Add property comparison features
- Enhance admin analytics dashboard
- Mobile app development consideration