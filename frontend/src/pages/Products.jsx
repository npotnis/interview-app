import { useEffect, useState } from 'react';

const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

export default function Products() {
  const [products, setProducts]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [search, setSearch]         = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
    ])
      .then(([prods, cats]) => {
        setProducts(prods);
        setCategories(cats);
        setLoading(false);
      })
      .catch(() => { setError('Failed to load products'); setLoading(false); });
  }, []);

  const visible = products.filter(p => {
    const matchSearch   = !search || p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !categoryFilter || String(p.category_id) === categoryFilter;
    return matchSearch && matchCategory;
  });

  if (loading) return <div className="loading">Loading products…</div>;
  if (error)   return <div className="error">{error}</div>;

  return (
    <>
      <div className="filters">
        <input
          type="text"
          placeholder="Search products…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 220 }}
        />
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
          <option value="">All categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <span style={{ color: '#7a7f8e', fontSize: 13 }}>{visible.length} products</span>
      </div>

      <div className="products-grid">
        {visible.map(p => (
          <div className="product-card" key={p.id}>
            <div className="product-category">{p.category_name}</div>
            <div className="product-name">{p.name}</div>
            <div className="product-price">{fmt(p.price)}</div>
            <div className="product-stock">Stock: {p.stock.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </>
  );
}
