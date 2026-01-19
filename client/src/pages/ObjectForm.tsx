import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { objectService } from '../services/objectService';
import { locationService } from '../services/locationService';
import { categoryService } from '../services/categoryService';
import { uploadService } from '../services/uploadService';
import { Location, Category } from '../types';
import './ObjectForm.css';

const ObjectForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [locationId, setLocationId] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState('');

  const [locations, setLocations] = useState<Location[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [locationsData, categoriesData] = await Promise.all([
          locationService.getAll(),
          categoryService.getAll(),
        ]);
        setLocations(locationsData);
        setCategories(categoriesData);

        if (isEditMode && id) {
          const { object } = await objectService.getById(parseInt(id));
          setName(object.name);
          setDescription(object.description || '');
          setCategoryId(object.category_id?.toString() || '');
          setLocationId(object.location_id?.toString() || '');
          setPhotoUrl(object.photo_url || '');
          setPhotoPreview(object.photo_url || '');
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError('Failed to load form data');
      }
    };

    fetchData();
  }, [id, isEditMode]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let finalPhotoUrl = photoUrl;

      if (photoFile) {
        setUploading(true);
        const uploadResult = await uploadService.uploadImage(photoFile);
        finalPhotoUrl = uploadResult.url;
        setUploading(false);
      }

      const objectData = {
        name,
        description,
        category_id: categoryId ? parseInt(categoryId) : undefined,
        location_id: locationId ? parseInt(locationId) : undefined,
        photo_url: finalPhotoUrl,
      };

      if (isEditMode && id) {
        await objectService.update(parseInt(id), objectData);
      } else {
        await objectService.create(objectData);
      }

      navigate('/objects');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save object');
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>{isEditMode ? 'Edit Object' : 'Add New Object'}</h1>
      </div>

      <div className="form-container card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <select
                id="location"
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
              >
                <option value="">Select a location</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="photo">Photo</label>
            <input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
            />
            {photoPreview && (
              <div className="photo-preview">
                <img src={photoPreview} alt="Preview" />
              </div>
            )}
          </div>

          {error && <div className="error">{error}</div>}

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || uploading}
            >
              {uploading ? 'Uploading image...' : loading ? 'Saving...' : 'Save Object'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/objects')}
              disabled={loading || uploading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ObjectForm;
