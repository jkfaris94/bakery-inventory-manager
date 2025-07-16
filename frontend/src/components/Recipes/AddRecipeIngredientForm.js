import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function AddRecipeIngredientForm({ recipeId, onAdd }) {
  // Local state for all available ingredients
  const [ingredients, setIngredients] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    const abortController = new AbortController();

    fetch(`${process.env.REACT_APP_API_BASE_URL}/ingredients`, {
      signal: abortController.signal,
    })
      .then((res) => res.json())
      .then((json) => {
        const list = json.data;
        setIngredients(Array.isArray(list) ? list : []);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error(err);
          toast.error("Failed to load ingredients.");
        }
      });

    return () => abortController.abort();
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
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => Promise.reject(err));
        }
        return res.json();
      })
      .then(() => {
        onAdd();
        setSelectedId("");
        setQuantity("");
      })
      .catch((err) => {
        console.error(err);
        toast.error(err?.error || "Failed to add ingredient.");
      });
  };

  return (
    <div className="row justify-content-center mb-4">
      <div className="col-md-6 col-lg-4">
        <form onSubmit={handleSubmit} className="row g-3">
          <h5 className="mb-3 text-center">Add Ingredient to Recipe</h5>

          <div className="col-12">
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

          <div className="col-12">
            <label htmlFor="quantityInput" className="form-label">
              Quantity Needed
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

          <div className="col-12 text-end">
            <button type="submit" className="btn btn-primary btn-sm">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

