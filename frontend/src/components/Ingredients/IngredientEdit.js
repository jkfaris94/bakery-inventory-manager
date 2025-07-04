import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import IngredientEditForm from "./IngredientEditForm";

export default function IngredientEdit() {
  const { ingredientId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/ingredients/${ingredientId}`)
      .then((res) => res.json())
      .then((data) => setFormData(data))
      .catch(() => toast.error("Failed to load ingredient"));
  }, [ingredientId]);

  const handleChange = ({ target }) => {
    setFormData((fd) => ({ ...fd, [target.name]: target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_API_BASE_URL}/ingredients/${ingredientId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) return res.json().then((err) => Promise.reject(err));
        return res.json();
      })
      .then(() => {
        toast.success("Ingredient updated!");
        navigate(`/ingredients/${ingredientId}`);
      })
      .catch(() => toast.error("Update failed"));
  };

  const handleCancel = () => navigate(-1);

  if (!formData) return <p>Loading...</p>;

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
