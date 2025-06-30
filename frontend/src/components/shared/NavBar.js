import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
      <NavLink
        to="/"
        end
        style={({ isActive }) => ({
          marginRight: "1rem",
          textDecoration: isActive ? "underline" : "none",
        })}
      >
        Home
      </NavLink>

      <NavLink
        to="/recipes"
        style={({ isActive }) => ({
          marginRight: "1rem",
          textDecoration: isActive ? "underline" : "none",
        })}
      >
        Recipes
      </NavLink>
      <NavLink
        to="/recipes/new"
        style={({ isActive }) => ({
          marginRight: "1rem",
          textDecoration: isActive ? "underline" : "none",
        })}
      >
        New Recipe
      </NavLink>

      <NavLink
        to="/ingredients"
        style={({ isActive }) => ({
          marginRight: "1rem",
          textDecoration: isActive ? "underline" : "none",
        })}
      >
        Ingredients
      </NavLink>
      <NavLink
        to="/ingredients/new"
        style={({ isActive }) => ({
          marginRight: "1rem",
          textDecoration: isActive ? "underline" : "none",
        })}
      >
        New Ingredient
      </NavLink>

      <NavLink
        to="/baked_goods"
        style={({ isActive }) => ({
          marginRight: "1rem",
          textDecoration: isActive ? "underline" : "none",
        })}
      >
        Baked Goods
      </NavLink>
    </nav>
  );
}
