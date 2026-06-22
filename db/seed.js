#!/usr/bin/env node
// Seed script — run with: node db/seed.js
// Generates: 8 categories, 50 products, 200 customers, 1000 orders (2-5 items each)

require('dotenv').config({ path: require('path').join(__dirname, '../backend/.env') });
const mysql = require('mysql2/promise');

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'interview',
  database: process.env.DB_NAME || 'shopdb',
  multipleStatements: true,
};

const CATEGORIES = [
  'Electronics', 'Home & Kitchen', 'Clothing', 'Books',
  'Sports & Outdoors', 'Beauty & Personal Care', 'Toys & Games', 'Office Supplies',
];

const PRODUCT_TEMPLATES = [
  // Electronics
  { name: 'Wireless Headphones Pro', price: 149.99, category: 'Electronics', stock: 120 },
  { name: 'USB-C Hub 7-in-1', price: 49.99, category: 'Electronics', stock: 200 },
  { name: 'Mechanical Keyboard', price: 89.99, category: 'Electronics', stock: 75 },
  { name: 'Webcam 4K', price: 119.99, category: 'Electronics', stock: 60 },
  { name: 'Portable SSD 1TB', price: 99.99, category: 'Electronics', stock: 150 },
  { name: 'Smart Watch Series X', price: 249.99, category: 'Electronics', stock: 45 },
  { name: 'Bluetooth Speaker', price: 59.99, category: 'Electronics', stock: 180 },
  // Home & Kitchen
  { name: 'Air Purifier HEPA', price: 129.99, category: 'Home & Kitchen', stock: 55 },
  { name: 'French Press Coffee Maker', price: 34.99, category: 'Home & Kitchen', stock: 300 },
  { name: 'Cast Iron Skillet 12"', price: 44.99, category: 'Home & Kitchen', stock: 90 },
  { name: 'Bamboo Cutting Board Set', price: 29.99, category: 'Home & Kitchen', stock: 250 },
  { name: 'Stainless Steel Water Bottle', price: 24.99, category: 'Home & Kitchen', stock: 400 },
  { name: 'Electric Kettle 1.7L', price: 39.99, category: 'Home & Kitchen', stock: 140 },
  { name: 'Knife Set 15-Piece', price: 79.99, category: 'Home & Kitchen', stock: 70 },
  // Clothing
  { name: 'Merino Wool Sweater', price: 89.99, category: 'Clothing', stock: 100 },
  { name: 'Waterproof Hiking Jacket', price: 159.99, category: 'Clothing', stock: 60 },
  { name: 'Classic Denim Jeans', price: 69.99, category: 'Clothing', stock: 200 },
  { name: 'Running Shorts', price: 34.99, category: 'Clothing', stock: 300 },
  { name: 'Thermal Base Layer Set', price: 54.99, category: 'Clothing', stock: 80 },
  // Books
  { name: 'Clean Code by R. Martin', price: 39.99, category: 'Books', stock: 500 },
  { name: 'Designing Data-Intensive Apps', price: 59.99, category: 'Books', stock: 300 },
  { name: 'The Pragmatic Programmer', price: 44.99, category: 'Books', stock: 400 },
  { name: 'System Design Interview Vol 2', price: 34.99, category: 'Books', stock: 600 },
  { name: 'A Philosophy of Software Design', price: 29.99, category: 'Books', stock: 350 },
  // Sports & Outdoors
  { name: 'Yoga Mat Premium', price: 49.99, category: 'Sports & Outdoors', stock: 200 },
  { name: 'Adjustable Dumbbells 50lb', price: 299.99, category: 'Sports & Outdoors', stock: 30 },
  { name: 'Resistance Bands Set', price: 24.99, category: 'Sports & Outdoors', stock: 500 },
  { name: 'Hiking Poles Collapsible', price: 59.99, category: 'Sports & Outdoors', stock: 90 },
  { name: 'Camping Headlamp 400lm', price: 29.99, category: 'Sports & Outdoors', stock: 150 },
  { name: 'Foam Roller', price: 19.99, category: 'Sports & Outdoors', stock: 350 },
  // Beauty & Personal Care
  { name: 'Electric Toothbrush Sonic', price: 79.99, category: 'Beauty & Personal Care', stock: 120 },
  { name: 'Vitamin C Serum 2oz', price: 24.99, category: 'Beauty & Personal Care', stock: 400 },
  { name: 'Natural Deodorant 3-Pack', price: 19.99, category: 'Beauty & Personal Care', stock: 600 },
  { name: 'Face Moisturizer SPF 50', price: 29.99, category: 'Beauty & Personal Care', stock: 300 },
  { name: 'Hair Dryer Ionic 1875W', price: 69.99, category: 'Beauty & Personal Care', stock: 80 },
  // Toys & Games
  { name: 'Strategy Board Game', price: 44.99, category: 'Toys & Games', stock: 150 },
  { name: 'LEGO Architecture Set', price: 79.99, category: 'Toys & Games', stock: 90 },
  { name: 'Puzzle 1000 Pieces', price: 19.99, category: 'Toys & Games', stock: 400 },
  { name: 'Card Game Party Pack', price: 14.99, category: 'Toys & Games', stock: 500 },
  { name: 'Remote Control Car', price: 49.99, category: 'Toys & Games', stock: 120 },
  // Office Supplies
  { name: 'Ergonomic Mouse Vertical', price: 44.99, category: 'Office Supplies', stock: 200 },
  { name: 'Desk Organizer Bamboo', price: 29.99, category: 'Office Supplies', stock: 300 },
  { name: 'Monitor Stand Adjustable', price: 39.99, category: 'Office Supplies', stock: 150 },
  { name: 'Whiteboard 36x24"', price: 54.99, category: 'Office Supplies', stock: 80 },
  { name: 'Label Maker', price: 34.99, category: 'Office Supplies', stock: 120 },
  { name: 'Cable Management Kit', price: 14.99, category: 'Office Supplies', stock: 500 },
  { name: 'Laptop Stand Aluminum', price: 49.99, category: 'Office Supplies', stock: 200 },
  { name: 'Wireless Charging Pad', price: 24.99, category: 'Office Supplies', stock: 350 },
  { name: 'Blue Light Glasses', price: 19.99, category: 'Office Supplies', stock: 400 },
  { name: 'Desk Lamp LED Dimmable', price: 44.99, category: 'Office Supplies', stock: 160 },
];

