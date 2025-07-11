from flask import Flask, jsonify, request
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing for React

# Sample property data - In production, this would come from a database
properties = [
    {
        "id": 1,
        "title": "Modern Family Home",
        "price": 450000,
        "location": "Hampstead, London",
        "bedrooms": 3,
        "bathrooms": 2,
        "sqft": 1850,
        "image": "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop",
        "description": "Beautiful modern family home in prestigious Hampstead area. Recently renovated with high-end finishes throughout.",
        "features": ["Garden", "Parking", "Modern Kitchen", "En-suite"],
        "agent": "Sarah Wilson",
        "phone": "+44 20 7946 0958"
    },
    {
        "id": 2,
        "title": "City Centre Apartment",
        "price": 320000,
        "location": "Canary Wharf, London",
        "bedrooms": 2,
        "bathrooms": 1,
        "sqft": 950,
        "image": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
        "description": "Stunning apartment with panoramic city views. Perfect for professionals seeking luxury urban living.",
        "features": ["Concierge", "Gym", "Balcony", "City Views"],
        "agent": "James Thompson",
        "phone": "+44 20 7946 0959"
    },
    {
        "id": 3,
        "title": "Victorian Townhouse",
        "price": 650000,
        "location": "Richmond, London",
        "bedrooms": 4,
        "bathrooms": 3,
        "sqft": 2400,
        "image": "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&h=600&fit=crop",
        "description": "Charming Victorian townhouse with period features and modern amenities. Large garden and excellent transport links.",
        "features": ["Period Features", "Large Garden", "Off-Street Parking", "Near Station"],
        "agent": "Emma Clarke",
        "phone": "+44 20 7946 0960"
    }
]

@app.route('/api/properties', methods=['GET'])
def get_properties():
    """Get all properties with optional filtering"""
    max_price = request.args.get('max_price', type=int)
    location = request.args.get('location', '').lower()
    
    filtered_properties = properties
    
    if max_price:
        filtered_properties = [p for p in filtered_properties if p['price'] <= max_price]
    
    if location:
        filtered_properties = [p for p in filtered_properties if location in p['location'].lower()]
    
    return jsonify(filtered_properties)

@app.route('/api/properties/<int:property_id>', methods=['GET'])
def get_property(property_id):
    """Get specific property by ID"""
    property_data = next((p for p in properties if p['id'] == property_id), None)
    if property_data:
        return jsonify(property_data)
    return jsonify({'error': 'Property not found'}), 404

@app.route('/api/contact', methods=['POST'])
def contact_inquiry():
    """Handle contact form submissions"""
    data = request.get_json()
    
    # In production, you'd save this to a database and send emails
    inquiry = {
        'name': data.get('name'),
        'email': data.get('email'),
        'phone': data.get('phone'),
        'message': data.get('message'),
        'property_id': data.get('property_id')
    }
    
    print(f"New inquiry received: {inquiry}")  # For demo purposes
    
    return jsonify({'success': True, 'message': 'Thank you for your inquiry! We\'ll be in touch soon.'})

if __name__ == '__main__':
    print("🏠 Real Estate API Server Starting...")
    print("🌐 Server running on http://localhost:5000")
    print("📊 API Endpoints:")
    print("   GET  /api/properties - List all properties")
    print("   GET  /api/properties/<id> - Get specific property")
    print("   POST /api/contact - Submit contact form")
    app.run(debug=True, port=5000)
