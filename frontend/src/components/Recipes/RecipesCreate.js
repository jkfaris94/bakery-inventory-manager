import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

function RecipeCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${process.env.REACT_APP_API_BASE_URL}/recipes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) return res.json().then((err) => Promise.reject(err));
        return res.json();
      })
      .then((created) => {
        toast.success("Recipe created!");
        navigate(`/recipes/${created.id}`);
      })
      .catch((err) => {
        toast.error(err.error || "Failed to create recipe");
      });
  };

  return (
    <div>
      <h2>Create New Recipe</h2>
      <form onSubmit={handleSubmit} className="recipe-form">
        <div className="form-group">
          <label htmlFor="name">Recipe Name:</label>
          <input
            id="name"
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="image_url">Image URL:</label>
          <input
            id="image_url"
            type="url"
            name="image_url"
            placeholder="https://example.com/image.jpg"
            value={formData.image_url}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default RecipeCreate;
