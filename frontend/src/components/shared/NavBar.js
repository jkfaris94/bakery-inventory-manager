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
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <NavLink to="/" end className="navbar-brand">
          Maeve’s Fine Baked Goods
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
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
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
