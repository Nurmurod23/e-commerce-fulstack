import Database from 'better-sqlite3';
import { join } from 'path';

const db = new Database(join(process.cwd(), 'database.sqlite'), { verbose: console.log });

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price REAL NOT NULL,
    image TEXT NOT NULL,
    category TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS cart_items (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE(user_id, product_id)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    total REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
  );

  CREATE TRIGGER IF NOT EXISTS update_users_timestamp 
  AFTER UPDATE ON users
  BEGIN
    UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

  CREATE TRIGGER IF NOT EXISTS update_products_timestamp
  AFTER UPDATE ON products
  BEGIN
    UPDATE products SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

  CREATE TRIGGER IF NOT EXISTS update_cart_items_timestamp
  AFTER UPDATE ON cart_items
  BEGIN
    UPDATE cart_items SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

  CREATE TRIGGER IF NOT EXISTS update_orders_timestamp
  AFTER UPDATE ON orders
  BEGIN
    UPDATE orders SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;

  CREATE TRIGGER IF NOT EXISTS update_order_items_timestamp
  AFTER UPDATE ON order_items
  BEGIN
    UPDATE order_items SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END;
`);

// Prepare statements for common operations
const statements = {
  // Users
  createUser: db.prepare(`
    INSERT INTO users (id, name, email, password)
    VALUES (?, ?, ?, ?)
  `),
  getUserByEmail: db.prepare(`
    SELECT * FROM users WHERE email = ?
  `),
  getUserById: db.prepare(`
    SELECT * FROM users WHERE id = ?
  `),

  // Products
  getAllProducts: db.prepare(`
    SELECT * FROM products
  `),
  getProductsByCategory: db.prepare(`
    SELECT * FROM products WHERE category = ?
  `),
  getProductById: db.prepare(`
    SELECT * FROM products WHERE id = ?
  `),

  // Cart
  getCartItems: db.prepare(`
    SELECT ci.*, p.name, p.price, p.image
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.user_id = ?
  `),
  addToCart: db.prepare(`
    INSERT INTO cart_items (id, user_id, product_id, quantity)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(user_id, product_id) DO UPDATE SET
    quantity = quantity + excluded.quantity
  `),
  updateCartItem: db.prepare(`
    UPDATE cart_items
    SET quantity = ?
    WHERE user_id = ? AND product_id = ?
  `),
  removeFromCart: db.prepare(`
    DELETE FROM cart_items
    WHERE user_id = ? AND product_id = ?
  `),
  clearCart: db.prepare(`
    DELETE FROM cart_items WHERE user_id = ?
  `),

  // Orders
  createOrder: db.prepare(`
    INSERT INTO orders (id, user_id, total)
    VALUES (?, ?, ?)
  `),
  addOrderItem: db.prepare(`
    INSERT INTO order_items (id, order_id, product_id, quantity, price)
    VALUES (?, ?, ?, ?, ?)
  `),
  getOrders: db.prepare(`
    SELECT o.*, json_group_array(
      json_object(
        'id', oi.id,
        'quantity', oi.quantity,
        'price', oi.price,
        'product', json_object(
          'id', p.id,
          'name', p.name,
          'image', p.image
        )
      )
    ) as items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE o.user_id = ?
    GROUP BY o.id
  `),
  getOrderById: db.prepare(`
    SELECT o.*, json_group_array(
      json_object(
        'id', oi.id,
        'quantity', oi.quantity,
        'price', oi.price,
        'product', json_object(
          'id', p.id,
          'name', p.name,
          'image', p.image
        )
      )
    ) as items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE o.id = ? AND o.user_id = ?
    GROUP BY o.id
  `),
  updateOrderStatus: db.prepare(`
    UPDATE orders SET status = ? WHERE id = ?
  `),
};

export { db, statements };