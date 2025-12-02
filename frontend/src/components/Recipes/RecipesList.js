import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "";

export default function RecipesList() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);

  // GET /recipes
  useEffect(() => {
    const abortController = new AbortController();
    const startTime = Date.now();
    
    fetch(`${API_BASE}/recipes`, { signal: abortController.signal })
      .then((res) => {
        const responseTime = Date.now() - startTime;
        
        // If response took more than 3 seconds, show success message that backend is ready
        if (responseTime > 3000) {
          toast.success("Backend is now ready!", { duration: 3000 });
        }
        
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then(({ data }) => setRecipes(data))
      .catch((err) => {
        if (err.name !== "AbortError") {
          toast.error("Failed to load recipes. Backend may still be starting up...", {
            duration: 5000,
          });
        }
      });
    return () => abortController.abort();
  }, []);

  // DELETE /recipes/:id
  const handleDelete = (id) => {
  const ok = window.confirm("Are you sure you want to delete this recipe?");
  if (!ok) return;

  const abortController = new AbortController();

  fetch(`${API_BASE}/recipes/${id}`, {
    method: "DELETE",
    signal: abortController.signal,
  })
    .then((res) => {
      if (!res.ok) throw new Error("Delete failed");
      setRecipes((prev) => prev.filter((r) => r.id !== id));
      toast("Recipe deleted", { icon: "🗑️" });
    })
    .catch((err) => {
      if (err.name !== "AbortError") {
        console.error(err);
        toast.error("Failed to delete recipe");
      }
    });

  return () => abortController.abort(); 
};

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">Recipes</h2>
      <div className="d-flex justify-content-end mb-4">
        <button
          onClick={() => navigate("/recipes/new")}
          className="btn btn-primary"
        >
          + Create New Recipe
        </button>
      </div>

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {recipes.map((r) => (
          <div className="col" key={r.id}>
            <div className="card h-100 recipe-card-container">
              {r.image_url ? (
                <img
                  src={r.image_url}
                  className="card-img-top"
                  alt={r.title}
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
                <h5 className="card-title">{r.title || `Recipe ${r.id}`}</h5>
                {r.description && (
                  <p className="card-text small text-muted">{r.description.substring(0, 100)}{r.description.length > 100 ? '...' : ''}</p>
                )}
                <div className="mt-auto d-flex flex-wrap gap-2">
                  <button
                    onClick={() => navigate(`/recipes/${r.id}`)}
                    className="btn btn-outline-primary btn-sm"
                  >
                    View
                  </button>
                  <button
                    onClick={() => navigate(`/recipes/${r.id}`)}
                    className="btn btn-outline-secondary btn-sm"
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

