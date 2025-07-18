import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import RecipeForm from "./RecipeForm";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "";

export default function RecipeCreate() {
  const navigate = useNavigate();

  const handleCreate = async (data) => {
  const abortController = new AbortController();

  try {
    const response = await fetch(`${API_BASE}/recipes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data }),
      signal: abortController.signal,
    });

    if (!response.ok) throw await response.json();

    const { data: newRecipe } = await response.json();
    toast.success("Recipe created!");
    navigate(`/recipes/${newRecipe.id}`);
  } catch (err) {
    if (err.name === "AbortError") return;
    console.error("Failed to create recipe", err);
    toast.error(err.error || "Failed to create recipe");
  }

  return () => abortController.abort(); 
};

  return (
    <RecipeForm
      initialData={{ title: "", image_url: "", description: "" }}
      onSubmit={handleCreate}
      onCancel={() => navigate(-1)}
    />
  );
}