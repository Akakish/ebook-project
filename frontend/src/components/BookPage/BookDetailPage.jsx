import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getBook, getBookmarks, createBookmark, deleteBookmark } from "../api/api.js";
import { IconBookmark } from "../Icons.jsx";
import "../../Styles/BookDetailPage.css";
import useNotify from "../Hooks/useNotify.js";

export default function BookDetailPage() {
  const { id } = useParams();
  const user = useSelector(s => s.auth.user);
  const notify = useNotify();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookmark, setBookmark] = useState(null);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  useEffect(() => {
    fetchBook();
    if (user) checkBookmark();
  }, [id, user]);

  const fetchBook = async () => {
    setLoading(true);
    try {
      const { data } = await getBook(id);
      setBook(data);
    } catch {
      setError("Failed to load book details");
    } finally {
      setLoading(false);
    }
  };

  const checkBookmark = async () => {
    try {
      const { data } = await getBookmarks();
      const found = data.find(b => b.book === id && b.user === user.id);
      setBookmark(found || null);
    } catch {
      console.error("Failed to check bookmark");
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      notify.error("Please log in first");
      return;
    }
    setBookmarkLoading(true);
    try {
      if (bookmark) {
        await deleteBookmark(bookmark.Bookmark_id);
        setBookmark(null);
        notify.success("Removed from bookmarks");
      } else {
        await createBookmark(user.id, id, "reading");
        await checkBookmark();
        notify.success("Added to bookmarks!");
      }
    } catch {
      notify.error("Failed to update bookmark");
    } finally {
      setBookmarkLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error)   return <p>{error}</p>;
  if (!book)   return <p>Book not found</p>;

  return (
    <div className="book-detail">
      <div className="book-detail-header">
        <img
          className="book-detail-cover"
          src={book.cover_image || "https://img.wattpad.com/cover/387707177-512-k61057.jpg"}
          alt={book.title}
          onError={(e) => { e.target.src = "https://img.wattpad.com/cover/387707177-512-k61057.jpg"; }}
        />

        <div className="book-detail-info">
          <div className="book-detail-title-row">
            <h1>{book.title}</h1>
            <button
              className={`bookmark-btn${bookmark ? " bookmark-btn--active" : ""}`}
              onClick={handleBookmark}
              disabled={bookmarkLoading}
              title={bookmark ? "Remove from bookmarks" : "Add to bookmarks"}
              aria-label={bookmark ? "Remove from bookmarks" : "Add to bookmarks"}
            >
              <IconBookmark filled={!!bookmark} size={22} />
            </button>
          </div>

          <p><strong>Author:</strong> {book.author}</p>
          <p><strong>Genres:</strong> {book.genres}</p>
          <p><strong>Published Date:</strong> {book.published_date}</p>
          <p><strong>Pages:</strong> {book.pages}</p>
          <p><strong>Price:</strong> ${book.price}</p>
          <p><strong>Category:</strong> {book.category ? book.category.name : "Other"}</p>
        </div>
      </div>

      <div className="book-detail-description">
        <h2>Description</h2>
        <p>{book.description || "No description available."}</p>
      </div>
    </div>
  );
}
