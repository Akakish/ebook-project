import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getBook, getBookmarks, createBookmark, deleteBookmark, updateBookmark } from "../api/api.js";
import { IconBookmark } from "../Icons.jsx";
import "../../Styles/BookDetailPage.css";
import useNotify from "../Hooks/useNotify.js";
import useConfirm from "../Hooks/useConfirm.js";

export default function BookDetailPage() {
  const { id } = useParams();
  const user = useSelector(s => s.auth.user);
  const dispatch = useDispatch();
  const notify = useNotify();
  const confirm = useConfirm();
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookmark, setBookmark] = useState(null);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    setLoading(true);
    try {
      const { data } = await getBook(id);
      setBook(data);
    } catch (err) {
      setError("Failed to load book details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!book) return <p>Book not found</p>;

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
          <h1>{book.title}</h1>
          <p><strong>Author:</strong> {book.author}</p>
          <p><strong>Genres:</strong> {book.genres}</p>
          <p><strong>Published Date:</strong> {book.published_date}</p>
          <p><strong>Pages:</strong> {book.pages}я</p>
          <p><strong>Price:</strong> ${book.price}</p>
          <p><strong>Category:</strong> {book.category ? book.category.name : "Другое"}</p>
        </div>
      </div>
      <div className="book-detail-description">
        <h2>Description</h2>
        <p>{book.description || "No description available."}</p>
      </div>
    </div>
  );
}