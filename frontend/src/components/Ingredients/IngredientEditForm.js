function IngredientEditForm({ formData, onChange, onSubmit, onCancel }) {
  return (
    <form onSubmit={onSubmit} style={{ display: "inline" }} >
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={onChange}
        required
      />
      <input
        type="number"
        name="quantity"
        value={formData.quantity}
        onChange={onChange}
        required
      />
      <input
        type="text"
        name="unit"
        value={formData.unit}
        onChange={onChange}
        required
      />
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
}

export default IngredientEditForm;
