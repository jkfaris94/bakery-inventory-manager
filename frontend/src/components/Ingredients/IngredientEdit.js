import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import IngredientEditForm from "./IngredientEditForm";

export default function IngredientEdit() {
  const { ingredientId } = useParams();
  const navigate = useNavigate();

  // Initialize formData to empty object for controlled form
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // Fetch existing ingredient, destructure JSON envelope
    fetch(`${process.env.REACT_APP_API_BASE_URL}/ingredients/${ingredientId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(({ data }) => setFormData(data))
      .catch((err) => {
        console.error("Failed to load ingredient", err);
        toast.error("Failed to load ingredient");
      });
  }, [ingredientId]);

  const handleChange = ({ target }) => {
    setFormData((fd) => ({ ...fd, [target.name]: target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_API_BASE_URL}/ingredients/${ingredientId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: formData }),
    })
      .then((res) => {
        if (!res.ok) return res.json().then((err) => Promise.reject(err));
        return res.json();
      })
      .then(({ data }) => {
        toast.success("Ingredient updated!");
        navigate(`/ingredients/${ingredientId}`);
      })
      .catch((err) => {
        console.error("Update failed", err);
        toast.error(err.error || "Update failed");
      });
  };

  const handleCancel = () => navigate(-1);

  // Show loading if formData missing id
  if (!formData.id) return <p>Loading...</p>;

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">Edit Ingredient</h2>
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <IngredientEditForm
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
}
