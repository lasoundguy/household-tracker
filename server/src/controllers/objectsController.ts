import { Response } from 'express';
import db from '../db/database';
import { AuthRequest } from '../middleware/auth';

export const getAllObjects = (req: AuthRequest, res: Response) => {
  try {
    const { category, location, search } = req.query;

    let query = `
      SELECT
        o.*,
        c.name as category_name,
        c.color as category_color,
        l.name as location_name,
        u.name as added_by_name
      FROM objects o
      LEFT JOIN categories c ON o.category_id = c.id
      LEFT JOIN locations l ON o.location_id = l.id
      LEFT JOIN users u ON o.added_by = u.id
      WHERE 1=1
    `;

    const params: any[] = [];

    if (category) {
      query += ' AND o.category_id = ?';
      params.push(category);
    }

    if (location) {
      query += ' AND o.location_id = ?';
      params.push(location);
    }

    if (search) {
      query += ' AND (o.name LIKE ? OR o.description LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern);
    }

    query += ' ORDER BY o.updated_at DESC';

    const objects = db.prepare(query).all(...params);
    res.json({ objects });
  } catch (error) {
    console.error('Get objects error:', error);
    res.status(500).json({ error: 'Failed to fetch objects' });
  }
};

export const getObjectById = (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const object = db.prepare(`
      SELECT
        o.*,
        c.name as category_name,
        c.color as category_color,
        l.name as location_name,
        u.name as added_by_name
      FROM objects o
      LEFT JOIN categories c ON o.category_id = c.id
      LEFT JOIN locations l ON o.location_id = l.id
      LEFT JOIN users u ON o.added_by = u.id
      WHERE o.id = ?
    `).get(id);

    if (!object) {
      return res.status(404).json({ error: 'Object not found' });
    }

    // Get history
    const history = db.prepare(`
      SELECT
        h.*,
        fl.name as from_location_name,
        tl.name as to_location_name,
        u.name as moved_by_name
      FROM object_history h
      LEFT JOIN locations fl ON h.from_location_id = fl.id
      LEFT JOIN locations tl ON h.to_location_id = tl.id
      LEFT JOIN users u ON h.moved_by = u.id
      WHERE h.object_id = ?
      ORDER BY h.moved_at DESC
    `).all(id);

    res.json({ object, history });
  } catch (error) {
    console.error('Get object error:', error);
    res.status(500).json({ error: 'Failed to fetch object' });
  }
};

export const createObject = (req: AuthRequest, res: Response) => {
  try {
    const { name, description, category_id, location_id, photo_url } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Object name is required' });
    }

    const result = db.prepare(`
      INSERT INTO objects (name, description, category_id, location_id, photo_url, added_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(name, description || null, category_id || null, location_id || null, photo_url || null, req.user!.id);

    const object = db.prepare(`
      SELECT
        o.*,
        c.name as category_name,
        c.color as category_color,
        l.name as location_name,
        u.name as added_by_name
      FROM objects o
      LEFT JOIN categories c ON o.category_id = c.id
      LEFT JOIN locations l ON o.location_id = l.id
      LEFT JOIN users u ON o.added_by = u.id
      WHERE o.id = ?
    `).get(result.lastInsertRowid);

    res.status(201).json({ object });
  } catch (error) {
    console.error('Create object error:', error);
    res.status(500).json({ error: 'Failed to create object' });
  }
};

export const updateObject = (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, category_id, location_id, photo_url } = req.body;

    const existingObject = db.prepare('SELECT * FROM objects WHERE id = ?').get(id) as any;

    if (!existingObject) {
      return res.status(404).json({ error: 'Object not found' });
    }

    // If location changed, add to history
    if (location_id && location_id !== existingObject.location_id) {
      db.prepare(`
        INSERT INTO object_history (object_id, from_location_id, to_location_id, moved_by)
        VALUES (?, ?, ?, ?)
      `).run(id, existingObject.location_id, location_id, req.user!.id);
    }

    db.prepare(`
      UPDATE objects
      SET name = ?, description = ?, category_id = ?, location_id = ?, photo_url = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(name, description || null, category_id || null, location_id || null, photo_url || null, id);

    const object = db.prepare(`
      SELECT
        o.*,
        c.name as category_name,
        c.color as category_color,
        l.name as location_name,
        u.name as added_by_name
      FROM objects o
      LEFT JOIN categories c ON o.category_id = c.id
      LEFT JOIN locations l ON o.location_id = l.id
      LEFT JOIN users u ON o.added_by = u.id
      WHERE o.id = ?
    `).get(id);

    res.json({ object });
  } catch (error) {
    console.error('Update object error:', error);
    res.status(500).json({ error: 'Failed to update object' });
  }
};

export const deleteObject = (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const object = db.prepare('SELECT * FROM objects WHERE id = ?').get(id);

    if (!object) {
      return res.status(404).json({ error: 'Object not found' });
    }

    db.prepare('DELETE FROM objects WHERE id = ?').run(id);

    res.json({ message: 'Object deleted successfully' });
  } catch (error) {
    console.error('Delete object error:', error);
    res.status(500).json({ error: 'Failed to delete object' });
  }
};
