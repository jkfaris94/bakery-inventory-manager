import IngredientForm from "./IngredientForm";
import { useNavigate } from "react-router-dom";

function IngredientCreate() {
  const navigate = useNavigate();

  const handleAdd = (newIngredient) => {
    // Navigate to /ingredients/:id after creation
    navigate(`/ingredients/${newIngredient.id}`);
  };

  return (
    <div>
      <h2>Create New Ingredient</h2>
      <IngredientForm onAdd={handleAdd} />
    </div>
  );
}

export default IngredientCreate;