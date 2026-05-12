import { useState, useEffect } from "react";
import BooksModal from "./BooksModal";
import "../../Styles/BooksPage.css";
import { getBooks, deleteBook, getCategories } from "../api/api.js";
import Catalog from "./Catalog.jsx";
import useNotify from "../Hooks/useNotify.js";
import useConfirm from "../Hooks/useConfirm.js";
import { useSelector } from "react-redux";


export default function BooksPage() {
  const user = useSelector(s => s.auth.user);
  const notify = useNotify();
  const confirm = useConfirm();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editBook, setEditBook] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
  fetchBooks();
  getCategories().then(({ data }) => setCategories(data));
}, []);

  const filteredBooks = selectedCategory
    ? books.filter(b => b.category?.id === Number(selectedCategory))
    : books;

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const { data } = await getBooks();
      setBooks(data);
    } catch (err) {
      notify.error("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = (bookId) => {
    confirm("Are you sure you want to delete this book?", async () => {
      try {
        await deleteBook(bookId);
        await fetchBooks();
        notify.success("Book deleted successfully!");
      } catch {
        notify.error("Failed to delete book");
      }
    });
  };

  const onEdit = (book) => {
    setEditBook(book);
    setShowModal(true);
  };

  return (
    <>
      <h2>Каталог книг</h2>

      <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
        <option value="">All categories</option>
          {categories.map(cat => (
        <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>

      {user?.role === "admin" && (
        <div className="AdminPanel">
          <button onClick={() => { setShowModal(true); setEditBook(null); }}>
            Добавить книгу
          </button>
        </div>
      )}

      
      {showModal && (
        <BooksModal
          onClose={() => { setShowModal(false); setEditBook(null); }}
          book={editBook}
          onSaved={() => {
            fetchBooks();
            notify.success(editBook ? "Book updated!" : "Book added!");
          }}
        />
      )}

      {loading && <p>Loading...</p>}
      {!loading && (
        <Catalog
          books={filteredBooks}
          onEdit={user?.role === "admin" ? onEdit : null}
          onDelete={user?.role === "admin" ? onDelete : null}
        />
      )}
    </>
  );
}