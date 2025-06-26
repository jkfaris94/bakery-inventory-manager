import { useEffect, useState } from "react";

function IngredientsList() {
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/ingredients`)
      .then((res) => res.json())
      .then(setIngredients)
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2>Ingredients</h2>
      <ul>
        {ingredients.map((ing) => (
          <li key={ing.id}>
            {ing.name} — {ing.quantity} {ing.unit}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default IngredientsList;
