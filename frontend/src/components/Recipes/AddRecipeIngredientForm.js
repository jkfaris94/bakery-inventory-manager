import { useEffect, useState } from "react";

export default function AddRecipeIngredientForm({ recipeId, onAdd }) {
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

    fetch(
      `${process.env.REACT_APP_API_BASE_URL}/recipes/${recipeId}/ingredients`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredient_id: selected.id,
          quantity_needed: Number(quantity),
          unit: selected.unit,
        }),
      }
    )
      .then((res) => res.json())
      .then(() => {
        onAdd();
        setSelectedId("");
        setQuantity("");
      })
      .catch(console.error);
  };

  return (
    <div className="row justify-content-center mb-4">
      <div className="col-md-6 col-lg-4">
        <form onSubmit={handleSubmit}>
          <h5 className="mb-3 text-center">Add Ingredient to Recipe</h5>

          <div className="mb-3">
            <label htmlFor="ingredientSelect" className="form-label">
              Ingredient
            </label>
            <select
              id="ingredientSelect"
              className="form-select form-select-sm"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              required
            >
              <option value="">-- Select Ingredient --</option>
              {ingredients.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name} ({i.unit})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="quantityInput" className="form-label">
              Quantity
            </label>
            <input
              id="quantityInput"
              type="number"
              className="form-control form-control-sm"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>

          <div className="text-end">
            <button type="submit" className="btn btn-primary btn-sm">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
