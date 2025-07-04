import IngredientForm from "./IngredientForm";
import { useNavigate } from "react-router-dom";

export default function IngredientCreate() {
  const navigate = useNavigate();

  const handleAdd = (newIngredient) => {
    navigate(`/ingredients/${newIngredient.id}`);
  };

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">Create New Ingredient</h2>
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <IngredientForm onAdd={handleAdd} />
        </div>
      </div>
    </div>
  );
}