import { useState, useEffect } from "react";
import { createBook, updateBook, getCategories } from "../api/api.js";
import "../../Styles/Modal.css";

export default function BooksModal({ onClose, onSaved, book }) {
  const isEdit = !!book;
  const book_id = book?.book_id || null;

  const [form, setForm] = useState({
    title: book?.title || "",
    author: book?.author || "",
    genres: book?.genres || "",
    published_date: book?.published_date || "",
    pages: book?.pages || "",
    price: book?.price || "",
    description: book?.description || "",
    category: book?.category?.id ? String(book.category.id) : "",
  });

  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (key === "category" && !form[key]) return;
        formData.append(key, form[key]);
      });
      if (imageFile) formData.append("cover_image", imageFile);

      if (isEdit) {
        await updateBook(book_id, formData);
      } else {
        await createBook(formData);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content modal-wide">
        <div className="modal-header">
          <h2>{isEdit ? "Edit Book" : "Add Book"}</h2>
        </div>

        <div className="modal-body">
          {error && <div className="modal-error">{error}</div>}

          <div className="modal-form">
            <div className="modal-form-group">
              <label>Cover Image</label>
              <input
                type="file"
                className="modal-file-input"
                onChange={e => setImageFile(e.target.files[0])}
              />
            </div>

            <div className="modal-form-row">
              <div className="modal-form-group">
                <label>Title</label>
                <input name="title" value={form.title} onChange={handleChange} />
              </div>
              <div className="modal-form-group">
                <label>Author</label>
                <input name="author" value={form.author} onChange={handleChange} />
              </div>
            </div>

            <div className="modal-form-row">
              <div className="modal-form-group">
                <label>Genres</label>
                <input name="genres" value={form.genres} onChange={handleChange} />
              </div>
              <div className="modal-form-group">
                <label>Category</label>
                <select name="category" value={form.category} onChange={handleChange}>
                  <option value="">Other</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modal-form-row">
              <div className="modal-form-group">
                <label>Published Date</label>
                <input type="date" name="published_date" value={form.published_date} onChange={handleChange} />
              </div>
              <div className="modal-form-group">
                <label>Pages</label>
                <input type="number" name="pages" value={form.pages} onChange={handleChange} />
              </div>
            </div>

            <div className="modal-form-group">
              <label>Price</label>
              <input type="number" step="0.01" name="price" value={form.price} onChange={handleChange} />
            </div>

            <div className="modal-form-group">
              <label>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="modal-btn modal-btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="modal-btn modal-btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : isEdit ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
