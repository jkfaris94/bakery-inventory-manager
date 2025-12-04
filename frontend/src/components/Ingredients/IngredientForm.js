import React from "react";
import CustomSelect from "../shared/CustomSelect";

export default function IngredientForm({
  formData = { name: "", quantity: "", unit: "" },
  onChange,
  onSubmit,
  onCancel,          
  submitLabel = "Create", 
}) {
  const { name, quantity, unit } = formData;

  const unitOptions = [
    {
      label: "Weight",
      options: [
        { value: "g", label: "g" },
        { value: "kg", label: "kg" },
        { value: "lb", label: "lb" },
        { value: "oz", label: "oz" },
      ],
    },
    {
      label: "Volume",
      options: [
        { value: "ml", label: "ml" },
        { value: "L", label: "L" },
        { value: "cup", label: "cup" },
        { value: "tbsp", label: "tbsp" },
        { value: "tsp", label: "tsp" },
        { value: "fl oz", label: "fl oz" },
      ],
    },
    {
      label: "Count",
      options: [
        { value: "piece", label: "piece" },
        { value: "each", label: "each" },
      ],
    },
  ];

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
        <CustomSelect
          id="unit"
          name="unit"
          value={unit}
          onChange={onChange}
          options={unitOptions}
          placeholder="Select unit"
          required
          className="form-control-sm"
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