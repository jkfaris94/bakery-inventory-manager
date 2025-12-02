import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import Home from "./components/shared/Home";
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
import NotFound from "./components/shared/NotFound";
import { checkBackendHealth } from "./utils/backendHealth";

function App() {
  useEffect(() => {
    // Check backend health on app load
    const checkHealth = async () => {
      const health = await checkBackendHealth();
      
      if (!health.ready) {
        // Backend is not responding or slow
        toast(
          (t) => (
            <div>
              <strong>Backend Starting Up</strong>
              <br />
              <small>
                The server may take up to 1 minute to wake up and sync with the database. 
                Please wait...
              </small>
            </div>
          ),
          {
            icon: "⏳",
            duration: 10000, // Show for 10 seconds
            style: {
              minWidth: "300px",
            },
          }
        );
      } else if (health.responseTime > 2000) {
        // Backend responded but was slow (cold start)
        toast(
          `Backend is syncing with database. Response took ${Math.round(health.responseTime / 1000)}s. Please wait...`,
          {
            icon: "⏳",
            duration: 8000,
          }
        );
      }
    };

    checkHealth();
  }, []);

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

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Toaster position="top-center" />
    </BrowserRouter>
  );
}

export default App;
