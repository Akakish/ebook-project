import BookCard from "./BookCard.jsx";

export default function Catalog({ books, onDelete, onEdit }) {
  return (
    <div className="books-container">
      <div className="books-grid">
        {books.map(book => (
          <BookCard key={book.book_id} book={book} onDelete={onDelete} onEdit={onEdit} />
        ))}
      </div>

    </div>
  );
}