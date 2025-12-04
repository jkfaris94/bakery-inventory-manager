import React from "react";

export default function IngredientForm({
  formData = { name: "", quantity: "", unit: "" },
  onChange,
  onSubmit,
  onCancel,          
  submitLabel = "Create", 
}) {
  const { name, quantity, unit } = formData;

  return (
    <form onSubmit={onSubmit} className="row g-3">
      <div className="col-12">
        <label htmlFor="name" className="form-label small">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={name}
          onChange={onChange}
          className="form-control form-control-sm"
          required
        />
      </div>

      <div className="col-6">
        <label htmlFor="quantity" className="form-label small">
          Quantity
        </label>
        <input
          id="quantity"
          name="quantity"
          type="number"
          value={quantity}
          onChange={onChange}
          className="form-control form-control-sm"
          required
        />
      </div>

      <div className="col-6">
        <label htmlFor="unit" className="form-label small">
          Unit
        </label>
        <select
          id="unit"
          name="unit"
          value={unit}
          onChange={onChange}
          className="form-control form-control-sm"
          required
        >
          <option value="">Select unit</option>
          <optgroup label="Weight">
            <option value="g">g</option>
            <option value="kg">kg</option>
            <option value="lb">lb</option>
            <option value="oz">oz</option>
          </optgroup>
          <optgroup label="Volume">
            <option value="ml">ml</option>
            <option value="L">L</option>
            <option value="cup">cup</option>
            <option value="tbsp">tbsp</option>
            <option value="tsp">tsp</option>
            <option value="fl oz">fl oz</option>
          </optgroup>
          <optgroup label="Count">
            <option value="piece">piece</option>
            <option value="each">each</option>
          </optgroup>
        </select>
      </div>

      <div className="col-12 text-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary btn-sm me-2"
          >
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary btn-sm">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}