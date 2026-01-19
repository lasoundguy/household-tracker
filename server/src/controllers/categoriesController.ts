import { Response } from 'express';
import db from '../db/database';
import { AuthRequest } from '../middleware/auth';

export const getAllCategories = (req: AuthRequest, res: Response) => {
  try {
    const categories = db.prepare(`
      SELECT
        c.*,
        COUNT(o.id) as object_count
      FROM categories c
      LEFT JOIN objects o ON c.id = o.category_id
      GROUP BY c.id
      ORDER BY c.name
    `).all();

    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

export const createCategory = (req: AuthRequest, res: Response) => {
  try {
    const { name, color } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const result = db.prepare(`
      INSERT INTO categories (name, color)
      VALUES (?, ?)
    `).run(name, color || '#3B82F6');

    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({ category });
  } catch (error: any) {
    if (error.message?.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Category with this name already exists' });
    }
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
};

export const updateCategory = (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, color } = req.body;

    const existingCategory = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);

    if (!existingCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    db.prepare(`
      UPDATE categories
      SET name = ?, color = ?
      WHERE id = ?
    `).run(name, color, id);

    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);

    res.json({ category });
  } catch (error: any) {
    if (error.message?.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Category with this name already exists' });
    }
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
};

export const deleteCategory = (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    db.prepare('DELETE FROM categories WHERE id = ?').run(id);

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
};
