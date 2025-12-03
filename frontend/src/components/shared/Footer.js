import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <nav>
        <Link to="/">Home</Link>
        <Link to="/ingredients">Ingredients</Link>
        <Link to="/recipes">Recipes</Link>
        <Link to="/baked_goods">Baked Goods</Link>
      </nav>
      <small>© 2025 created by <a href="https://github.com/jkfaris94" target="_blank" rel="noopener noreferrer">jkfaris94</a>.</small>
    </footer>
  );
}
