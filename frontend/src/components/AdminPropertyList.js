import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const AdminPropertyList = () => {
  const { token } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/properties', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProperties(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProperties();
    }
  }, [token]);

  const handleDelete = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/properties/${propertyId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Remove the deleted property from the state
        setProperties(properties.filter(p => p.id !== propertyId));
        alert('Property deleted successfully!');
      } catch (err) {
        setError(err.message);
        alert(`Failed to delete property: ${err.message}`);
      }
    }
  };

  if (loading) return <div className="text-center py-8">Loading properties...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="admin-property-list">
      <h1 className="text-3xl font-bold mb-6">Manage Properties</h1>
      <div className="mb-4">
        <Link to="/admin/properties/new" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add New Property
        </Link>
      </div>

      {properties.length === 0 ? (
        <p>No properties found. Add a new one!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Title</th>
                <th className="py-3 px-4 text-left">Location</th>
                <th className="py-3 px-4 text-left">Price</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {properties.map((property) => (
                <tr key={property.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-4">{property.id}</td>
                  <td className="py-3 px-4">{property.title}</td>
                  <td className="py-3 px-4">{property.location}</td>
                  <td className="py-3 px-4">${property.price.toLocaleString()}</td>
                  <td className="py-3 px-4 flex space-x-2">
                    <Link
                      to={`/admin/properties/edit/${property.id}`}
                      className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(property.id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPropertyList;
