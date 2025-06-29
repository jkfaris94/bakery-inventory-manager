import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import IngredientForm from "./IngredientForm";
import IngredientEditForm from "./IngredientEditForm";
import { toast } from "react-hot-toast";

function IngredientsList() {
  const [ingredients, setIngredients] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", quantity: 0, unit: "" });
  const navigate = useNavigate();

  // GET /ingredients
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/ingredients`)
      .then((res) => res.json())
      .then(setIngredients)
      .catch(console.error);
  }, []);

  // POST /ingredients
  const handleAdd = (newIngredient) => {
    setIngredients([...ingredients, newIngredient]);
    toast.success("Ingredient added!");
  };
  

  // Trigger editing mode for PUT /ingredients/:id
  const handleEditClick = (ingredient) => {
    setEditingId(ingredient.id);
    setEditForm({
      name: ingredient.name,
      quantity: ingredient.quantity,
      unit: ingredient.unit,
    });
  };

  // Controlled inputs for edit form
  const handleEditChange = ({ target }) => {
    setEditForm({ ...editForm, [target.name]: target.value });
  };

  // PUT /ingredients/:id
  const handleEditSubmit = (e) => {
  e.preventDefault();
  fetch(`${process.env.REACT_APP_API_BASE_URL}/ingredients/${editingId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(editForm),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Update failed");
      return res.json();
    })
    .then((updated) => {
      setIngredients((prev) =>
        prev.map((i) => (i.id === updated.id ? updated : i))
      );
      toast.success("Ingredient updated!");
      setEditingId(null);
    })
    .catch((err) => {
      console.error(err);
      toast.error("Failed to update ingredient.");
    });
};

    // DELETE /ingredients/:id
const handleDelete = (id) => {
  fetch(`${process.env.REACT_APP_API_BASE_URL}/ingredients/${id}`, {
    method: "DELETE",
  })
    .then(() => {
      setIngredients((prev) => prev.filter((i) => i.id !== id));
      toast("Ingredient deleted.", { icon: "🗑️" });
    })
    .catch((err) => {
      console.error(err);
      toast.error("Failed to delete ingredient.");
    });
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
              <button onClick={() => navigate(`/ingredients/${ing.id}`)}>View</button>
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
