import { useEffect, useState } from "react";

function AddRecipeIngredientForm({ recipeId, onAdd }) {
  const [ingredients, setIngredients] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/ingredients`)
      .then((res) => res.json())
      .then(setIngredients)
      .catch(console.error);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const selected = ingredients.find((i) => i.id === Number(selectedId));
    if (!selected) return;

    fetch(`${process.env.REACT_APP_API_BASE_URL}/recipes/${recipeId}/ingredients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ingredient_id: selected.id,
        quantity_needed: Number(quantity),
        unit: selected.unit,
      }),
    })
      .then((res) => res.json())
      .then((newEntry) => {
        onAdd(); // Re-fetch or refresh recipe
        setSelectedId("");
        setQuantity("");
      })
      .catch(console.error);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4>Add Ingredient to Recipe</h4>

      <label>
        Ingredient:
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          required
        >
          <option value="">-- Select --</option>
          {ingredients.map((i) => (
            <option key={i.id} value={i.id}>
              {i.name} ({i.unit})
            </option>
          ))}
        </select>
      </label>

      <label>
        Quantity:
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
      </label>

      <button type="submit">Add</button>
    </form>
  );
}

export default AddRecipeIngredientForm;
