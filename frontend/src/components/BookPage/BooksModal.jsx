import { useState, useEffect } from "react";
import { createBook, updateBook, getCategories } from "../api/api.js";

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

  useEffect(() => {
    fetchCategories();
  }, []);

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
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        zIndex: 1000,
      }}>
      <div style={{ background: "white", padding: 24, borderRadius: 10, minWidth: 340 }}>
        <h2>{isEdit ? "Edit Book" : "Add Book"}</h2>

        {error && <div style={{ color: "red" }}>{error}</div>}

        <div><label>Cover Image</label>
          <input type="file" onChange={e => setImageFile(e.target.files[0])} />
        </div>
        <div><label>Title</label>
          <input name="title" value={form.title} onChange={handleChange} />
        </div>
        <div><label>Author</label>
          <input name="author" value={form.author} onChange={handleChange} />
        </div>
        <div><label>Genres</label>
          <input name="genres" value={form.genres} onChange={handleChange} />
        </div>
        <div><label>Published Date</label>
          <input type="date" name="published_date" value={form.published_date} onChange={handleChange} />
        </div>
        <div><label>Pages</label>
          <input type="number" name="pages" value={form.pages} onChange={handleChange} />
        </div>
        <div><label>Price</label>
          <input type="number" step="0.01" name="price" value={form.price} onChange={handleChange} />
        </div>
        <div><label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} />
        </div>
        <div><label>Category</label>
          <select name="category" value={form.category} onChange={handleChange}>
            <option value="">Другое</option>
            {categories.map(cat => (
              <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="button" onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : isEdit ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}