const FIRST_NAMES = ['James','Mary','John','Patricia','Robert','Jennifer','Michael','Linda',
  'William','Barbara','David','Elizabeth','Richard','Susan','Joseph','Jessica','Thomas','Sarah',
  'Charles','Karen','Christopher','Lisa','Daniel','Nancy','Matthew','Betty','Anthony','Margaret',
  'Donald','Sandra','Mark','Ashley','Paul','Dorothy','Steven','Kimberly','Andrew','Emily','Kenneth',
  'Donna','Joshua','Michelle','Kevin','Carol','Brian','Amanda','George','Melissa','Timothy','Deborah'];

const LAST_NAMES = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis',
  'Rodriguez','Martinez','Hernandez','Lopez','Gonzalez','Wilson','Anderson','Thomas','Taylor',
  'Moore','Jackson','Martin','Lee','Perez','Thompson','White','Harris','Sanchez','Clark',
  'Ramirez','Lewis','Robinson','Walker','Young','Allen','King','Wright','Scott','Torres',
  'Nguyen','Hill','Flores','Green','Adams','Nelson','Baker','Hall','Rivera','Campbell','Mitchell'];

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'delivered', 'delivered', 'cancelled'];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 19).replace('T', ' ');
}

async function seed() {
  console.log('Connecting to database...');
  const conn = await mysql.createConnection(DB_CONFIG);

  console.log('Clearing existing data...');
  await conn.query('SET FOREIGN_KEY_CHECKS = 0');
  await conn.query('TRUNCATE TABLE order_items');
  await conn.query('TRUNCATE TABLE orders');
  await conn.query('TRUNCATE TABLE customers');
  await conn.query('TRUNCATE TABLE products');
  await conn.query('TRUNCATE TABLE categories');
  await conn.query('SET FOREIGN_KEY_CHECKS = 1');

  // Insert categories
  console.log('Seeding categories...');
  const categoryIds = {};
  for (const name of CATEGORIES) {
    const [r] = await conn.query('INSERT INTO categories (name) VALUES (?)', [name]);
    categoryIds[name] = r.insertId;
  }

  // Insert products
  console.log('Seeding 50 products...');
  const productIds = [];
  const productPrices = {};
  for (const p of PRODUCT_TEMPLATES) {
    const desc = `High-quality ${p.name.toLowerCase()}. Perfect for everyday use. Ships in 1-3 business days.`;
    const [r] = await conn.query(
      'INSERT INTO products (name, description, price, stock, category_id) VALUES (?, ?, ?, ?, ?)',
      [p.name, desc, p.price, p.stock, categoryIds[p.category]]
    );
    productIds.push(r.insertId);
    productPrices[r.insertId] = p.price;
  }

  // Insert customers
  console.log('Seeding 200 customers...');
  const customerIds = [];
  const usedEmails = new Set();
  for (let i = 0; i < 200; i++) {
    let email;
    do {
      const first = pick(FIRST_NAMES).toLowerCase();
      const last = pick(LAST_NAMES).toLowerCase();
      email = `${first}.${last}${rand(1, 999)}@example.com`;
    } while (usedEmails.has(email));
    usedEmails.add(email);

    const name = `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
    const [r] = await conn.query(
      'INSERT INTO customers (name, email, created_at) VALUES (?, ?, ?)',
      [name, email, daysAgo(rand(30, 365))]
    );
    customerIds.push(r.insertId);
  }

  // Insert 1000 orders with 2-5 items each, quantities 1-4
  // NOTE: quantities >1 are intentional — makes the revenue bug obvious in the UI
  console.log('Seeding 1000 orders...');
  for (let i = 0; i < 1000; i++) {
    const customerId = pick(customerIds);
    const status = pick(ORDER_STATUSES);
    const createdAt = daysAgo(rand(0, 90));

    const [orderResult] = await conn.query(
      'INSERT INTO orders (customer_id, status, created_at) VALUES (?, ?, ?)',
      [customerId, status, createdAt]
    );
    const orderId = orderResult.insertId;

    const itemCount = rand(2, 5);
    const usedProducts = new Set();
    for (let j = 0; j < itemCount; j++) {
      let productId;
      do { productId = pick(productIds); } while (usedProducts.has(productId));
      usedProducts.add(productId);

      const quantity = rand(1, 4);
      const unitPrice = productPrices[productId];

      await conn.query(
        'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
        [orderId, productId, quantity, unitPrice]
      );
    }

    if ((i + 1) % 100 === 0) process.stdout.write(`  ${i + 1}/1000 orders\n`);
  }

  await conn.end();
  console.log('\nSeed complete!');
  console.log('NOTE: The dashboard revenue figure will look low — that\'s intentional (it\'s the bug).');
}

seed().catch(err => { console.error(err); process.exit(1); });
