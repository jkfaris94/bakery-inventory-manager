import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AddRecipeIngredientForm from "./AddRecipeIngredientForm";
import { toast } from "react-hot-toast";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "";

export default function RecipeView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [ingredients, setIngredients] = useState([]);

  // Fetch recipe and ingredients
  useEffect(() => {
    const abortController = new AbortController();
    
    async function load() {
    try {
      const recipeRes = await fetch(`${API_BASE}/recipes/${id}`, {
        signal: abortController.signal,
      });
      if (!recipeRes.ok) throw new Error("Could not load recipe");

      const { data: recipeData } = await recipeRes.json();
      setRecipe(recipeData);

      const ingrRes = await fetch(`${API_BASE}/recipes/${id}/ingredients`, {
        signal: abortController.signal,
      });
      if (!ingrRes.ok) throw new Error("Could not load ingredients");

      const ingrData = await ingrRes.json();
      setIngredients(ingrData);
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error(err);
        toast.error("Failed to load recipe");
      }
    }
  }

  load();
  return () => abortController.abort();
}, [id]);

  const recipeTitle = recipe?.title ?? `Recipe ${id}`;

  // Bake the recipe
 const handleBake = () => {
  const abortController = new AbortController();

  fetch(`${API_BASE}/recipes/${id}/bake`, {
    method: "POST",
    signal: abortController.signal,
  })
    .then((res) => {
      if (!res.ok) return res.json().then((data) => Promise.reject(data));
      return res.json();
    })
    .then((data) => {
      toast.success(data.message || "Baking complete!");
      navigate("/baked_goods");
    })
    .catch((error) => {
      if (error.name === "AbortError") return;
      if (error?.missing) {
        toast.error("Not enough ingredients to bake!");
        console.error("Missing:", error.missing);
      } else {
        toast.error("Failed to bake");
      }
    });

  return () => abortController.abort();
};

  // Remove ingredient from recipe
  const handleRemove = (ingredientId) => {
  const abortController = new AbortController();

  fetch(`${API_BASE}/recipes/${id}/ingredients/${ingredientId}`, {
    method: "DELETE",
    signal: abortController.signal,
  })
    .then(() => {
      setIngredients((prev) =>
        prev.filter((i) => i.ingredient_id !== ingredientId)
      );
    })
    .catch((err) => {
      if (err.name !== "AbortError") {
        console.error(err);
        toast.error("Failed to remove ingredient.");
      }
    });

  return () => abortController.abort();
};

  //Disable button if we can't bake
  const canBake = ingredients.every(
    ({ quantity_available, quantity_needed }) =>
      quantity_available >= quantity_needed
  );

  // Build a list of only the missing bits
  const missing = ingredients
    .filter(({ quantity_available, quantity_needed }) =>
      quantity_available < quantity_needed
    )
    .map(({ name, quantity_available, quantity_needed, unit }) => ({
      name,
      missingBy: quantity_needed - quantity_available,
      unit,
    }));

  if (!recipe) return <p className="loading-text">Loading…</p>;

  // DELETE /recipes/:id
  const handleDelete = async () => {
  if (!window.confirm("Are you sure you want to delete this recipe?")) return;

  const abortController = new AbortController();

  try {
    const res = await fetch(`${API_BASE}/recipes/${id}`, {
      method: "DELETE",
      signal: abortController.signal,
    });
    if (!res.ok) throw new Error("Delete failed");
    toast("Recipe deleted", { icon: "🗑️" });
    navigate("/recipes");
  } catch (err) {
    if (err.name !== "AbortError") {
      console.error(err);
      toast.error("Failed to delete recipe");
    }
  }

  return () => abortController.abort();
};

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="form-container mb-4">
            <h2 className="text-center mb-3">{recipeTitle}</h2>
            {recipe.description && (
              <p className="text-center mb-0 text-muted">{recipe.description}</p>
            )}
          </div>
          
          <div className="card mb-4">
            {recipe.image_url ? (
              <img
                src={recipe.image_url}
                alt={recipe.name}
                className="card-img-top card-img-recipe"
              />
            ) : (
              <div className="card-img-placeholder-large">
                <span className="text-muted">No image available</span>
              </div>
            )}
            <div className="card-body">
              <div className="d-flex flex-wrap justify-content-center gap-2 mb-3">
                <button 
                  className="btn btn-success" 
                  disabled={!canBake}
                  onClick={handleBake}
                >
                  Bake "{recipeTitle}"
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate(-1)}
                >
                  Back
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  Delete Recipe
                </button>
              </div>
              {!canBake && missing.length > 0 && (
                <div className="alert alert-warning mt-3">
                  <strong>Missing ingredients:</strong>
                  <ul className="mb-0 mt-2">
                    {missing.map((m) => (
                      <li key={m.name}>
                        {m.name}: need {m.missingBy} more {m.unit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-body">
              <h4 className="mb-4 text-center">Ingredients</h4>
              {ingredients.length === 0 ? (
                <p className="text-center text-muted">No ingredients yet.</p>
              ) : (
                <ul className="list-group mb-0">
                  {ingredients.map((ing) => (
                    <li
                      key={ing.ingredient_id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <div className="flex-grow-1">
                        <span className="fw-bold">{ing.name}</span>
                        <small className="text-muted ms-2">
                          {ing.quantity_needed} {ing.unit}
                          {ing.quantity_available !== undefined && (
                            <span className={ing.quantity_available >= ing.quantity_needed ? 'text-success' : 'text-danger'}>
                              {' '}(Available: {ing.quantity_available})
                            </span>
                          )}
                        </small>
                      </div>
                      <button
                        className="btn btn-outline-danger btn-sm ms-3"
                        onClick={() => handleRemove(ing.ingredient_id)}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <AddRecipeIngredientForm
                recipeId={id}
                onAdd={() => {
                  fetch(
                    `${API_BASE}/recipes/${id}/ingredients`
                  )
                    .then((res) => res.json())
                    .then(setIngredients);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}