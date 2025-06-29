import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

function IngredientView() {
  const { ingredientId } = useParams();
  const navigate = useNavigate();

  const [ingredient, setIngredient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", quantity: 0, unit: "" });

  // Fetch ingredient
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/ingredients/${ingredientId}`)
      .then((res) => res.json())
      .then((data) => {
        setIngredient(data);
        setFormData(data);
      })
      .catch(() => toast.error("Failed to load ingredient"));
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
        .then(() => {
          toast("Ingredient deleted", { icon: "🗑️" });
          navigate("/ingredients");
        })
        .catch(() => toast.error("Failed to delete ingredient"));
    }
  };

  if (!ingredient) return <p>Loading...</p>;

  return (
    <div>
      <h2>Ingredient Details</h2>

      {isEditing ? (
        <form onSubmit={handleUpdate}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            required
          />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <div>
          <p>
            <strong>Name:</strong> {ingredient.name}
          </p>
          <p>
            <strong>Quantity:</strong> {ingredient.quantity} {ingredient.unit}
          </p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}

      <br />
      <button onClick={() => navigate("/ingredients")}>Back to List</button>
    </div>
  );
}

export default IngredientView;
