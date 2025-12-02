import { NavLink } from "react-router-dom";

export default function NavBar() {
  const links = [
    { to: '/', label: 'Home', end: true },
    { to: '/recipes', label: 'Recipes' },
    { to: '/recipes/new', label: 'New Recipe' },
    { to: '/ingredients', label: 'Ingredients' },
    { to: '/ingredients/new', label: 'New Ingredient' },
    { to: '/baked_goods', label: 'Baked Goods' },
  ];

  return (
    <div className="container">
      <h1 className="mb-0">Maeve's Fine Baked Goods</h1>
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container-fluid px-0">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNav"
            aria-controls="mainNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
            style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}
          >
            <span className="navbar-toggler-icon" style={{ filter: 'invert(1)' }} />
          </button>
          <div className="collapse navbar-collapse" id="mainNav">
            <ul className="navbar-nav ms-auto">
              {links.map(({ to, label, end }) => (
                <li className="nav-item" key={to}>
                  <NavLink
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      'nav-link' + (isActive ? ' active' : '')
                    }
                    style={{ color: 'white' }}
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
