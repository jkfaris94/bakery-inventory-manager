import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import IngredientForm from "./IngredientForm";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

export default function IngredientCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    unit: "",
  });

  const handleChange = ({ target: { name, value } }) => {
    setFormData((fd) => ({
      ...fd,
      // keep quantity as a number
      [name]: name === "quantity" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${API_BASE}/ingredients`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // wrap under `data` to match backend
          body: JSON.stringify({ data: formData }),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw err;
      }
      const { data } = await res.json();
      toast.success("Ingredient created!");
      // go to its detail page
      navigate(`/ingredients/${data.id}`);
    } catch (err) {
      console.error("Failed to create ingredient", err);
      toast.error(err.error || "Failed to create ingredient");
    }
  };

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">Create New Ingredient</h2>
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <IngredientForm
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}