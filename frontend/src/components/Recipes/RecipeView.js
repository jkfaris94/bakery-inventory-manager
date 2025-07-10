import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AddRecipeIngredientForm from "./AddRecipeIngredientForm";
import { toast } from "react-hot-toast";

export default function RecipeView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [ingredients, setIngredients] = useState([]);

  // Fetch recipe and ingredients
  useEffect(() => {
    async function load() {
      //fetch recipe by ID
      try {
        const recipeRes = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/recipes/${id}`
        );
        if (!recipeRes.ok) throw new Error("Could not load recipe");
        
        const {
          data: recipeData
        } = await recipeRes.json();
        setRecipe(recipeData);

        //fetch ingredients for the recipe
        const ingrRes = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/recipes/${id}/ingredients`
        );
        if (!ingrRes.ok) throw new Error("Could not load ingredients");
        const ingrData = await ingrRes.json();
        setIngredients(ingrData);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load recipe");
      }
    }
    load();
  }, [id]);

  const recipeTitle = recipe?.title ?? `Recipe ${id}`;

  // Bake the recipe
  const handleBake = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/recipes/${id}/bake`, {
      method: "POST",
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
        if (error?.missing) {
          toast.error("Not enough ingredients to bake!");
          console.error("Missing:", error.missing);
        } else {
          toast.error("Failed to bake");
        }
      });
  };

  // Remove ingredient from recipe
  const handleRemove = (ingredientId) => {
    fetch(
      `${process.env.REACT_APP_API_BASE_URL}/recipes/${id}/ingredients/${ingredientId}`,
      { method: "DELETE" }
    )
      .then(() => {
        setIngredients((prev) =>
          prev.filter((i) => i.ingredient_id !== ingredientId)
        );
      })
      .catch(console.error);
  };

  if (!recipe) return <p>Loading…</p>;

  return (
    <div className="container py-4">
      <h2 className="text-center mb-3">{recipeTitle}</h2>
      {recipe.description && (
        <p className="text-center mb-4">{recipe.description}</p>
      )}
      <div className="row justify-content-center mb-4">
        <div className="col-md-6">
          {recipe.image_url ? (
            <img
              src={recipe.image_url}
              alt={recipe.name}
              className="img-fluid rounded mx-auto d-block mb-3"
              style={{ maxHeight: "150px", objectFit: "cover" }}
            />
          ) : (
            <div
              className="bg-light d-flex align-items-center justify-content-center mb-3"
              style={{ height: "150px" }}
            >
              <span className="text-muted">No image available</span>
            </div>
          )}
          <div className="text-center mb-3">
            <button className="btn btn-success btn-sm me-2" onClick={handleBake}>
              Bake "{recipeTitle}"
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-6">
          <h4 className="mb-3 text-center">Ingredients</h4>
          {ingredients.length === 0 ? (
            <p className="text-center">No ingredients yet.</p>
          ) : (
            <ul className="list-group mb-4">
              {ingredients.map((ing) => (
                <li
                  key={ing.ingredient_id}
                  className="list-group-item d-flex justify-content-between align-items-center py-2"
                >
                  <span>
                    {ing.name} — {ing.quantity_needed} {ing.unit}
                  </span>
                  <button
                    className="btn btn-outline-danger btn-sm"
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

      <div className="row justify-content-center">
        <div className="col-md-6">
          <AddRecipeIngredientForm
            recipeId={id}
            onAdd={() => {
              fetch(
                `${process.env.REACT_APP_API_BASE_URL}/recipes/${id}/ingredients`
              )
                .then((res) => res.json())
                .then(setIngredients);
            }}
          />
        </div>
      </div>
    </div>
  );
}