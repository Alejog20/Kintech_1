from flask import Flask, jsonify, request, redirect, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, JWTManager
from authlib.integrations.flask_client import OAuth
from dotenv import load_dotenv
import os
from werkzeug.utils import secure_filename
import click # Import click for CLI commands

# Load environment variables from .env file
load_dotenv()

# --- App Configuration ---
app = Flask(__name__)
CORS(app)

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///realestate.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-super-secret-key-change-this')

# Uploads Configuration
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

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
from datetime import datetime, timezone # Add this import at the top of the file

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    # Password can be null for OAuth users
    password_hash = db.Column(db.String(128), nullable=True)
    role = db.Column(db.String(50), default='user', nullable=False) # Added role column

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return self.password_hash and bcrypt.check_password_hash(self.password_hash, password)

class Property(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float, nullable=False)
    location = db.Column(db.String(255), nullable=False)
    bedrooms = db.Column(db.Integer, nullable=False)
    bathrooms = db.Column(db.Integer, nullable=False)
    area = db.Column(db.Float, nullable=False) # e.g., in sq meters/feet
    images = db.Column(db.Text, nullable=True) # Comma-separated URLs
    amenities = db.Column(db.Text, nullable=True) # Comma-separated, or JSON string
    is_available = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'price': self.price,
            'location': self.location,
            'bedrooms': self.bedrooms,
            'bathrooms': self.bathrooms,
            'area': self.area,
            'images': self.images.split(',') if self.images else [],
            'amenities': self.amenities.split(',') if self.amenities else [],
            'is_available': self.is_available,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

from functools import wraps
from flask_jwt_extended import verify_jwt_in_request

# --- Decorators ---
def admin_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            current_user_identity = get_jwt_identity()
            user = User.query.get(current_user_identity['id'])
            if user and user.role == 'admin':
                return fn(*args, **kwargs)
            else:
                return jsonify(msg='Admins only!'), 403
        return decorator
    return wrapper

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
        access_token = create_access_token(identity={'id': user.id, 'name': user.name, 'email': user.email, 'role': user.role})
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
        access_token = create_access_token(identity={'id': user.id, 'name': user.name, 'email': user.email, 'role': user.role})
        
        # Redirect back to the frontend with the token
        # In a real app, you might use a more secure method than query params
        return redirect(f'http://localhost:3001/login/callback?token={access_token}')

    except Exception as e:
        print(f"Error during Google OAuth callback: {e}")
        return redirect('http://localhost:3001/login?error=oauth_failed')


# --- Property Endpoints ---

@app.route('/api/properties', methods=['GET'])
def get_properties():
    properties = Property.query.all()
    return jsonify([p.to_dict() for p in properties])

@app.route('/api/properties/<int:property_id>', methods=['GET'])
def get_property(property_id):
    property_data = Property.query.get(property_id)
    if property_data:
        return jsonify(property_data.to_dict())
    return jsonify({'error': 'Property not found'}), 404

# --- Admin Property Endpoints ---

@app.route('/api/admin/properties', methods=['POST'])
@jwt_required()
@admin_required()
def create_property():
    data = request.get_json()
    try:
        new_property = Property(
            title=data['title'],
            description=data['description'],
            price=data['price'],
            location=data['location'],
            bedrooms=data['bedrooms'],
            bathrooms=data['bathrooms'],
            area=data['area'],
            images=data.get('images', ''), # Optional, default to empty string
            amenities=data.get('amenities', ''), # Optional, default to empty string
            is_available=data.get('is_available', True)
        )
        db.session.add(new_property)
        db.session.commit()
        return jsonify(new_property.to_dict()), 201
    except KeyError as e:
        return jsonify({'error': f'Missing field: {e}'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/properties', methods=['GET'])
@jwt_required()
@admin_required()
def get_admin_properties():
    properties = Property.query.all()
    return jsonify([p.to_dict() for p in properties])

@app.route('/api/admin/properties/<int:property_id>', methods=['GET'])
@jwt_required()
@admin_required()
def get_admin_property(property_id):
    property_data = Property.query.get(property_id)
    if property_data:
        return jsonify(property_data.to_dict())
    return jsonify({'error': 'Property not found'}), 404

@app.route('/api/admin/properties/<int:property_id>', methods=['PUT'])
@jwt_required()
@admin_required()
def update_property(property_id):
    property_to_update = Property.query.get(property_id)
    if not property_to_update:
        return jsonify({'error': 'Property not found'}), 404

    data = request.get_json()
    try:
        property_to_update.title = data.get('title', property_to_update.title)
        property_to_update.description = data.get('description', property_to_update.description)
        property_to_update.price = data.get('price', property_to_update.price)
        property_to_update.location = data.get('location', property_to_update.location)
        property_to_update.bedrooms = data.get('bedrooms', property_to_update.bedrooms)
        property_to_update.bathrooms = data.get('bathrooms', property_to_update.bathrooms)
        property_to_update.area = data.get('area', property_to_update.area)
        property_to_update.images = data.get('images', property_to_update.images)
        property_to_update.amenities = data.get('amenities', property_to_update.amenities)
        property_to_update.is_available = data.get('is_available', property_to_update.is_available)

        db.session.commit()
        return jsonify(property_to_update.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/properties/<int:property_id>', methods=['DELETE'])
@jwt_required()
@admin_required()
def delete_property(property_id):
    property_to_delete = Property.query.get(property_id)
    if not property_to_delete:
        return jsonify({'error': 'Property not found'}), 404

    try:
        db.session.delete(property_to_delete)
        db.session.commit()
        return jsonify({'message': 'Property deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/admin/upload-image', methods=['POST'])
@jwt_required()
@admin_required()
def upload_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        # Create the upload folder if it doesn't exist
        upload_path = os.path.join(app.root_path, app.config['UPLOAD_FOLDER'])
        os.makedirs(upload_path, exist_ok=True)
        
        file_path = os.path.join(upload_path, filename)
        file.save(file_path)
        # Return the URL to access the image
        return jsonify({'url': f'http://localhost:5000/{app.config['UPLOAD_FOLDER']}/{filename}'}), 200
    else:
        return jsonify({'error': 'File type not allowed'}), 400


@app.cli.command('create-admin-user')
@click.argument('email')
@click.argument('password')
def create_admin_user(email, password):
    "Creates a new admin user"
    with app.app_context():
        user = User.query.filter_by(email=email).first()
        if user:
            click.echo(f'User with email {email} already exists.')
            return

        new_user = User(name='Admin', email=email, role='admin')
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()
        click.echo(f'Admin user {email} created successfully!')


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    print("Real Estate API Server Starting...")
    print("Server running on http://localhost:5000")
    app.run(debug=True, port=5000)
