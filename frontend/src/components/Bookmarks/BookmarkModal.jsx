import { useState } from "react";
import { createBookmark } from "../api/api.js";
import useNotify from "../Hooks/useNotify.js";
import "../../Styles/Modal.css";

function BookmarkModal({ userId, books, onClose, onSaved }) {
  const [bookId, setBookId] = useState("");
  const [status, setStatus] = useState("planned");
  const [loading, setLoading] = useState(false);
  const notify = useNotify();

  const handleSubmit = async () => {
    if (!bookId) { notify("Please select a book", "error"); return; }
    setLoading(true);
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
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add Bookmark</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="modal-form">
            <div className="modal-form-group">
              <label>Book</label>
              <select value={bookId} onChange={(e) => setBookId(e.target.value)} required>
                <option value="">Select a book</option>
                {books.map(b => (
                  <option key={b.book_id} value={b.book_id}>{b.title} by {b.author}</option>
                ))}
              </select>
            </div>

            <div className="modal-form-group">
              <label>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                {["planned", "reading", "completed", "dropped", "favorite"].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="modal-btn modal-btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="modal-btn modal-btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookmarkModal;
