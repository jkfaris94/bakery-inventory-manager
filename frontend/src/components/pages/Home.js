import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Maeve’s Fine Baked Goods</h1>
      <p>Welcome to the inventory manager!</p>
      <nav style={{ marginTop: "2rem" }}>
        <Link to="/ingredients" style={{ margin: "1rem" }}>Ingredients</Link>
        <Link to="/baked_goods" style={{ margin: "1rem" }}>Baked Goods</Link>
        <Link to="/recipes" style={{ margin: "1rem" }}>Recipes</Link>
      </nav>
    </div>
  );
}