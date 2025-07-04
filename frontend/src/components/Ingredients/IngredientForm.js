import { useState } from "react";
import { toast } from "react-hot-toast";

export default function IngredientForm({ onAdd }) {
  const [formData, setFormData] = useState({ name: "", quantity: "", unit: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((fd) => ({ ...fd, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_API_BASE_URL}/ingredients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        quantity: Number(formData.quantity),
        unit: formData.unit,
      }),
    })
      .then((res) => {
        if (!res.ok) return res.json().then((err) => Promise.reject(err));
        return res.json();
      })
      .then((created) => {
        toast.success("Ingredient created!");
        onAdd(created);
      })
      .catch((err) => {
        toast.error(err.error || "Failed to create ingredient");
      });
  };

  return (
    <form onSubmit={handleSubmit} className="row g-3">
      <div className="col-12">
        <label htmlFor="name" className="form-label">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          className="form-control form-control-sm"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="col-6">
        <label htmlFor="quantity" className="form-label">
          Quantity
        </label>
        <input
          id="quantity"
          name="quantity"
          type="number"
          className="form-control form-control-sm"
          value={formData.quantity}
          onChange={handleChange}
          required
        />
      </div>

      <div className="col-6">
        <label htmlFor="unit" className="form-label">
          Unit
        </label>
        <input
          id="unit"
          name="unit"
          type="text"
          className="form-control form-control-sm"
          value={formData.unit}
          onChange={handleChange}
          required
        />
      </div>

      <div className="col-12 text-end">
        <button type="submit" className="btn btn-primary btn-sm">
          Create
        </button>
      </div>
    </form>
  );
}
