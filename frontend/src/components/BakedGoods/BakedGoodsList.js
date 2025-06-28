import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import BakedGoodForm from "./BakedGoodForm";
import BakedGoodEditForm from "./BakedGoodEditForm";


function BakedGoodsList() {
  const [goods, setGoods] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", quantity: 0 });

  // GET /baked_goods
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/baked_goods`)
      .then((res) => res.json())
      .then(setGoods)
      .catch(console.error);
  }, []);

    // POST /baked_goods
  const handleAdd = (newGood) => {
    setGoods([...goods, newGood]);
    toast.success(`Baked good "${newGood.name}" added!`);
  };

  // DELETE /baked_goods/:id
  const handleDelete = (id) => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/baked_goods/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setGoods((prev) => prev.filter((g) => g.id !== id));
        toast("Deleted baked good.", { icon: "🗑️" });
      })
      .catch((err) => {
        console.error(err);
        toast.error("Delete failed.");
      });
  };

  // Prepares form for PUT /baked_goods/:id
  const handleEditClick = (g) => {
    setEditingId(g.id);
    setEditForm({ name: g.name, quantity: g.quantity });
  };

   // Controlled input for PUT form
  const handleEditChange = ({ target }) => {
    setEditForm({ ...editForm, [target.name]: target.value });
  };

  // PUT /baked_goods/:id
  const handleEditSubmit = (e) => {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_API_BASE_URL}/baked_goods/${editingId}`, {
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

      <BakedGoodForm onAdd={handleAdd} />

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

export default BakedGoodsList;
