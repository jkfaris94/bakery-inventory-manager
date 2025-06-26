import { useState } from "react";

function IngredientForm({ onAdd }) {
  const [formData, setFormData] = useState({
    name: "",
    quantity: 0,
    unit: "",
  });

  const handleChange = ({ target }) => {
    setFormData({ ...formData, [target.name]: target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_API_BASE_URL}/ingredients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((created) => {
        onAdd(created);         // update UI
        setFormData({ name: "", quantity: 0, unit: "" }); // reset
      })
      .catch(console.error);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Ingredient</h3>
      <input
        type="text"
        name="name"
        value={formData.name}
        placeholder="Name"
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="quantity"
        value={formData.quantity}
        placeholder="Quantity"
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="unit"
        value={formData.unit}
        placeholder="Unit"
        onChange={handleChange}
        required
      />
      <button type="submit">Add</button>
    </form>
  );
}

export default IngredientForm;
