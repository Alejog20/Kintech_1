# Common Prompts & Workflows for Rentev

## 🎯 How to Use This File

These are **proven prompt templates** for common development tasks. Copy and customize them when requesting features from Claude Code.

## 🏗️ Feature Development Workflow

### **Template: New Feature Request**
```
I need to implement [FEATURE NAME] for Rentev. Here are the requirements:

**Business Context:**
- [Describe the Colombian real estate context]
- [User pain point this solves]
- [Expected user behavior]

**Technical Requirements:**
- [Frontend requirements]
- [Backend requirements] 
- [Database changes needed]
- [Integration requirements]

**Colombian-Specific Needs:**
- Currency display (COP/USD)
- Spanish/English language support
- Mobile-first design (80% of users)
- [Any other local requirements]

**Acceptance Criteria:**
- [ ] [Specific testable criterion 1]
- [ ] [Specific testable criterion 2]
- [ ] [Performance/security requirements]

Please analyze the current codebase, create a todo list, and implement this feature following our coding standards.
```

### **Template: Bug Fix Request**
```
I found a bug in [COMPONENT/FEATURE]. Here's the issue:

**Bug Description:**
- What happens: [Describe current behavior]
- What should happen: [Describe expected behavior]
- Steps to reproduce: [Numbered steps]
- Browser/device: [If relevant]

**Impact:**
- User experience impact: [How it affects Colombian users]
- Business impact: [Revenue/retention impact]
- Security concerns: [If any]

**Additional Context:**
- Error messages: [If any]
- Console logs: [If any]
- Related code files: [If known]

Please investigate this bug, identify the root cause, fix it, and create appropriate tests to prevent regression.
```

## 🔧 Component Development Prompts

### **Template: React Component**
```
Create a new React component called [ComponentName] for Rentev with these requirements:

**Component Purpose:**
[Brief description of what this component does]

**Props Interface:**
- prop1: [type] - [description]
- prop2: [type] - [description]
- [etc.]

**Colombian Requirements:**
- Support Spanish/English via LanguageContext
- Mobile-responsive design
- COP/USD currency formatting (if applicable)
- Cartagena/Colombian address formats (if applicable)

**Features:**
- [Feature 1]
- [Feature 2]
- [Error handling for X, Y, Z scenarios]

**Styling:**
- Follow BEM methodology
- Use CSS variables for theme compatibility
- Match existing component patterns in the app

Please also create comprehensive tests for this component including edge cases and Colombian-specific scenarios.
```

### **Template: API Endpoint**
```
Create a new API endpoint for [ENDPOINT PURPOSE]:

**Endpoint Details:**
- Method: [GET/POST/PUT/DELETE]
- Path: /api/[endpoint-path]
- Authentication: [Required/Optional]

**Request Format:**
```json
{
  "field1": "type - description",
  "field2": "type - description"
}
```

**Response Format:**
```json
{
  "success": true,
  "data": {
    "field1": "type - description"
  }
}
```

**Colombian Business Logic:**
- [Any Colombian-specific validation]
- [Currency handling requirements]  
- [Address format requirements]
- [Tax calculation needs]

**Security Requirements:**
- [Input validation needs]
- [Authorization requirements]
- [Rate limiting needs]

Please implement this endpoint with proper error handling, validation, and comprehensive tests.
```

## 🧪 Testing-Specific Prompts

### **Template: Test Suite Request**
```
Create comprehensive tests for [COMPONENT/FEATURE] with these requirements:

**Test Coverage Needed:**
- Unit tests for all functions/methods
- Component tests for user interactions
- Integration tests for API calls
- E2E tests for critical user paths

**Colombian-Specific Test Cases:**
- Spanish/English language switching
- COP/USD currency display
- Colombian address validation
- Mobile responsiveness (375px viewport)
- Slow internet connection simulation

**Test Data:**
- Use realistic Colombian property data
- Include Cartagena-specific addresses
- Test with Colombian phone numbers
- Include edge cases for peso amounts

**Frameworks to Use:**
- React Testing Library for components
- Jest for unit tests  
- Playwright for E2E tests

Please create thorough tests that ensure this feature works reliably for Colombian users.
```

### **Template: Performance Optimization**
```
Optimize [COMPONENT/FEATURE] for Colombian users with these considerations:

**Performance Context:**
- Colombian internet speeds: [Describe typical speeds]
- Mobile usage: 80% of traffic
- Data costs: Users are cost-conscious

**Current Issues:**
- [Describe performance problems]
- [Load times, bundle sizes, etc.]

**Optimization Goals:**
- First Contentful Paint: < 2 seconds
- Largest Contentful Paint: < 3 seconds
- Bundle size reduction: [target percentage]
- Mobile performance score: > 90

**Colombian-Specific Optimizations:**
- Image optimization for property photos
- Lazy loading for property listings
- Offline functionality for key features
- Progressive enhancement

Please analyze the current performance, identify bottlenecks, and implement optimizations with before/after measurements.
```

