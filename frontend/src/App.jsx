import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Products from './pages/Products';

const NAV = [
  { to: '/',         label: '◈  Dashboard' },
  { to: '/orders',   label: '⊡  Orders' },
  { to: '/products', label: '⊞  Products' },
];

export default function App() {
  return (
    <BrowserRouter>
      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-logo">Shop<span>Board</span></div>
          <nav>
            {NAV.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="main">
          <Routes>
            <Route path="/"         element={<PageShell title="Dashboard"><Dashboard /></PageShell>} />
            <Route path="/orders"   element={<PageShell title="Orders"><Orders /></PageShell>} />
            <Route path="/products" element={<PageShell title="Products"><Products /></PageShell>} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

function PageShell({ title, children }) {
  return (
    <>
      <div className="topbar">
        <h1>{title}</h1>
      </div>
      <div className="content">{children}</div>
    </>
  );
}
