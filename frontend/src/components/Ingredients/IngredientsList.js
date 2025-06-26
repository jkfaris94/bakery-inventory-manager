import { useEffect, useState } from "react";
import IngredientForm from "./IngredientForm";
import IngredientEditForm from "./IngredientEditForm";

function IngredientsList() {
  const [ingredients, setIngredients] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", quantity: 0, unit: "" });

  // Fetch ingredients on mount
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/ingredients`)
      .then((res) => res.json())
      .then(setIngredients)
      .catch(console.error);
  }, []);

  // Add new ingredient to list
  const handleAdd = (newIngredient) => {
    setIngredients([...ingredients, newIngredient]);
  };

  // Start editing
  const handleEditClick = (ingredient) => {
    setEditingId(ingredient.id);
    setEditForm({
      name: ingredient.name,
      quantity: ingredient.quantity,
      unit: ingredient.unit,
    });
  };

  // Handle edit input change
  const handleEditChange = ({ target }) => {
    setEditForm({ ...editForm, [target.name]: target.value });
  };

  // Submit edit
  const handleEditSubmit = (e) => {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_API_BASE_URL}/ingredients/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    })
      .then((res) => res.json())
      .then((updated) => {
        setIngredients((prev) =>
          prev.map((i) => (i.id === updated.id ? updated : i))
        );
        setEditingId(null);
      })
      .catch(console.error);
  };

    // Delete ingredient
  const handleDelete = (id) => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/ingredients/${id}`, {
      method: "DELETE",
    })
      .then(() => setIngredients((prev) => prev.filter((i) => i.id !== id)))
      .catch(console.error);
  };

  return (
    <div>
      <h2>Ingredients</h2>

      <IngredientForm onAdd={handleAdd} />

      <ul>
        {ingredients.map((ing) =>
          editingId === ing.id ? (
            <li key={ing.id}>
              <IngredientEditForm
                formData={editForm}
                onChange={handleEditChange}
                onSubmit={handleEditSubmit}
                onCancel={() => setEditingId(null)}
              />
            </li>
          ) : (
            <li key={ing.id}>
              {ing.name} — {ing.quantity} {ing.unit}
              <button onClick={() => handleEditClick(ing)}>Edit</button>
              <button onClick={() => handleDelete(ing.id)}>Delete</button>
            </li>
          )
        )}
      </ul>
    </div>
  );
}

export default IngredientsList;
