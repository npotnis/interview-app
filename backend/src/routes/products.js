const router = require('express').Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [products] = await db.query(`
      SELECT
        p.id,
        p.name,
        p.description,
        p.price,
        p.stock,
        c.id   AS category_id,
        c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.name
    `);
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [[product]] = await db.query(`
      SELECT
        p.id,
        p.name,
        p.description,
        p.price,
        p.stock,
        c.id   AS category_id,
        c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [req.params.id]);

    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
