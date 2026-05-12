import { useNavigate } from "react-router-dom";
import { IconEdit, IconTrash } from "../Icons.jsx";

export default function BookCard({ book, onDelete, onEdit }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/book/${book.book_id}`);
  };

  return (
    <div className="book-card" onClick={handleCardClick} style={{ cursor: "pointer" }}>
      <img
        className="book-cover"
        src={book.cover_image || "https://img.wattpad.com/cover/387707177-512-k61057.jpg"}
        alt={book.title}
        onError={(e) => { e.target.src = "https://img.wattpad.com/cover/387707177-512-k61057.jpg"; }}
      />
      <h3>{book.title}</h3>
      <p>{book.author}</p>
      <p>{book.genres}</p>

      {(onEdit || onDelete) && (
        <div onClick={(e) => e.stopPropagation()}>
          {onEdit && <button className="btn" onClick={() => onEdit(book)}><IconEdit /></button>}
          {onDelete && <button className="btn" onClick={() => onDelete(book.book_id)}><IconTrash /></button>}
        </div>
      )}
    </div>
  );
}