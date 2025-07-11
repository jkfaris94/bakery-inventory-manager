import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

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

  try {
    const res = await fetch(`${API_BASE}/ingredients/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || "Failed to delete ingredient");
    }
    toast.success("Ingredient deleted", { icon: "🗑️" });
    navigate("/ingredients");
  } catch (err) {
    console.error("Failed to delete ingredient", err);
    toast.error(err.message);
  }
};

  if (!ingredient) return <p>Loading ingredient...</p>;

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center">Ingredient Details</h2>

      <dl className="d-flex flex-column align-items-center mb-4">
        <div className="d-flex align-items-center mb-2">
          <dt className="me-2 fw-bold">Name:</dt>
          <dd className="mb-0">{ingredient.name}</dd>
        </div>
        <div className="d-flex align-items-center">
          <dt className="me-2 fw-bold">Quantity:</dt>
          <dd className="mb-0">{ingredient.quantity} {ingredient.unit}</dd>
        </div>
      </dl>

      <div className="text-center mb-4">
        <button onClick={() => navigate(`/ingredients/${id}/edit`)} className="btn btn-primary me-2">
          Edit
        </button>
        <button onClick={handleDelete} className="btn btn-danger">
          Delete
        </button>
      </div>

      {recipes.length > 0 && (
        <div className="mt-4">
          <h4 className="text-center">Used In Recipes</h4>
          <ul className="list-group">
            {recipes.map((r) => (
              <li key={r.id} className="list-group-item d-flex justify-content-between align-items-center">
                {r.title || `Recipe ${r.id}`}
                <button onClick={() => navigate(`/recipes/${r.id}`)} className="btn btn-outline-primary btn-sm">
                  View
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="text-center mt-4">
        <button onClick={() => navigate("/ingredients")} className="btn btn-secondary">
          Back to Ingredients
        </button>
      </div>
    </div>
  );
}

