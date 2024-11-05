const Database = require('better-sqlite3');
const { join } = require('path');
const { hash } = require('bcryptjs');
const { randomUUID } = require('crypto');

const db = new Database(join(process.cwd(), 'database.sqlite'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Sample products data
const products = [
  {
    id: randomUUID(),
    name: "Premium Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    category: "Electronics"
  },
  {
    id: randomUUID(),
    name: "Smart Watch Pro",
    description: "Advanced smartwatch with health tracking features",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    category: "Electronics"
  },
  // Add more sample products here
];

// Insert sample products
const insertProduct = db.prepare(`
  INSERT INTO products (id, name, description, price, image, category)
  VALUES (?, ?, ?, ?, ?, ?)
`);

// Create a transaction to insert all products
const insertProducts = db.transaction(() => {
  for (const product of products) {
    insertProduct.run(
      product.id,
      product.name,
      product.description,
      product.price,
      product.image,
      product.category
    );
  }
});

// Run the transaction
insertProducts();

console.log('Database setup completed!');