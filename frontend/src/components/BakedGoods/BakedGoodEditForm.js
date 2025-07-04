import React from "react";

export default function BakedGoodEditForm({ formData, onChange, onSubmit, onCancel }) {
  return (
    <form onSubmit={onSubmit} className="row g-2 align-items-center">
      <div className="col-5">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={onChange}
          className="form-control form-control-sm"
          placeholder="Name"
          required
        />
      </div>
      <div className="col-3">
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={onChange}
          className="form-control form-control-sm"
          placeholder="Qty"
          required
        />
      </div>
      <div className="col-4 text-end">
        <button type="submit" className="btn btn-primary btn-sm me-1">
          Save
        </button>
        <button type="button" onClick={onCancel} className="btn btn-secondary btn-sm">
          Cancel
        </button>
      </div>
    </form>
  );
}
