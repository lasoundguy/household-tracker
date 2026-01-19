import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { objectService } from '../services/objectService';
import { locationService } from '../services/locationService';
import { categoryService } from '../services/categoryService';
import { HouseholdObject, Location, Category } from '../types';
import './ObjectsList.css';

const ObjectsList: React.FC = () => {
  const [objects, setObjects] = useState<HouseholdObject[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [locationsData, categoriesData] = await Promise.all([
          locationService.getAll(),
          categoryService.getAll(),
        ]);
        setLocations(locationsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchObjects = async () => {
      setLoading(true);
      try {
        const filters: any = {};
        if (selectedCategory) filters.category = parseInt(selectedCategory);
        if (selectedLocation) filters.location = parseInt(selectedLocation);
        if (searchTerm) filters.search = searchTerm;

        const data = await objectService.getAll(filters);
        setObjects(data);
      } catch (error) {
        console.error('Failed to fetch objects:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchObjects, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, selectedCategory, selectedLocation]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this object?')) {
      try {
        await objectService.delete(id);
        setObjects(objects.filter((obj) => obj.id !== id));
      } catch (error) {
        console.error('Failed to delete object:', error);
        alert('Failed to delete object');
      }
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>Objects</h1>
        <Link to="/objects/new" className="btn btn-primary">
          Add Object
        </Link>
      </div>

      <div className="filters-card card">
        <div className="filters">
          <div className="form-group">
            <label>Search</label>
            <input
              type="text"
              placeholder="Search objects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Location</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">All Locations</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : objects.length === 0 ? (
        <div className="card">
          <p>No objects found. Try adjusting your filters or add a new object.</p>
        </div>
      ) : (
        <div className="objects-grid">
          {objects.map((obj) => (
            <div key={obj.id} className="object-card">
              <Link to={`/objects/${obj.id}`}>
                {obj.photo_url && (
                  <img src={obj.photo_url} alt={obj.name} className="object-image" />
                )}
                <div className="object-info">
                  <h3>{obj.name}</h3>
                  {obj.description && <p className="object-description">{obj.description}</p>}
                  {obj.category_name && (
                    <span
                      className="category-badge"
                      style={{ backgroundColor: obj.category_color }}
                    >
                      {obj.category_name}
                    </span>
                  )}
                  {obj.location_name && (
                    <p className="object-location">{obj.location_name}</p>
                  )}
                </div>
              </Link>
              <div className="object-actions">
                <Link to={`/objects/${obj.id}/edit`} className="btn btn-secondary">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(obj.id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ObjectsList;
