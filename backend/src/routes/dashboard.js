const router = require('express').Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    // BUG: SUM(oi.unit_price) ignores quantity — should be SUM(oi.unit_price * oi.quantity)
    const [[revenueRow]] = await db.query(`
      SELECT SUM(oi.unit_price) AS total_revenue
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      WHERE o.status = 'delivered'
    `);

    // BUG: avg_order_value has the same mistake
    const [[avgRow]] = await db.query(`
      SELECT AVG(order_total) AS avg_order_value
      FROM (
        SELECT o.id, SUM(oi.unit_price) AS order_total
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        GROUP BY o.id
      ) t
    `);

    const [[countRow]] = await db.query(`
      SELECT COUNT(*) AS order_count FROM orders WHERE status != 'cancelled'
    `);

    const [[customerRow]] = await db.query(`
      SELECT COUNT(*) AS customer_count FROM customers
    `);

    // Recent orders — also uses wrong total (consistent with the bug)
    const [recentOrders] = await db.query(`
      SELECT
        o.id,
        o.status,
        o.created_at,
        c.name AS customer_name,
        SUM(oi.unit_price) AS total
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id, o.status, o.created_at, c.name
      ORDER BY o.created_at DESC
      LIMIT 10
    `);

    res.json({
      total_revenue: parseFloat(revenueRow.total_revenue) || 0,
      avg_order_value: parseFloat(avgRow.avg_order_value) || 0,
      order_count: countRow.order_count,
      customer_count: customerRow.customer_count,
      recent_orders: recentOrders.map(o => ({
        ...o,
        total: parseFloat(o.total) || 0,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
