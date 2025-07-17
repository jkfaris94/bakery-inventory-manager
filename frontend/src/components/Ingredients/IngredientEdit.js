import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import IngredientForm from "./IngredientForm";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "";

export default function IngredientEdit() {
  const { ingredientId } = useParams();
  const navigate = useNavigate();

  // Initialize formData to empty object for controlled form
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    // Fetch existing ingredient, destructure JSON envelope
    fetch(`${API_BASE}/ingredients/${ingredientId}`, { signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(({ data }) => setFormData(data))
      .catch((err) => {
        if (err.name === "AbortError") return;
        console.error("Failed to load ingredient", err);
        toast.error("Failed to load ingredient");
      });

  return () => {
    controller.abort();
  };
}, [ingredientId]);

  const handleChange = ({ target }) => {
    setFormData((fd) => ({ ...fd, [target.name]: target.value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const abortController = new AbortController();

  try {
    const res = await fetch(`${API_BASE}/ingredients/${ingredientId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: formData }),
      signal: abortController.signal,
    });

    if (!res.ok) {
      const errPayload = await res.json().catch(() => ({}));
      throw new Error(errPayload.error || "Update failed");
    }

    const { data } = await res.json();
    toast.success("Ingredient updated!");
    navigate(`/ingredients/${data.id}`);
  } catch (err) {
    if (err.name === "AbortError") return;
    console.error("Update failed", err);
    toast.error(err.message);
  }

  return () => abortController.abort(); 
};

  const handleCancel = () => navigate(-1);

  // Show loading if formData missing id
  if (!formData.id) return <p>Loading...</p>;

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">Edit Ingredient</h2>
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <IngredientForm
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitLabel="Save"
          />
        </div>
      </div>
    </div>
  );
}
