import { useState } from "react";
import { createBookmark } from "../api/api.js";
import useNotify from "../Hooks/useNotify.js";

function BookmarkModal({ userId, books, onClose, onSaved }) {
  const [bookId, setBookId] = useState("");
  const [status, setStatus] = useState("planned");
  const [loading, setLoading] = useState(false);
  const notify = useNotify();

  const handleSubmit = async () => {
    if (!bookId) { notify("Please select a book", "error"); return; }
    setLoading(true)
    try {
      await createBookmark(userId, bookId, status);
      onSaved();
      onClose();
      notify.success("Bookmark added successfully!");
    } catch (err) {
      notify(err.message, "error");
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
        <h2>Add Bookmark</h2>

        <div>
          <label>Book</label>
          <select value={bookId} onChange={(e) => setBookId(e.target.value)} required>
            <option value="">Select a book</option>
            {books.map(b => (
              <option key={b.book_id} value={b.book_id}>{b.title} by {b.author}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            {["planned","reading","completed","dropped","favorite"].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div style={{ marginTop: 20 }}>
          <button type="button" onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookmarkModal;
