import db from './database';

export function initializeDatabase() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'member' CHECK(role IN ('admin', 'member')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Locations table
  db.exec(`
    CREATE TABLE IF NOT EXISTS locations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Categories table
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      color TEXT DEFAULT '#3B82F6',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Objects table
  db.exec(`
    CREATE TABLE IF NOT EXISTS objects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      category_id INTEGER,
      location_id INTEGER,
      photo_url TEXT,
      added_by INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
      FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL,
      FOREIGN KEY (added_by) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Object history table
  db.exec(`
    CREATE TABLE IF NOT EXISTS object_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      object_id INTEGER NOT NULL,
      from_location_id INTEGER,
      to_location_id INTEGER,
      moved_by INTEGER NOT NULL,
      moved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      notes TEXT,
      FOREIGN KEY (object_id) REFERENCES objects(id) ON DELETE CASCADE,
      FOREIGN KEY (from_location_id) REFERENCES locations(id) ON DELETE SET NULL,
      FOREIGN KEY (to_location_id) REFERENCES locations(id) ON DELETE SET NULL,
      FOREIGN KEY (moved_by) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Create indexes for better query performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_objects_category ON objects(category_id);
    CREATE INDEX IF NOT EXISTS idx_objects_location ON objects(location_id);
    CREATE INDEX IF NOT EXISTS idx_objects_added_by ON objects(added_by);
    CREATE INDEX IF NOT EXISTS idx_object_history_object ON object_history(object_id);
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  `);

  console.log('Database initialized successfully');
}

export function seedDatabase() {
  // Check if we already have seeded data
  const categoryCount = db.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number };
  const locationCount = db.prepare('SELECT COUNT(*) as count FROM locations').get() as { count: number };

  if (categoryCount.count > 0 || locationCount.count > 0) {
    console.log('Database already seeded');
    return;
  }

  // Add default categories
  const categories = [
    { name: 'Tools', color: '#EF4444' },
    { name: 'Seasonal Items', color: '#F59E0B' },
    { name: 'Documents', color: '#3B82F6' },
    { name: 'Electronics', color: '#8B5CF6' },
    { name: 'Outdoor Equipment', color: '#10B981' },
    { name: 'Kitchen Items', color: '#EC4899' },
    { name: 'Storage Boxes', color: '#6366F1' },
    { name: 'Other', color: '#6B7280' }
  ];

  const insertCategory = db.prepare('INSERT INTO categories (name, color) VALUES (?, ?)');
  categories.forEach(cat => insertCategory.run(cat.name, cat.color));

  // Add default locations
  const locations = [
    { name: 'Main House', description: 'Primary residence', address: '' },
    { name: 'Garage', description: 'Attached garage', address: '' },
    { name: 'Storage Unit', description: 'Off-site storage facility', address: '' },
    { name: 'Basement', description: 'Basement storage area', address: '' },
    { name: 'Attic', description: 'Attic storage space', address: '' }
  ];

  const insertLocation = db.prepare('INSERT INTO locations (name, description, address) VALUES (?, ?, ?)');
  locations.forEach(loc => insertLocation.run(loc.name, loc.description, loc.address));

  console.log('Database seeded with default data');
}
