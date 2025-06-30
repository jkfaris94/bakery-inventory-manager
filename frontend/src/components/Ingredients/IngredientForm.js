import { useState } from "react";
import { toast } from "react-hot-toast";

function IngredientForm({ onAdd }) {
  const [formData, setFormData] = useState({
    name: "",
    quantity: 0,
    unit: "",
  });

  const handleChange = ({ target }) => {
    setFormData({ ...formData, [target.name]: target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/ingredients`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      // 1) Duplicate name
      if (res.status === 409) {
        const errData = await res.json();
        toast.error(
          errData.error ||
            "That ingredient name already exists. To make changes, please edit the ingredient."
        );
        return; 
      }

      // 2) Any other error
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to add ingredient");
      }

      // 3) Success
      const created = await res.json();
      toast.success(`Added “${created.name}”`);
      onAdd(created);
      setFormData({ name: "", quantity: 0, unit: "" });
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong");
    }
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
