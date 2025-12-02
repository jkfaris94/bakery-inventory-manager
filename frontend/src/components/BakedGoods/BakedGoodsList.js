import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import BakedGoodEditForm from "./BakedGoodEditForm";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "";

export default function BakedGoodsList() {
  const [goods, setGoods] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipeId, setSelectedRecipeId] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", quantity: 0 });
  const navigate = useNavigate();
  const location = useLocation();

  // Utility to safely unwrap API responses wrapped in { data: [...] }
  const unwrap = (json) => {
    if (json && Array.isArray(json.data)) {
      return json.data;
    }
    return [];
  };

  // Fetch baked goods 
  useEffect(() => {
    const abortController = new AbortController();
    const startTime = Date.now();

    fetch(`${API_BASE}/baked_goods`, { signal: abortController.signal })
      .then((res) => {
        const responseTime = Date.now() - startTime;
        
        // If response took more than 3 seconds, show success message that backend is ready
        if (responseTime > 3000) {
          toast.success("Backend is now ready!", { duration: 3000 });
        }
        
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        setGoods(unwrap(json));
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error(err);
          setGoods([]);
          toast.error("Failed to load baked goods. Backend may still be starting up...", {
            duration: 5000,
          });
        } 
      });

    return () => abortController.abort();
  }, [location]);

  // Fetch all recipes for bake dropdown
  useEffect(() => {
    const abortController = new AbortController();

    fetch(`${API_BASE}/recipes`, { signal: abortController.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        setRecipes(unwrap(json));
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error(err);
          setRecipes([]);
          toast.error("Failed to load recipes. Backend may still be starting up...", {
            duration: 5000,
          });
        }
      });
    return () => abortController.abort();
  }, []);

  // POST /recipes/:id/bake
  const handleBakeRecipe = () => {
    if (!selectedRecipeId) {
      toast.error("Please select a recipe to bake");
      return;
    }

    const abortController = new AbortController();

    fetch(`${API_BASE}/recipes/${selectedRecipeId}/bake`, { 
      method: "POST",
      signal: abortController.signal, 
    })
      .then((res) => {
        if (!res.ok){
          return res.json().then((err) => Promise.reject(err));
        }
        return res.json();
      })
      .then(({ data, message }) => {
        toast.success(message || "Baked successfully!");
        return fetch(`${API_BASE}/baked_goods`, { 
          signal: abortController.signal, 
        });
      })
      .then((res) => res.json())
      .then((json) => setGoods(unwrap(json)))
      .catch((error) => {
        if (error.name === "AbortError") return; 
        console.error(error);
        if (error?.missing) {
          toast.error("Not enough ingredients to bake!");
        } else {
          toast.error("Failed to bake");
        }
      });
    return () => abortController.abort();
  };

  const handleEditClick = (g) => {
    setEditingId(g.id);
    setEditForm({ name: g.name, quantity: g.quantity });
  };

  const handleEditChange = ({ target }) => {
    setEditForm((f) => ({ ...f, [target.name]: target.value }));
  };

  const handleEditSubmit = (e) => {
  e.preventDefault();

  const abortController = new AbortController();

  fetch(`${API_BASE}/baked_goods/${editingId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(editForm),
    signal: abortController.signal,
  })
    .then((res) => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(({ data }) => {
      setGoods((prev) => prev.map((g) => (g.id === data.id ? data : g)));
      setEditingId(null);
      toast.success("Baked good updated!");
    })
    .catch((err) => {
      if (err.name !== "AbortError") {
        console.error(err);
        toast.error("Update failed.");
      }
    });

  return () => abortController.abort(); 
};

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">Baked Goods</h2>

      {/* Bake a Recipe */}
      <div className="d-flex justify-content-center mb-4">
        <div className="form-container">
          <div className="input-group">
            <select
              className="form-select"
              value={selectedRecipeId}
              onChange={(e) => setSelectedRecipeId(e.target.value)}
            >
              <option value="">-- Select Recipe --</option>
              {recipes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </select>
            <button
              className="btn btn-success"
              onClick={handleBakeRecipe}
            >
              Bake
            </button>
          </div>
        </div>
      </div>

      {/* Baked Goods List */}
      <div className="d-flex justify-content-center">
        <div className="form-container">
          {goods.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No baked goods found.</p>
            </div>
          ) : (
            <ul className="list-group">
              {goods.map((g) => (
                <li
                  key={g.id}
                  className="list-group-item"
                >
                  {editingId === g.id ? (
                    <div className="w-100">
                      <BakedGoodEditForm
                        formData={editForm}
                        onChange={handleEditChange}
                        onSubmit={handleEditSubmit}
                        onCancel={() => setEditingId(null)}
                      />
                    </div>
                  ) : (
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="flex-grow-1">
                        <span className="fw-bold d-block mb-1">{g.name}</span>
                        <small className="text-muted">Quantity: {g.quantity}</small>
                      </div>
                      <div>
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => handleEditClick(g)}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
