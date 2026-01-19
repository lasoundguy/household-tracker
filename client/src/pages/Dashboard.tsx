import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { objectService } from '../services/objectService';
import { locationService } from '../services/locationService';
import { categoryService } from '../services/categoryService';
import { HouseholdObject, Location, Category } from '../types';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [objects, setObjects] = useState<HouseholdObject[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [objectsData, locationsData, categoriesData] = await Promise.all([
          objectService.getAll(),
          locationService.getAll(),
          categoryService.getAll(),
        ]);
        setObjects(objectsData);
        setLocations(locationsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name}!</h1>
        <p>Manage your household items across different locations</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>{objects.length}</h3>
          <p>Total Objects</p>
          <Link to="/objects" className="stat-link">View all</Link>
        </div>
        <div className="stat-card">
          <h3>{locations.length}</h3>
          <p>Locations</p>
          <Link to="/locations" className="stat-link">Manage</Link>
        </div>
        <div className="stat-card">
          <h3>{categories.length}</h3>
          <p>Categories</p>
          <Link to="/categories" className="stat-link">Manage</Link>
        </div>
      </div>

      <div className="dashboard-actions">
        <Link to="/objects/new" className="btn btn-primary">
          Add New Object
        </Link>
        <Link to="/objects" className="btn btn-secondary">
          Browse Objects
        </Link>
      </div>

      <div className="recent-objects">
        <h2>Recent Objects</h2>
        {objects.length === 0 ? (
          <p>No objects yet. Start by adding your first item!</p>
        ) : (
          <div className="objects-grid">
            {objects.slice(0, 6).map((obj) => (
              <Link key={obj.id} to={`/objects/${obj.id}`} className="object-card">
                {obj.photo_url && (
                  <img src={obj.photo_url} alt={obj.name} className="object-image" />
                )}
                <div className="object-info">
                  <h3>{obj.name}</h3>
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
