import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./components/pages/Home";
import Layout from "./components/shared/Layout";
import IngredientsList from "./components/Ingredients/IngredientsList";
import BakedGoodsList from "./components/BakedGoods/BakedGoodsList";
import RecipesList from "./components/Recipes/RecipesList";
import RecipeView from "./components/Recipes/RecipeView";
import IngredientView from "./components/Ingredients/IngredientView";
import RecipeCreate from "./components/Recipes/RecipesCreate";
import IngredientCreate from "./components/Ingredients/IngredientCreate";
import IngredientEdit from "./components/Ingredients/IngredientEdit";
import { Toaster } from "react-hot-toast";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          
          <Route path="ingredients">
            <Route index element={<IngredientsList />} />
            <Route path="new" element={<IngredientCreate />} />
            <Route path=":ingredientId" element={<IngredientView />} />
            <Route path=":ingredientId/edit" element={<IngredientEdit />} />
          </Route>

          <Route path="recipes">
            <Route index element={<RecipesList />} />
            <Route path="new" element={<RecipeCreate />} />
            <Route path=":id" element={<RecipeView />} />
          </Route>

          <Route path="baked_goods" element={<BakedGoodsList />} />
        </Route>
      </Routes>
      <Toaster position="top-center" />
    </BrowserRouter>
  );
}

export default App;
