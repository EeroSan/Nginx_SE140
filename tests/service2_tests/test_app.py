import pytest
from Service2.app import app

@pytest.fixture
def client():
    """Fixture to create a test client for the Flask app."""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_status(client):
    """Test the status endpoint."""
    response = client.get('/')
    assert response.status_code == 200
    data = response.get_json()

    # Check keys in the response
    assert 'ip_address' in data
    assert 'processes' in data
    assert 'disk_space' in data
    assert 'uptime' in data

