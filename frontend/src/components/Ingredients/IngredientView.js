import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "";

export default function IngredientView() {
  const params = useParams();
  const id = params.id || params.ingredientId;
  const navigate = useNavigate();

  const [ingredient, setIngredient] = useState(null);
  const [recipes, setRecipes] = useState([]);

  // Fetch ingredient and related recipes
  useEffect(() => {
  const controller = new AbortController();
  const { signal } = controller;

  // Fetch ingredient
  fetch(`${API_BASE}/ingredients/${id}`, { signal })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(({ data }) => setIngredient(data))
    .catch((err) => {
      if (err.name === "AbortError") return;
      console.error("Failed to load ingredient", err);
      toast.error("Failed to load ingredient");
    });

  // Fetch related recipes
  fetch(`${API_BASE}/ingredients/${id}/recipes`, { signal })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(({ data }) => setRecipes(data))
    .catch((err) => {
      if (err.name === "AbortError") return;
      console.error("Failed to load related recipes", err);
      toast.error("Failed to load related recipes");
    });

  // cleanup: cancel both fetches if component unmounts or id changes
  return () => controller.abort();
}, [id]);

const handleDelete = async () => {
  if (!window.confirm("Are you sure you want to delete this ingredient?")) {
    return;
  }

  const abortController = new AbortController();

  try {
    const res = await fetch(`${API_BASE}/ingredients/${id}`, {
      method: "DELETE",
      signal: abortController.signal,
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || "Failed to delete ingredient");
    }

    toast.success("Ingredient deleted", { icon: "🗑️" });
    navigate("/ingredients");
  } catch (err) {
    if (err.name === "AbortError") return;
    console.error("Failed to delete ingredient", err);
    toast.error(err.message);
  }

  return () => abortController.abort(); 
};

  if (!ingredient) return <p className="loading-text">Loading ingredient...</p>;

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Header Section */}
          <div className="view-header">
            <h2>{ingredient.name}</h2>
            <p className="text-secondary">Ingredient Details</p>
          </div>

          {/* Main Details Card */}
          <div className="detail-card">
            <div className="card-body">
              <div className="row justify-content-center text-center">
                <div className="col-sm-6">
                  <div className="detail-field">
                    <span className="detail-label">Quantity In Stock</span>
                    <div className="detail-value">{ingredient.quantity} {ingredient.unit}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Recipes Section */}
          {recipes.length > 0 && (
            <div className="related-section">
              <div className="card-body">
                <h4 className="text-center">Used In Recipes</h4>
                <ul className="list-group mb-0">
                  {recipes.map((r) => (
                    <li key={r.id} className="list-group-item related-item">
                      <span className="related-item-name">{r.title || `Recipe ${r.id}`}</span>
                      <button 
                        onClick={() => navigate(`/recipes/${r.id}`)} 
                        className="btn btn-outline-primary btn-sm"
                      >
                        View
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="view-actions mt-4">
            <button 
              onClick={() => navigate(`/ingredients/${id}/edit`)} 
              className="btn btn-primary"
            >
              Edit Ingredient
            </button>
            <button 
              onClick={handleDelete} 
              className="btn btn-danger"
            >
              Delete
            </button>
            <button 
              onClick={() => navigate("/ingredients")} 
              className="btn btn-secondary"
            >
              Back to Ingredients
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

