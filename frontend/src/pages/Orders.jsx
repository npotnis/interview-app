import { useEffect, useState } from 'react';

const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
const fmtDate = (s) => new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export default function Orders() {
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetch('/api/orders')
      .then(r => r.json())
      .then(data => { setOrders(data); setLoading(false); })
      .catch(() => { setError('Failed to load orders'); setLoading(false); });
  }, []);

  const visible = statusFilter
    ? orders.filter(o => o.status === statusFilter)
    : orders;

  if (loading) return <div className="loading">Loading orders…</div>;
  if (error)   return <div className="error">{error}</div>;

  return (
    <div className="card">
      <div className="section-header">
        <h2>Orders <span style={{ color: '#7a7f8e', fontWeight: 400 }}>({visible.length})</span></h2>
        <div className="filters" style={{ marginBottom: 0 }}>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            {['pending','processing','shipped','delivered','cancelled'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Date</th>
              <th style={{ textAlign: 'right' }}>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {visible.map(order => (
              <>
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>
                    <div>{order.customer_name}</div>
                    <div style={{ fontSize: 12, color: '#7a7f8e' }}>{order.customer_email}</div>
                  </td>
                  <td><span className={`badge badge-${order.status}`}>{order.status}</span></td>
                  <td>{fmtDate(order.created_at)}</td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>{fmt(order.total)}</td>
                  <td>
                    <button
                      className="expand-btn"
                      onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                    >
                      {expanded === order.id ? '▲ Hide' : '▼ Items'}
                    </button>
                  </td>
                </tr>
                {expanded === order.id && (
                  <tr className="order-items-row" key={`items-${order.id}`}>
                    <td colSpan={6}>
                      <div className="order-items-inner">
                        <table>
                          <thead>
                            <tr>
                              <th>Product</th>
                              <th style={{ textAlign: 'right' }}>Unit Price</th>
                              <th style={{ textAlign: 'right' }}>Qty</th>
                              <th style={{ textAlign: 'right' }}>Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items.map(item => (
                              <tr key={item.id}>
                                <td>{item.product_name}</td>
                                <td style={{ textAlign: 'right' }}>{fmt(item.unit_price)}</td>
                                <td style={{ textAlign: 'right' }}>{item.quantity}</td>
                                <td style={{ textAlign: 'right', fontWeight: 600 }}>{fmt(item.unit_price * item.quantity)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
