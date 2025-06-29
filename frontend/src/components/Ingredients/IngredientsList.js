import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

function IngredientsList() {
  const [ingredients, setIngredients] = useState([]);
  const navigate = useNavigate();

  // GET /ingredients
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/ingredients`)
      .then((res) => res.json())
      .then(setIngredients)
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2>Ingredients</h2>

      <button onClick={() => navigate("/ingredients/new")}>
        Create New Ingredient
      </button>

      <ul>
        {ingredients.map((ing) => (
          <li key={ing.id}>
            {ing.name} — {ing.quantity} {ing.unit}
            <button onClick={() => navigate(`/ingredients/${ing.id}`)}>View</button>
            <button onClick={() => navigate(`/ingredients/${ing.id}/edit`)}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default IngredientsList;
