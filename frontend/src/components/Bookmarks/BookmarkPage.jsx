import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IconPlus, IconTrash } from "../Icons.jsx";
import BookmarkModal from "./BookmarkModal.jsx";
import { getBookmarks, getBooks, deleteBookmark, updateBookmark } from "../api/api.js";
import useNotify from "../Hooks/useNotify.js";
import useConfirm from "../Hooks/useConfirm.js";
import "../../Styles/BookmarkPage.css";

import { useSelector } from "react-redux";



function BookmarksPage() {
  const user = useSelector(s => s.auth.user);

  const navigate = useNavigate();
  const notify = useNotify();
  const confirm = useConfirm();

  const [bookmarks, setBookmarks] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!user) { navigate("/auth"); return; }
    Promise.all([getBookmarks(), getBooks()])
      .then(([bmsRes, bksRes]) => {
        setBookmarks(bmsRes.data.filter(b => b.user === user.id));
        setBooks(bksRes.data);
      })
      .catch(() => notify.error("Failed to load bookmarks"))
      .finally(() => setLoading(false));
  }, [user]);

  const refetch = async () => {
    const { data } = await getBookmarks();
    setBookmarks(data.filter(b => b.user === user.id));
  };

  const handleDelete = (id) => {
    confirm("Remove this bookmark?", async () => {
      try {
        await deleteBookmark(id);
        await refetch();
        notify.success("Bookmark removed");
      } catch {
        notify.error("Failed to remove bookmark");
      }
    });
  };

  const handleStatusChange = async (bm, newStatus) => {
    try {
      await updateBookmark(bm.Bookmark_id, newStatus);
      await refetch();
      notify.success("Status updated");
    } catch {
      notify.error("Failed to update status");
    }
  };

  const getBook = (id) => books.find(b => b.book_id === id);

  return (
    <div>
      <div>
        <h1>My Shelf</h1>
        <p>{bookmarks.length} bookmarked books</p>
        <button onClick={() => setShowModal(true)}>
          <IconPlus /> Add bookmark
        </button>
      </div>

      {loading ? <div>Loading…</div> : bookmarks.length === 0 ? (
        <p>Your shelf is empty. Start bookmarking books!</p>
      ) : (
        <div>
          {bookmarks.map(bm => {
            const book = getBook(bm.book);
            return (
              <div className="bookmark-item" key={bm.Bookmark_id}>
                <div>{book?.title || "Unknown"}</div>
                <div>{book?.author}</div>
                <select value={bm.status} onChange={(e) => handleStatusChange(bm, e.target.value)}>
                  {["read","planned","reading","completed","dropped","favorite"].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button onClick={() => handleDelete(bm.Bookmark_id)}><IconTrash /></button>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <BookmarkModal
          userId={user.id}
          books={books}
          onClose={() => setShowModal(false)}
          onSaved={() => { refetch();}}
        />
      )}
    </div>
  );
}

export default BookmarksPage;