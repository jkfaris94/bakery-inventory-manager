import { useEffect, useState } from "react";

function RecipesList() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/recipes`)
      .then((res) => res.json())
      .then(setRecipes)
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2>Recipes</h2>
      <ul>
        {recipes.map((r) => (
          <li key={r.id}>
            {r.name || `Recipe ${r.id}`} — Baked Good ID: {r.baked_good_id}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RecipesList;
