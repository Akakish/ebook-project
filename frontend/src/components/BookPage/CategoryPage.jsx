import { useState, useEffect } from "react";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../api/api.js";
import useNotify from "../Hooks/useNotify.js";
import useConfirm from "../Hooks/useConfirm.js";

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
    <div onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)",
               display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}>
      <div style={{ background:"white", padding:24, borderRadius:10, minWidth:300 }}>
        <h2>{isEdit ? "Edit Category" : "Add Category"}</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name</label>
            <input value={form.name}
              onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} required />
          </div>
          <div>
            <label>Description</label>
            <textarea value={form.description}
              onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div>
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit" disabled={loading}>
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

  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
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
    confirm(`Are you sure you want to delete "${category.name}"?`, async () => {
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
    <div>
      <h2>Categories</h2>
      <button onClick={() => { setEditCategory(null); setShowModal(true); }}>
        Add Category
      </button>

      {showModal && (
        <CategoryModal
          category={editCategory}
          onClose={() => { setShowModal(false); setEditCategory(null); }}
          onSaved={fetchCategories}
        />
      )}

      {loading ? <p>Loading...</p> : categories.length === 0 ? (
        <p>No categories yet.</p>
      ) : (
        <table>
          <thead><tr><th>Name</th><th>Description</th><th>Actions</th></tr></thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id}>
                <td>{cat.name}</td>
                <td>{cat.description || "-"}</td>
                <td>
                  <button onClick={() => onEdit(cat)}>Edit</button>
                  <button onClick={() => onDelete(cat)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}