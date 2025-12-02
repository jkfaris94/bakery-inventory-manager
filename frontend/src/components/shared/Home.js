import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container text-center">
      <div className="home-hero">
        <h1 className="display-4">Maeve's Fine Baked Goods</h1>
        <p className="lead">Welcome to the inventory manager!</p>
        <p className="text-muted mb-5">Manage your ingredients, recipes, and baked goods inventory all in one place.</p>
        <div className="d-flex flex-wrap justify-content-center gap-3">
          <Link to="/ingredients" className="btn btn-primary btn-lg">
            Ingredients
          </Link>
          <Link to="/recipes" className="btn btn-primary btn-lg">
            Recipes
          </Link>
          <Link to="/baked_goods" className="btn btn-primary btn-lg">
            Baked Goods
          </Link>
        </div>
      </div>
    </div>
  );
}