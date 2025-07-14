import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "";

export default function RecipeCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    title: "",
    image_url: "",
    description: "", 
  });

  const handleChange = ({ target: { name, value } }) =>
    setFormData((fd) => ({ ...fd, [name]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${API_BASE}/recipes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: formData }),
    })
      .then((res) => {
        if (!res.ok) return res.json().then((err) => Promise.reject(err));
        return res.json();
      })
      .then(({ data }) => {
        toast.success("Recipe created!");
        navigate(`/recipes/${data.id}`);
      })
      .catch((err) => {
        toast.error(err.error || "Failed to create recipe");
      });
  };

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">Create New Recipe</h2>
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-12">
              <label htmlFor="title" className="form-label">Recipe Name</label>
              <input
                id="title"
                name="title"
                type="text"
                className="form-control form-control-sm"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12">
              <label htmlFor="image_url" className="form-label">Image URL</label>
              <input
                id="image_url"
                name="image_url"
                type="url"
                className="form-control form-control-sm"
                placeholder="https://example.com/image.jpg"
                value={formData.image_url}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                id="description"
                name="description"
                className="form-control form-control-sm"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12 text-end">
              <button type="submit" className="btn btn-success btn-sm me-2">
                Create
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn btn-secondary btn-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
