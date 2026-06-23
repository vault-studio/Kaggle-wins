import { NavLink, Outlet } from 'react-router-dom'
import { phases } from '../phases'
import './Layout.css'

export default function Layout() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">K</span>
          <span>Kaggle Wins</span>
        </div>
        <nav>
          {phases.map((p) => (
            <NavLink
              key={p.slug}
              to={`/${p.slug}`}
              className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}
            >
              <span className="nav-num">{p.num}</span>
              <span>{p.title}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}
