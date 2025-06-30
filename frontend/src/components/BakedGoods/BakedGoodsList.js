import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import BakedGoodForm from "./BakedGoodForm";
import BakedGoodEditForm from "./BakedGoodEditForm";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

export default function BakedGoodsList() {
  const [goods, setGoods] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipeId, setSelectedRecipeId] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", quantity: 0 });
  const location = useLocation();

  // Fetch baked goods when page mounts or location changes
  useEffect(() => {
    fetch(`${API_BASE}/baked_goods`)
      .then((res) => res.json())
      .then(setGoods)
      .catch(console.error);
  }, [location]);

  // Fetch all recipes for bake dropdown
  useEffect(() => {
    fetch(`${API_BASE}/recipes`)
      .then((res) => res.json())
      .then(setRecipes)
      .catch(console.error);
  }, []);

  // Bake selected recipe
  const handleBakeRecipe = () => {
    if (!selectedRecipeId) {
      toast.error("Please select a recipe to bake");
      return;
    }
    fetch(`${API_BASE}/recipes/${selectedRecipeId}/bake`, { method: "POST" })
      .then((res) => {
        if (!res.ok) return res.json().then((data) => Promise.reject(data));
        return res.json();
      })
      .then((data) => {
        toast.success(data.message || "Baked successfully!");
        // Refresh baked goods list
        return fetch(`${API_BASE}/baked_goods`);
      })
      .then((res) => res.json())
      .then(setGoods)
      .catch((error) => {
        if (error?.missing) {
          toast.error("Not enough ingredients to bake!");
        } else {
          toast.error("Failed to bake");
        }
      });
  };

  // POST /baked_goods (manual add)
  const handleAdd = (newGood) => {
    setGoods([...goods, newGood]);
    toast.success(`Baked good "${newGood.name}" added!`);
  };

  // DELETE /baked_goods/:id
  const handleDelete = (id) => {
    fetch(`${API_BASE}/baked_goods/${id}`, { method: "DELETE" })
      .then(() => {
        setGoods((prev) => prev.filter((g) => g.id !== id));
        toast("Deleted baked good.", { icon: "🗑️" });
      })
      .catch((err) => {
        console.error(err);
        toast.error("Delete failed.");
      });
  };

  // Edit setup
  const handleEditClick = (g) => {
    setEditingId(g.id);
    setEditForm({ name: g.name, quantity: g.quantity });
  };

  const handleEditChange = ({ target }) => {
    setEditForm({ ...editForm, [target.name]: target.value });
  };

  // PUT /baked_goods/:id
  const handleEditSubmit = (e) => {
    e.preventDefault();
    fetch(`${API_BASE}/baked_goods/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    })
      .then((res) => res.json())
      .then((updated) => {
        setGoods((prev) =>
          prev.map((g) => (g.id === updated.id ? updated : g))
        );
        setEditingId(null);
        toast.success("Baked good updated!");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Update failed.");
      });
  };

  return (
    <div>
      <h2>Baked Goods</h2>

      {/* Bake a Recipe */}
      <div style={{ marginBottom: "1rem" }}>
        <h3>Bake a Recipe</h3>
        <select
          value={selectedRecipeId}
          onChange={(e) => setSelectedRecipeId(e.target.value)}
          style={{ marginRight: "0.5rem" }}
        >
          <option value="">-- Select Recipe --</option>
          {recipes.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name || `Recipe ${r.id}`}
            </option>
          ))}
        </select>
        <button onClick={handleBakeRecipe}>Bake</button>
      </div>

      {/* Baked Goods List */}
      <ul>
        {goods.map((g) =>
          editingId === g.id ? (
            <li key={g.id}>
              <BakedGoodEditForm
                formData={editForm}
                onChange={handleEditChange}
                onSubmit={handleEditSubmit}
                onCancel={() => setEditingId(null)}
              />
            </li>
          ) : (
            <li key={g.id}>
              {g.name} — {g.quantity}
              <button onClick={() => handleEditClick(g)}>Edit</button>
              <button onClick={() => handleDelete(g.id)}>Delete</button>
            </li>
          )
        )}
      </ul>
    </div>
  );
}

