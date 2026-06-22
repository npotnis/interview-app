import { useEffect, useState } from 'react';

const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
const fmtDate = (s) => new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(setData)
      .catch(() => setError('Failed to load dashboard data'));
  }, []);

  if (error) return <div className="error">{error}</div>;
  if (!data)  return <div className="loading">Loading…</div>;

  return (
    <>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="label">Total Revenue</div>
          <div className="value">{fmt(data.total_revenue)}</div>
          <div className="sub">Delivered orders only</div>
        </div>
        <div className="stat-card">
          <div className="label">Avg Order Value</div>
          <div className="value">{fmt(data.avg_order_value)}</div>
          <div className="sub">All statuses</div>
        </div>
        <div className="stat-card">
          <div className="label">Total Orders</div>
          <div className="value">{data.order_count.toLocaleString()}</div>
          <div className="sub">Excluding cancelled</div>
        </div>
        <div className="stat-card">
          <div className="label">Customers</div>
          <div className="value">{data.customer_count.toLocaleString()}</div>
          <div className="sub">All time</div>
        </div>
      </div>

      <div className="card">
        <div className="section-header">
          <h2>Recent Orders</h2>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Date</th>
                <th style={{ textAlign: 'right' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {data.recent_orders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.customer_name}</td>
                  <td><StatusBadge status={order.status} /></td>
                  <td>{fmtDate(order.created_at)}</td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>{fmt(order.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function StatusBadge({ status }) {
  return <span className={`badge badge-${status}`}>{status}</span>;
}
