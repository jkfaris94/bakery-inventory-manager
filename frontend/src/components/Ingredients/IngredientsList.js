import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function IngredientsList() {
  const [ingredients, setIngredients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/ingredients`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then(({ data }) => setIngredients(data))
      .catch(() => toast.error("Failed to load ingredients"));
  }, []);

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">Ingredients</h2>

      <div className="d-flex justify-content-center mb-3">
        <button
          className="btn btn-primary "
          onClick={() => navigate("/ingredients/new")}
        >
          + Create New Ingredient
        </button>
      </div>

      {ingredients.length === 0 ? (
        <p className="text-center">No ingredients found.</p>
      ) : (
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <ul className="list-group">
              {ingredients.map((ing) => (
                <li
                  key={ing.id}
                  className="list-group-item d-flex justify-content-between align-items-center py-2"
                >
                  <div>
                    <span className="fw-bold me-2">{ing.name}</span>
                    <small className="text-muted">
                      {ing.quantity} {ing.unit}
                    </small>
                  </div>

                  <div>
                    <button
                      className="btn btn-outline-primary btn-sm me-2"
                      onClick={() => navigate(`/ingredients/${ing.id}`)}
                    >
                      View
                    </button>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => navigate(`/ingredients/${ing.id}/edit`)}
                    >
                      Edit
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
