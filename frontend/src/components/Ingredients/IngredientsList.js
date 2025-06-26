import { useEffect, useState } from "react";
import IngredientForm from "./IngredientForm";

function IngredientsList() {
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/ingredients`)
      .then((res) => res.json())
      .then(setIngredients)
      .catch(console.error);
  }, []);

    const handleAdd = (newIngredient) => {
    setIngredients([...ingredients, newIngredient]);
  };

  return (
    <div>
      <h2>Ingredients</h2>
      <IngredientForm onAdd={handleAdd} />
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
