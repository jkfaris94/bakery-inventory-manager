import { useState, useEffect } from "react";

function AddRecipeIngredientForm({ recipeId, onAdd }) {
  const [allIngredients, setAllIngredients] = useState([]);
  const [newIngredientId, setNewIngredientId] = useState("");
  const [newQuantity, setNewQuantity] = useState("");

  // GET /ingredients → for dropdown
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/ingredients`)
      .then((res) => res.json())
      .then(setAllIngredients);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${process.env.REACT_APP_API_BASE_URL}/recipes/${recipeId}/ingredients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ingredient_id: Number(newIngredientId),
        quantity: Number(newQuantity),
      }),
    })
      .then((res) => res.json())
      .then((newEntry) => {
        onAdd(newEntry);
        setNewIngredientId("");
        setNewQuantity("");
      })
      .catch(console.error);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4>Add Ingredient</h4>
      <select
        required
        value={newIngredientId}
        onChange={(e) => setNewIngredientId(e.target.value)}
      >
        <option value="">-- Select Ingredient --</option>
        {allIngredients.map((i) => (
          <option key={i.id} value={i.id}>
            {i.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Quantity"
        value={newQuantity}
        onChange={(e) => setNewQuantity(e.target.value)}
        required
      />

      <button type="submit">Add</button>
    </form>
  );
}

export default AddRecipeIngredientForm;
