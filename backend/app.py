from flask import Flask, jsonify, request, redirect
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, JWTManager
from authlib.integrations.flask_client import OAuth
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# --- App Configuration ---
app = Flask(__name__)
CORS(app)

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///realestate.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-super-secret-key-change-this')

# --- Extensions Initialization ---
db = SQLAlchemy(app)
migrate = Migrate(app, db)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
oauth = OAuth(app)

# --- Google OAuth Configuration ---
google = oauth.register(
    name='google',
    client_id=os.getenv('GOOGLE_CLIENT_ID'),
    client_secret=os.getenv('GOOGLE_CLIENT_SECRET'),
    access_token_url='https://accounts.google.com/o/oauth2/token',
    access_token_params=None,
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    authorize_params=None,
    api_base_url='https://www.googleapis.com/oauth2/v1/',
    userinfo_endpoint='https://openidconnect.googleapis.com/v1/userinfo',
    client_kwargs={'scope': 'openid email profile'},
    jwks_uri="https://www.googleapis.com/oauth2/v3/certs",
)


# --- Database Models ---
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    # Password can be null for OAuth users
    password_hash = db.Column(db.String(128), nullable=True)

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return self.password_hash and bcrypt.check_password_hash(self.password_hash, password)

# --- Authentication Endpoints ---

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not all([name, email, password]):
        return jsonify({'error': 'Missing required fields'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already registered'}), 409

    new_user = User(name=name, email=email)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User created successfully'}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if user and user.check_password(password):
        access_token = create_access_token(identity={'id': user.id, 'name': user.name, 'email': user.email})
        return jsonify(access_token=access_token)

    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    current_user_identity = get_jwt_identity()
    return jsonify(logged_in_as=current_user_identity), 200

# --- Google OAuth Endpoints ---

@app.route('/api/auth/google/login')
def google_login():
    redirect_uri = 'http://localhost:5000/api/auth/google/callback'
    return google.authorize_redirect(redirect_uri)

@app.route('/api/auth/google/callback')
def google_authorize():
    try:
        token = google.authorize_access_token()
        user_info = google.get('userinfo').json()
        email = user_info['email']
        name = user_info['name']
        
        # Find or create the user in the database
        user = User.query.filter_by(email=email).first()
        if not user:
            user = User(email=email, name=name)
            db.session.add(user)
            db.session.commit()
            
        # Create a JWT token for our application
        access_token = create_access_token(identity={'id': user.id, 'name': user.name, 'email': user.email})
        
        # Redirect back to the frontend with the token
        # In a real app, you might use a more secure method than query params
        return redirect(f'http://localhost:3000/login/callback?token={access_token}')

    except Exception as e:
        print(f"Error during Google OAuth callback: {e}")
        return redirect('http://localhost:3000/login?error=oauth_failed')


# --- Property Endpoints ---
properties = [
    # ... your existing properties list ...
]
@app.route('/api/properties', methods=['GET'])
def get_properties():
    return jsonify(properties)

@app.route('/api/properties/<int:property_id>', methods=['GET'])
def get_property(property_id):
    property_data = next((p for p in properties if p['id'] == property_id), None)
    if property_data:
        return jsonify(property_data)
    return jsonify({'error': 'Property not found'}), 404


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    print("Real Estate API Server Starting...")
    print("Server running on http://localhost:5000")
    app.run(debug=True, port=5000)
