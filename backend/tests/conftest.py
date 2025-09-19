"""
Pytest configuration file for Flask backend tests
"""
import pytest
import tempfile
import os
from app import app, db, User, Property


@pytest.fixture
def app_instance():
    """Create and configure a new app instance for each test."""
    # Create a temporary file to serve as the test database
    db_fd, db_path = tempfile.mkstemp()

    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
    app.config['WTF_CSRF_ENABLED'] = False
    app.config['JWT_SECRET_KEY'] = 'test-secret-key'

    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()

    os.close(db_fd)
    os.unlink(db_path)


@pytest.fixture
def client(app_instance):
    """A test client for the app."""
    return app_instance.test_client()


@pytest.fixture
def runner(app_instance):
    """A test runner for the app's Click commands."""
    return app_instance.test_cli_runner()


@pytest.fixture
def auth_headers():
    """Helper to create authorization headers."""
    def _auth_headers(token):
        return {'Authorization': f'Bearer {token}'}
    return _auth_headers


@pytest.fixture
def sample_user(app_instance):
    """Create a sample user for testing."""
    user = User(name='Test User', email='test@example.com')
    user.set_password('testpassword')

    with app_instance.app_context():
        db.session.add(user)
        db.session.commit()
        return user


@pytest.fixture
def sample_admin(app_instance):
    """Create a sample admin user for testing."""
    admin = User(name='Admin User', email='admin@example.com', role='admin')
    admin.set_password('adminpassword')

    with app_instance.app_context():
        db.session.add(admin)
        db.session.commit()
        return admin


@pytest.fixture
def sample_property(app_instance):
    """Create a sample property for testing."""
    property_data = Property(
        title='Test Property',
        description='A test property',
        price=1000000,
        location='Test Location',
        bedrooms=3,
        bathrooms=2,
        area=150
    )

    with app_instance.app_context():
        db.session.add(property_data)
        db.session.commit()
        return property_data


@pytest.fixture
def login_user(client, sample_user):
    """Login a user and return the access token."""
    response = client.post('/api/auth/login', json={
        'email': 'test@example.com',
        'password': 'testpassword'
    })

    if response.status_code == 200:
        return response.json['access_token']
    return None


@pytest.fixture
def login_admin(client, sample_admin):
    """Login an admin user and return the access token."""
    response = client.post('/api/auth/login', json={
        'email': 'admin@example.com',
        'password': 'adminpassword'
    })

    if response.status_code == 200:
        return response.json['access_token']
    return None