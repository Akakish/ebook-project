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
      <div className="book-card-content">
        <h3>{book.title}</h3>
        <p>{book.author}</p>
        <div className="book-rating">{book.category.name || "Другое"}</div>
      </div>

      {(onEdit || onDelete) && (
        <div className="card-actions" onClick={(e) => e.stopPropagation()}>
          {onEdit && <button className="btn-edit" onClick={() => onEdit(book)}><IconEdit /></button>}
          {onDelete && <button className="btn-delete" onClick={() => onDelete(book.book_id)}><IconTrash /></button>}
        </div>
      )}
    </div>
  );
}