import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "";

export default function IngredientsList() {
  const [ingredients, setIngredients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    const startTime = Date.now();
    
    fetch(`${API_BASE}/ingredients`, { signal: controller.signal })
      .then((res) => {
        const responseTime = Date.now() - startTime;
        
        // If response took more than 3 seconds, show success message that backend is ready
        if (responseTime > 3000) {
          toast.success("Backend is now ready!", { duration: 3000 });
        }
        
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then(({ data }) => setIngredients(data))
    .catch((err) => {
      if (err.name === "AbortError") return;
      console.error("Ingredients fetch failed:", err);
      toast.error("Failed to load ingredients. Backend may still be starting up...", {
        duration: 5000,
      });
    });

  // cleanup: cancel fetch if the component unmounts
  return () => controller.abort();
}, []);

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">Ingredients</h2>

      <div className="d-flex justify-content-center mb-4">
        <button
          className="btn btn-primary"
          onClick={() => navigate("/ingredients/new")}
        >
          + Create New Ingredient
        </button>
      </div>

      <div className="d-flex justify-content-center">
        <div className="form-container">
          {ingredients.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No ingredients found.</p>
            </div>
          ) : (
            <ul className="list-group">
              {ingredients.map((ing) => (
                <li
                  key={ing.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div className="flex-grow-1">
                    <span className="fw-bold d-block mb-1">{ing.name}</span>
                    <small className="text-muted">
                      {ing.quantity} {ing.unit}
                    </small>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-primary btn-sm"
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
          )}
        </div>
      </div>
    </div>
  );
}
