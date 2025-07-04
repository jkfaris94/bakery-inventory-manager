import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function RecipesList() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);

  // GET /recipes
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/recipes`)
      .then((res) => res.json())
      .then(setRecipes)
      .catch(() => toast.error("Failed to load recipes"));
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
    <div className="container py-4">
      <h2 className="text-center mb-4">Recipes</h2>
      <div className="d-flex justify-content-end mb-3">
        <button
          onClick={() => navigate("/recipes/new")}
          className="btn btn-primary"
        >
          + Create New Recipe
        </button>
      </div>

      <div className="row row-cols-1 row-cols-md-2 g-4">
        {recipes.map((r) => (
          <div className="col" key={r.id}>
            <div className="card h-100">
              {r.image_url ? (
                <img
                  src={r.image_url}
                  className="card-img-top"
                  alt={r.name}
                  style={{ objectFit: "cover", height: "180px" }}
                />
              ) : (
                <div
                  className="d-flex align-items-center justify-content-center bg-light"
                  style={{ height: "180px" }}
                >
                  <span className="text-muted">No image available</span>
                </div>
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{r.name || `Recipe ${r.id}`}</h5>
                <div className="mt-auto">
                  <button
                    onClick={() => navigate(`/recipes/${r.id}`)}
                    className="btn btn-outline-primary btn-sm me-2"
                  >
                    View
                  </button>
                  <button
                    onClick={() => navigate(`/recipes/${r.id}/edit`)}
                    className="btn btn-outline-secondary btn-sm me-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

