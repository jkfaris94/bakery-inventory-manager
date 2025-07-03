import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

function IngredientView() {
  const { ingredientId } = useParams();
  const navigate = useNavigate();

  const [ingredient, setIngredient] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", quantity: 0, unit: "" });

  // Fetch ingredient and related recipes 
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/ingredients/${ingredientId}`)
      .then((res) => res.json())
      .then((data) => {
        setIngredient(data);
        setFormData(data);
      })
      .catch(() => toast.error("Failed to load ingredient"));

  fetch(`${process.env.REACT_APP_API_BASE_URL}/ingredients/${ingredientId}/recipes`)
      .then((res) => res.json())
      .then(setRecipes)
      .catch(() => toast.error("Failed to load related recipes"));
  }, [ingredientId]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Update ingredient
  const handleUpdate = (e) => {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_API_BASE_URL}/ingredients/${ingredientId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        setIngredient(data);
        toast.success("Ingredient updated");
        setIsEditing(false);
      })
      .catch(() => toast.error("Failed to update ingredient"));
  };

  // Delete ingredient
  const handleDelete = () => {
  if (window.confirm("Are you sure you want to delete this ingredient?")) {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/ingredients/${ingredientId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) return res.json().then((data) => Promise.reject(data));
        navigate("/ingredients");
        toast("Ingredient deleted", { icon: "🗑️" });
      })
      .catch((err) => {
        toast.error(err?.error || "Failed to delete ingredient");
      });
  }
};

  if (!ingredient) return <p>Loading...</p>;

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center">Ingredient Details</h2>

      {isEditing ? (
        <form onSubmit={handleUpdate} className="row g-3">
          <div className="col-md-4">
            <label htmlFor="name" className="form-label">
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="quantity" className="form-label">
              Quantity:
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="unit" className="form-label">
              Unit:
            </label>
            <input
              type="text"
              id="unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="col-12 text-center mt-3">
            <button type="submit" className="btn btn-success me-2">
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-4">
          <dl className="d-flex flex-column align-items-center mb-4">
            <div className="d-flex align-items-center mb-2">
              <dt className="me-2 fw-bold">Name:</dt>
              <dd className="mb-0">{ingredient.name}</dd>
            </div>
            <div className="d-flex align-items-center">
              <dt className="me-2 fw-bold">Quantity:</dt>
              <dd className="mb-0">
                {ingredient.quantity} {ingredient.unit}
              </dd>
            </div>
          </dl>
          <div className="text-center">
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-primary me-2"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="btn btn-danger"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {recipes.length > 0 && (
        <div className="mt-4">
          <h4 className="text-center">Used In Recipes</h4>
          <ul className="list-group">
            {recipes.map((r) => (
              <li
                key={r.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {r.name || `Recipe ${r.id}`}
                <button
                  onClick={() => navigate(`/recipes/${r.id}`)}
                  className="btn btn-outline-primary btn-sm"
                >
                  View
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="text-center mt-4">
        <button
          onClick={() => navigate("/ingredients")}
          className="btn btn-secondary"
        >
          Back to Ingredients
        </button>
      </div>
    </div>
  );
}

export default IngredientView;