## 🌍 Colombian Feature Prompts

### **Template: Currency Feature**
```
Implement currency handling for Colombian real estate:

**Requirements:**
- Display prices in both COP and USD
- Real-time exchange rate from Banco de la República API
- Price formatting per Colombian standards (COP: $1.500.000, USD: $375.00)
- Price range filtering in both currencies
- Currency preference saved per user

**Business Logic:**
- Properties can be listed in either currency
- Mortgages typically in COP for Colombian buyers
- Foreign buyers prefer USD display
- Include Colombian tax implications

**Implementation Needs:**
- useColombianCurrency hook
- formatCOPPrice and formatUSDPrice utilities
- Exchange rate caching strategy
- Currency toggle component

Create this feature with proper error handling for when exchange rates are unavailable.
```

### **Template: Address/Location Feature**
```
Create Colombian address handling system:

**Address Format Support:**
- Standard: "Calle 32 #5-41, Centro Histórico, Cartagena"
- Neighborhoods: Getsemaní, Bocagrande, Manga, etc.
- Postal codes: 130001 (Cartagena format)

**Features Needed:**
- Address validation for Colombian format
- Neighborhood autocomplete
- Integration with Colombian postal service
- Google Maps integration for Cartagena
- Safety/security ratings by neighborhood

**Data Sources:**
- DANE (Colombian statistics) for official neighborhoods
- Local security data for safety ratings
- Google Maps API for coordinates

**Business Logic:**
- Historical district properties have special regulations
- Beach properties command premium prices
- Safety ratings affect property values

Implement this with proper validation and user-friendly error messages in Spanish.
```

## 🚀 Quick Command Prompts

### **Template: Quick Fix**
```
Quick fix needed: [BRIEF DESCRIPTION]

Current behavior: [What's happening now]
Expected behavior: [What should happen]
Files involved: [List relevant files]

Please fix this quickly and ensure it doesn't break existing functionality.
```

### **Template: Code Review**
```
Please review this code for:

[Paste code or specify files]

Review for:
- Colombian business logic correctness
- Security vulnerabilities  
- Performance issues
- Code quality standards
- Mobile compatibility
- Spanish/English language support

Provide specific suggestions for improvement.
```

### **Template: Database Migration**
```
Create database migration for [CHANGE DESCRIPTION]:

Current schema: [Describe current state]
Desired schema: [Describe target state]

Requirements:
- Preserve existing data
- Handle Colombian-specific fields (addresses, phone formats)
- Add proper indexes for performance
- Include rollback capability

Create both migration and rollback scripts with proper testing.
```

## 🎯 Project-Specific Shortcuts

### **Common Rentev Tasks**
```
# Property CRUD operations
"Create a property listing form with Colombian address validation and COP/USD pricing"

# User management  
"Add user profile page with Colombian phone number and address fields"

# Search functionality
"Implement property search with filters for Colombian neighborhoods and price ranges"

# Payment integration
"Integrate PSE (Colombian bank transfer) payment method"

# Legal compliance
"Add Colombian property disclosure requirements to listing form"
```

### **Emergency Fixes**
```
# Authentication issues
"Fix login modal not working on mobile devices in Colombia"

# Performance problems  
"Property images loading slowly - optimize for Colombian internet speeds"

# Currency bugs
"COP prices displaying incorrectly - fix formatting"

# Mobile issues
"Navigation menu not working on Android devices"
```

## 📋 Project Maintenance Prompts

### **Template: Code Cleanup**
```
Refactor [COMPONENT/FEATURE] to improve:

**Code Quality Issues:**
- [Describe current problems]
- [Technical debt to address]

**Colombian Market Alignment:**
- Ensure Spanish translations are accurate
- Verify Colombian business logic
- Update for Colombian user patterns

**Performance Improvements:**
- Reduce bundle size
- Improve mobile performance
- Optimize for slow connections

Please maintain existing functionality while improving code quality and user experience.
```

### **Template: Documentation Update**
```
Update documentation for [FEATURE/COMPONENT]:

**Documentation Needed:**
- API endpoint documentation
- Component usage examples
- Colombian-specific configuration
- Deployment procedures

**Target Audience:**
- New developers joining the project
- Colombian market specialists
- QA testers

Create comprehensive documentation that helps team members understand both technical implementation and Colombian business context.
```

---

## 💡 **Pro Tips for Using These Prompts**

1. **Always provide context** - Mention Colombian real estate specifics
2. **Be specific** - Include exact requirements and acceptance criteria  
3. **Request tests** - Always ask for comprehensive testing
4. **Consider mobile** - 80% of Colombian users are on mobile
5. **Think security** - Real estate involves sensitive financial data
6. **Plan for scale** - Features should work across multiple Colombian cities

**Remember**: The more specific and context-rich your prompts, the better Claude Code can help you build Rentev into Colombia's leading real estate platform!
