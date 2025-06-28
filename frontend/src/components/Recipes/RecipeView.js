import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AddRecipeIngredientForm from "./AddRecipeIngredientForm";

function RecipeView() {
  const { id } = useParams(); // Get :id from URL
  const navigate = useNavigate();

  const [recipeName, setRecipeName] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [allIngredients, setAllIngredients] = useState([]);
  const [newIngredientId, setNewIngredientId] = useState("");
  const [newQuantity, setNewQuantity] = useState("");

  // GET /recipes/:id/ingredients
  useEffect(() => {
  fetch(`${process.env.REACT_APP_API_BASE_URL}/recipes/${id}/ingredients`)
    .then((res) => res.json())
    .then((data) => {
      setRecipeName(data[0]?.recipe_name || `Recipe ${id}`);
      setIngredients(data);
    });

  // GET /ingredients for dropdown
  fetch(`${process.env.REACT_APP_API_BASE_URL}/ingredients`)
    .then((res) => res.json())
    .then(setAllIngredients);
}, [id]);

  return (
  <div>
    <h2>{recipeName}</h2>

    <h4>Ingredients</h4>
    {ingredients.length === 0 ? (
      <p>No ingredients yet.</p>
    ) : (
      <ul>
        {ingredients.map((ing) => (
          <li key={ing.ingredient_id}>
            {ing.name} — {ing.quantity} {ing.unit}
            <button
              onClick={() => {
                fetch(
                  `${process.env.REACT_APP_API_BASE_URL}/recipes/${id}/ingredients/${ing.ingredient_id}`,
                  { method: "DELETE" }
                )
                  .then(() => {
                    setIngredients((prev) =>
                      prev.filter((i) => i.ingredient_id !== ing.ingredient_id)
                    );
                  })
                  .catch(console.error);
              }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    )}

    {/* Add ingredient form component */}
    <AddRecipeIngredientForm
      recipeId={id}
      onAdd={(newEntry) => setIngredients([...ingredients, newEntry])}
    />

    <br />
    <button onClick={() => navigate(-1)}>Back</button>
  </div>
  );
}

export default RecipeView;
