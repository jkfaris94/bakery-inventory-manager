import React, { useState, useEffect } from "react";

export default function RecipeForm({
  initialData = { title: "", image_url: "", description: "" },
  onSubmit,
  onCancel,
}) {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = ({ target: { name, value } }) => {
    setFormData((fd) => ({ ...fd, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="d-flex justify-content-center">
      <div className="form-container">
        <form onSubmit={handleSubmit} className="row g-3">
          <h2 className="col-12 text-center mb-3">
            {initialData.id ? "Edit Recipe" : "Create New Recipe"}
          </h2>

        <div className="col-12">
          <label htmlFor="title" className="form-label small">
            Recipe Name
          </label>
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
          <label htmlFor="image_url" className="form-label small">
            Image URL
          </label>
          <input
            id="image_url"
            name="image_url"
            type="url"
            className="form-control form-control-sm"
            value={formData.image_url}
            onChange={handleChange}
          />
        </div>

        <div className="col-12">
          <label htmlFor="description" className="form-label small">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="form-control form-control-sm"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-12 text-end">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary btn-sm me-2"
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary btn-sm">
            {initialData.id ? "Save" : "Create"}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}

