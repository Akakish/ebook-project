import { useState, useEffect } from "react";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../api/api.js";
import { IconEdit, IconTrash, IconPlus } from "../Icons.jsx";
import useNotify from "../Hooks/useNotify.js";
import useConfirm from "../Hooks/useConfirm.js";
import "../../Styles/CategoryPage.css";
import "../../Styles/Modal.css";

function CategoryModal({ onClose, onSaved, category }) {
  const isEdit = !!category;
  const notify = useNotify();

  const [form, setForm] = useState({
    name:        category?.name        || "",
    description: category?.description || "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await updateCategory(category.id, form);
        notify.success("Category updated!");
      } else {
        await createCategory(form);
        notify.success("Category created!");
      }
      onSaved();
      onClose();
    } catch {
      notify.error("Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>{isEdit ? "Edit Category" : "Add Category"}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="modal-form">
              <div className="modal-form-group">
                <label>Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
              <div className="modal-form-group">
                <label>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="modal-btn modal-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="modal-btn modal-btn-primary" disabled={loading}>
              {loading ? "Saving..." : isEdit ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CategoryPage() {
  const notify  = useNotify();
  const confirm = useConfirm();

  const [categories, setCategories]     = useState([]);
  const [loading, setLoading]           = useState(true);
  const [showModal, setShowModal]       = useState(false);
  const [editCategory, setEditCategory] = useState(null);

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await getCategories();
      setCategories(data);
    } catch {
      notify.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const onEdit = (category) => {
    setEditCategory(category);
    setShowModal(true);
  };

  const onDelete = (category) => {
    confirm(`Delete "${category.name}"?`, async () => {
      try {
        await deleteCategory(category.id);
        await fetchCategories();
        notify.success("Category deleted");
      } catch {
        notify.error("Failed to delete category");
      }
    });
  };

  return (
    <div className="category-page">
      <div className="category-container">

        <div className="category-header">
          <div className="category-header-row">
            <h1>Categories</h1>
            <button
              className="add-category-btn"
              onClick={() => { setEditCategory(null); setShowModal(true); }}
            >
              <IconPlus /> Add Category
            </button>
          </div>
        </div>

        {showModal && (
          <CategoryModal
            category={editCategory}
            onClose={() => { setShowModal(false); setEditCategory(null); }}
            onSaved={fetchCategories}
          />
        )}

        {loading ? (
          <p>Loading...</p>
        ) : categories.length === 0 ? (
          <div className="category-empty">
            <h2>No categories yet</h2>
            <p>Add your first category to get started.</p>
          </div>
        ) : (
          <div className="categories-list">
            {categories.map(cat => (
              <div className="category-item" key={cat.id}>
                <div className="category-item-actions">
                  <button className="cat-btn-edit" onClick={() => onEdit(cat)} title="Edit">
                    <IconEdit />
                  </button>
                  <button className="cat-btn-delete" onClick={() => onDelete(cat)} title="Delete">
                    <IconTrash />
                  </button>
                </div>
                <h3>{cat.name}</h3>
                <p>{cat.description || "No description"}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
