import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import IngredientEditForm from "./IngredientEditForm";
import { toast } from "react-hot-toast";

function IngredientEdit() {
  const { ingredientId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    quantity: 0,
    unit: "",
  });

  // Fetch the current ingredient info
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/ingredients/${ingredientId}`)
      .then((res) => res.json())
      .then(setFormData)
      .catch(() => toast.error("Failed to load ingredient"));
  }, [ingredientId]);

  const handleChange = ({ target }) => {
    setFormData({ ...formData, [target.name]: target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_API_BASE_URL}/ingredients/${ingredientId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then(() => {
        toast.success("Ingredient updated!");
        navigate(`/ingredients/${ingredientId}`);
      })
      .catch(() => toast.error("Update failed"));
  };

  return (
    <div>
      <h2>Edit Ingredient</h2>
      <IngredientEditForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
      />
    </div>
  );
}

export default IngredientEdit;
