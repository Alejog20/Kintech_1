import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PropertyForm = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams(); // Get property ID from URL for editing
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    images: '',
    amenities: '',
    is_available: true,
  });
  const [selectedFiles, setSelectedFiles] = useState([]); // New state for selected files
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      const fetchProperty = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/admin/properties/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setFormData({
            title: data.title,
            description: data.description,
            price: data.price,
            location: data.location,
            bedrooms: data.bedrooms,
            bathrooms: data.bathrooms,
            area: data.area,
            images: Array.isArray(data.images) ? data.images.join(',') : '', // Convert array to comma-separated string
            amenities: Array.isArray(data.amenities) ? data.amenities.join(',') : '',
            is_available: data.is_available,
          });
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchProperty();
    }
  }, [id, isEditing, token]);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    const uploadedImageUrls = [];
    setLoading(true);
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('http://localhost:5000/api/admin/upload-image', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to upload ${file.name}`);
        }
        const data = await response.json();
        uploadedImageUrls.push(data.url);
      } catch (err) {
        setError(err.message);
        alert(`Error uploading file: ${err.message}`);
      }
    }
    setLoading(false);
    setFormData(prevData => ({
      ...prevData,
      images: prevData.images ? `${prevData.images},${uploadedImageUrls.join(',')}` : uploadedImageUrls.join(',')
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleRemoveImage = (imageUrlToRemove) => {
    setFormData(prevData => ({
      ...prevData,
      images: prevData.images.split(',').filter(url => url !== imageUrlToRemove).join(',')
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `http://localhost:5000/api/admin/properties/${id}` : 'http://localhost:5000/api/admin/properties';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      alert(`Property ${isEditing ? 'updated' : 'created'} successfully!`);
      navigate('/admin/properties'); // Redirect to property list
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) return <div className="text-center py-8">Loading property data...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="property-form-container p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6">{isEditing ? 'Edit Property' : 'Add New Property'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required
                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows="4"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"></textarea>
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
          <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required step="0.01"
                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
          <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} required
                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">Bedrooms</label>
            <input type="number" id="bedrooms" name="bedrooms" value={formData.bedrooms} onChange={handleChange} required
                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
          </div>
          <div>
            <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">Bathrooms</label>
            <input type="number" id="bathrooms" name="bathrooms" value={formData.bathrooms} onChange={handleChange} required step="0.5"
                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
          </div>
          <div>
            <label htmlFor="area" className="block text-sm font-medium text-gray-700">Area (sq ft/m)</label>
            <input type="number" id="area" name="area" value={formData.area} onChange={handleChange} required step="0.01"
                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
          </div>
        </div>
        <div>
          <label htmlFor="images" className="block text-sm font-medium text-gray-700">Upload Images</label>
          <input type="file" id="images" name="images" onChange={handleFileChange} multiple
                 className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          
          {/* Image Previews */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {formData.images.split(',').filter(url => url).map((imageUrl, index) => (
              <div key={index} className="relative group">
                <img src={imageUrl} alt={`Property Image ${index + 1}`} className="w-full h-32 object-cover rounded-md" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(imageUrl)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="amenities" className="block text-sm font-medium text-gray-700">Amenities (comma-separated)</label>
          <input type="text" id="amenities" name="amenities" value={formData.amenities} onChange={handleChange}
                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
        </div>
        <div className="flex items-center">
          <input type="checkbox" id="is_available" name="is_available" checked={formData.is_available} onChange={handleChange}
                 className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
          <label htmlFor="is_available" className="ml-2 block text-sm text-gray-900">Is Available</label>
        </div>
        <div>
          <button type="submit" disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            {loading ? 'Saving...' : (isEditing ? 'Update Property' : 'Add Property')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyForm;
