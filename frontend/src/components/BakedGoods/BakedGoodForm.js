//nolonger used, can DELETE before deployment if not needed

import { useState } from "react";

function BakedGoodForm({ onAdd }) {
  const [formData, setFormData] = useState({
    name: "",
    quantity: 0,
  });

  const handleChange = ({ target }) => {
    setFormData({ ...formData, [target.name]: target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_API_BASE_URL}/baked_goods`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((created) => {
        onAdd(created);
        setFormData({ name: "", quantity: 0 });
      })
      .catch(console.error);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Baked Good</h3>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
        required
      />
      <input
        type="number"
        name="quantity"
        value={formData.quantity}
        onChange={handleChange}
        placeholder="Quantity"
        required
      />
      <button type="submit">Add</button>
    </form>
  );
}

export default BakedGoodForm;