import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AddRecipeIngredientForm from "./AddRecipeIngredientForm";
import { toast } from "react-hot-toast";

function RecipeView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipeName, setRecipeName] = useState("");
  const [ingredients, setIngredients] = useState([]);

  // Fetch recipe ingredients and recipe name
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/recipes/${id}/ingredients`)
      .then((res) => res.json())
      .then((data) => {
        setRecipeName(data[0]?.recipe_name || `Recipe ${id}`);
        setIngredients(data);
      });
  }, [id]);

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

  return (
    <div>
      <h2>{recipeName}</h2>
      <button onClick={handleBake}>Bake {recipeName}</button>

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
