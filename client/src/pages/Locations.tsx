import React, { useEffect, useState } from 'react';
import { locationService } from '../services/locationService';
import { Location } from '../types';
import './Locations.css';

const Locations: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const data = await locationService.getAll();
      setLocations(data);
    } catch (error) {
      console.error('Failed to fetch locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const data = { name, description, address };
      if (editingId) {
        await locationService.update(editingId, data);
      } else {
        await locationService.create(data);
      }
      resetForm();
      fetchLocations();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save location');
    }
  };

  const handleEdit = (location: Location) => {
    setEditingId(location.id);
    setName(location.name);
    setDescription(location.description || '');
    setAddress(location.address || '');
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      try {
        await locationService.delete(id);
        fetchLocations();
      } catch (err: any) {
        alert(err.response?.data?.error || 'Failed to delete location');
      }
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setAddress('');
    setEditingId(null);
    setShowForm(false);
    setError('');
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Locations</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add Location'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h2>{editingId ? 'Edit Location' : 'New Location'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            {error && <div className="error">{error}</div>}
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="locations-grid">
        {locations.map((location) => (
          <div key={location.id} className="location-card card">
            <h3>{location.name}</h3>
            {location.description && <p>{location.description}</p>}
            {location.address && (
              <p className="location-address">{location.address}</p>
            )}
            <p className="location-count">
              {location.object_count || 0} object(s)
            </p>
            <div className="location-actions">
              <button
                className="btn btn-secondary"
                onClick={() => handleEdit(location)}
              >
                Edit
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(location.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Locations;
