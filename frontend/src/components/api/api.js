import axios from "axios";

export const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/"
});


// Users
export const loginUser = (username, password) =>
  API.post("users/login", { username, password });

export const registerUser = (username, email, password) =>
  API.post("users/register", { username, email, password });

export const getUsers = () =>
  API.get('users/');

export const getUser = (id) =>
  API.get(`users/${id}/`);

export const updateUser = (id, data) =>
  API.patch(`users/${id}/update/`, data);

export const deleteUser = (id) =>
  API.delete(`users/${id}/delete/`);


// Books
export const getBooks = () =>
  API.get(`books/`);

export const getBook = (id) =>
  API.get(`books/${id}/`);

export const createBook = (data) =>
  API.post("books/create/", data);

export const updateBook = (id, data) =>
  API.patch(`books/${id}/update/`, data);

export const deleteBook = (id) =>
  API.delete(`books/${id}/delete/`);


// Bookmarks
export const getBookmarks = () =>
  API.get(`bookmarks/`);

export const getBookmark = (id) =>
  API.get(`bookmarks/${id}`);

export const createBookmark = (userId, bookId, status) =>
  API.post("bookmarks/create/", { user: userId, book: bookId, status: status });

export const updateBookmark = (id, status) =>
  API.patch(`bookmarks/${id}/update/`, { status });

export const deleteBookmark = (id) =>
  API.delete(`bookmarks/${id}/delete/`);

// Categories
export const getCategories = () =>
  API.get(`categories/`);

export const createCategory = (data) =>
  API.post("categories/create/", data);

export const updateCategory = (id, data) =>
  API.patch(`categories/${id}/update/`, data);

export const deleteCategory = (id) =>
  API.delete(`categories/${id}/delete/`);


// Reviews
export const getReviews = () =>
  API.get("reviews/");

export const getReviewsByBook = (bookId) =>
  API.get(`reviews/detail/${bookId}/`);

export const getReviewByUser = (userId, bookId) =>
  API.get(`reviews/detail/${userId}/${bookId}/`);

export const createReview = (data) =>
  API.post("reviews/create/", data);

export const updateReview = (id, data) =>
  API.patch(`reviews/update/${id}/`, data);

export const deleteReview = (id) =>
  API.delete(`reviews/delete/${id}/`);
