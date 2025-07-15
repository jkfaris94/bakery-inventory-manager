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
        <input
          id="unit"
          name="unit"
          type="text"
          value={unit}
          onChange={onChange}
          className="form-control form-control-sm"
          required
        />
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