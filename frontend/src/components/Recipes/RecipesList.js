import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

function RecipesList() {
  const [recipes, setRecipes] = useState([]);

  // GET /recipes
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/recipes`)
      .then((res) => res.json())
      .then(setRecipes)
      .catch(console.error);
  }, []);

   // DELETE /recipes/:id
  const handleDelete = (id) => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/recipes/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setRecipes((prev) => prev.filter((r) => r.id !== id));
        toast("Recipe deleted", { icon: "🗑️" });
      })
      .catch(() => toast.error("Failed to delete recipe"));
  };

  return (
    <div>
      <h2>Recipes</h2>

      <ul>
        {recipes.map((r) => (
          <li key={r.id}>
            <strong>{r.name || `Recipe ${r.id}`}</strong>
            {r.baked_good_id && <> — Bakes: Good #{r.baked_good_id}</>}

            {/* View ingredients - GET /recipes/:id/ingredients */}
            <button onClick={() => console.log("View", r.id)}>View</button>

            {/* Edit name - future: PUT /recipes/:id */}
            <button onClick={() => console.log("Edit", r.id)}>Edit</button>

            {/* Delete - DELETE /recipes/:id */}
            <button onClick={() => handleDelete(r.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RecipesList;
