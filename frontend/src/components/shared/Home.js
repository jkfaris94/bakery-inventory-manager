import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container text-center py-5">
      <h1 className="display-4">Maeve’s Fine Baked Goods</h1>
      <p className="lead mt-3">Welcome to the inventory manager!</p>
      <div className="mt-4">
        <Link to="/ingredients" className="btn btn-primary mx-2">
          Ingredients
        </Link>
        <Link to="/baked_goods" className="btn btn-primary mx-2">
          Baked Goods
        </Link>
        <Link to="/recipes" className="btn btn-primary mx-2">
          Recipes
        </Link>
      </div>
    </div>
  );
}