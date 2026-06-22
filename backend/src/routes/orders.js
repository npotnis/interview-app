const router = require('express').Router();
const db = require('../db');

// PERFORMANCE ISSUE: N+1 query — one extra DB round-trip per order to fetch its items.
// With 50 orders on this page, that's 51 queries instead of 2.
// Fix: use a JOIN + GROUP_CONCAT, or fetch all item rows in one query and group in JS.
// Also missing: index on order_items.order_id
router.get('/', async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT
        o.id,
        o.status,
        o.created_at,
        c.name  AS customer_name,
        c.email AS customer_email
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      ORDER BY o.created_at DESC
      LIMIT 50
    `);

    // N+1: separate query for every order
    for (const order of orders) {
      const [items] = await db.query(`
        SELECT
          oi.id,
          oi.quantity,
          oi.unit_price,
          p.name AS product_name
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `, [order.id]);

      order.items = items;
      order.total = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
    }

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [[order]] = await db.query(`
      SELECT
        o.id,
        o.status,
        o.created_at,
        c.name  AS customer_name,
        c.email AS customer_email
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      WHERE o.id = ?
    `, [req.params.id]);

    if (!order) return res.status(404).json({ error: 'Order not found' });

    const [items] = await db.query(`
      SELECT
        oi.id,
        oi.quantity,
        oi.unit_price,
        p.name AS product_name,
        p.id   AS product_id
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [req.params.id]);

    order.items = items;
    order.total = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
