import { Response } from 'express';
import db from '../db/database';
import { AuthRequest } from '../middleware/auth';

export const getAllLocations = (req: AuthRequest, res: Response) => {
  try {
    const locations = db.prepare(`
      SELECT
        l.*,
        COUNT(o.id) as object_count
      FROM locations l
      LEFT JOIN objects o ON l.id = o.location_id
      GROUP BY l.id
      ORDER BY l.name
    `).all();

    res.json({ locations });
  } catch (error) {
    console.error('Get locations error:', error);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
};

export const getLocationById = (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const location = db.prepare('SELECT * FROM locations WHERE id = ?').get(id);

    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }

    const objects = db.prepare(`
      SELECT
        o.*,
        c.name as category_name,
        c.color as category_color
      FROM objects o
      LEFT JOIN categories c ON o.category_id = c.id
      WHERE o.location_id = ?
      ORDER BY o.name
    `).all(id);

    res.json({ location, objects });
  } catch (error) {
    console.error('Get location error:', error);
    res.status(500).json({ error: 'Failed to fetch location' });
  }
};

export const createLocation = (req: AuthRequest, res: Response) => {
  try {
    const { name, description, address } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Location name is required' });
    }

    const result = db.prepare(`
      INSERT INTO locations (name, description, address)
      VALUES (?, ?, ?)
    `).run(name, description || null, address || null);

    const location = db.prepare('SELECT * FROM locations WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({ location });
  } catch (error) {
    console.error('Create location error:', error);
    res.status(500).json({ error: 'Failed to create location' });
  }
};

export const updateLocation = (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, address } = req.body;

    const existingLocation = db.prepare('SELECT * FROM locations WHERE id = ?').get(id);

    if (!existingLocation) {
      return res.status(404).json({ error: 'Location not found' });
    }

    db.prepare(`
      UPDATE locations
      SET name = ?, description = ?, address = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(name, description || null, address || null, id);

    const location = db.prepare('SELECT * FROM locations WHERE id = ?').get(id);

    res.json({ location });
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({ error: 'Failed to update location' });
  }
};

export const deleteLocation = (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const location = db.prepare('SELECT * FROM locations WHERE id = ?').get(id);

    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }

    // Check if any objects are at this location
    const objectCount = db.prepare('SELECT COUNT(*) as count FROM objects WHERE location_id = ?').get(id) as { count: number };

    if (objectCount.count > 0) {
      return res.status(400).json({ error: 'Cannot delete location with objects. Move or delete objects first.' });
    }

    db.prepare('DELETE FROM locations WHERE id = ?').run(id);

    res.json({ message: 'Location deleted successfully' });
  } catch (error) {
    console.error('Delete location error:', error);
    res.status(500).json({ error: 'Failed to delete location' });
  }
};
