export default function IngredientEditForm({ formData, onChange, onSubmit, onCancel }) {
  return (
    <form onSubmit={onSubmit} className="row g-3">
      <div className="col-12">
        <label htmlFor="name" className="form-label">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={onChange}
          className="form-control form-control-sm"
          required
        />
      </div>

      <div className="col-6">
        <label htmlFor="quantity" className="form-label">
          Quantity
        </label>
        <input
          id="quantity"
          name="quantity"
          type="number"
          value={formData.quantity}
          onChange={onChange}
          className="form-control form-control-sm"
          required
        />
      </div>

      <div className="col-6">
        <label htmlFor="unit" className="form-label">
          Unit
        </label>
        <input
          id="unit"
          name="unit"
          type="text"
          value={formData.unit}
          onChange={onChange}
          className="form-control form-control-sm"
          required
        />
      </div>

      <div className="col-12 text-end mt-3">
        <button type="submit" className="btn btn-primary btn-sm me-2">
          Save
        </button>
        <button type="button" onClick={onCancel} className="btn btn-secondary btn-sm">
          Cancel
        </button>
      </div>
    </form>
  );
}
