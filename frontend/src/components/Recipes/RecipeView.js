import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AddRecipeIngredientForm from "./AddRecipeIngredientForm";
import { toast } from "react-hot-toast";

function RecipeView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [ingredients, setIngredients] = useState([]);

  // Fetch recipe and ingredients
    useEffect(() => {
    async function load() {
      try {
        // fetch recipe 
        const recipeRes = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/recipes/${id}`
        );
        if (!recipeRes.ok) throw new Error("Could not load recipe");
        const recipeData = await recipeRes.json();
        setRecipe(recipeData);

        // fetch ingredients
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

  const recipeTitle = recipe?.name ?? `Recipe ${id}`;

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
    fetch(`${process.env.REACT_APP_API_BASE_URL}/recipes/${id}/ingredients/${ingredientId}`, {
      method: "DELETE",
    })
      .then(() => {
        setIngredients((prev) => prev.filter((i) => i.ingredient_id !== ingredientId));
      })
      .catch(console.error);
  };

  if (!recipe) return <p>Loading…</p>;

  return (
    <div>
      <h2>{recipeTitle}</h2>

      {/* Image URL beneath the title */}
      {recipe.image_url ? (
        <img
          src={recipe.image_url}
          alt={recipe.name}
          style={{ width: 200, height: 120, objectFit: 'cover', margin: '12px 0' }}
        />
      ) : (
        <p>No image yet</p>
      )}

      <button onClick={handleBake}>Bake "{recipeTitle}"</button>

      <h4>Ingredients</h4>
      {ingredients.length === 0 ? (
        <p>No ingredients yet.</p>
      ) : (
        <ul>
          {ingredients.map((ing) => (
            <li key={ing.ingredient_id}>
              {ing.name} — {ing.quantity_needed} {ing.unit}
              <button onClick={() => handleRemove(ing.ingredient_id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}

      <AddRecipeIngredientForm
        recipeId={id}
        onAdd={() => {
          fetch(`${process.env.REACT_APP_API_BASE_URL}/recipes/${id}/ingredients`)
            .then((res) => res.json())
            .then(setIngredients);
        }}
      />

      <br />
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
}

export default RecipeView;
