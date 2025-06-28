import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function RecipeView() {
  const { id } = useParams(); // Get :id from URL
  const navigate = useNavigate();

  const [recipeName, setRecipeName] = useState("");
  const [ingredients, setIngredients] = useState([]);

  // GET /recipes/:id/ingredients
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/recipes/${id}/ingredients`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setRecipeName(data[0].recipe_name || `Recipe ${id}`);
          setIngredients(data);
        } else {
          setRecipeName(`Recipe ${id}`);
        }
      })
      .catch(console.error);
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
            </li>
          ))}
        </ul>
      )}

      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
}

export default RecipeView;
