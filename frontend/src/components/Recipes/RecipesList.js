import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

function RecipesList() {
  const navigate = useNavigate();
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

      {/* Create New Recipe Button */}
      <button onClick={() => navigate("/recipes/new")}>+ Create New Recipe</button>

      <ul>
        {recipes.map((r) => (
          <li key={r.id} className="recipe-item">
            <div className="recipe-header">
              <strong>{r.name || `Recipe ${r.id}`}</strong>
              {/* Show image_url instead of baked_good_id */}
              {r.image_url ? (
                <img
                  src={r.image_url}
                  alt={r.name}
                  style={{ width: 120, height: 80, objectFit: 'cover', marginLeft: 8 }}
                />
              ) : (
                <span className="no-image" style={{ marginLeft: 8 }}>No image</span>
              )}
            </div>

            {/* View ingredients */}
            <button onClick={() => navigate(`/recipes/${r.id}`)}>View</button>

            {/* Edit name - future: PUT /recipes/:id */}
            <button onClick={() => console.log("Edit", r.id)}>Edit</button>

            {/* Delete */}
            <button onClick={() => handleDelete(r.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RecipesList;
