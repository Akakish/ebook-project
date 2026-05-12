import "./Styles/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./Redux/store.js";
import { useSelector } from "react-redux";

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

import BooksPage from "./components/BookPage/BooksPage.jsx";
import BookDetailPage from "./components/BookPage/BookDetailPage.jsx";
import AuthPage from "./components/Profile/AuthPage.jsx";
import BookmarksPage from "./components/Bookmarks/BookmarkPage.jsx";
import ProfilePage from "./components/Profile/ProfilePage.jsx";
import CategoryPage from "./components/BookPage/CategoryPage.jsx";

import Notification from "./components/Notification.jsx";
import ConfirmModal from "./components/ConfirmModal.jsx";


function ProtectedRoute({ children }) {
  const user = useSelector(s => s.auth.user);
  return user ? children : <Navigate to="/auth" replace />;
}

function AdminRoute({ children }) {
  const user = useSelector(s => s.auth.user);
  if (!user) return <Navigate to="/auth" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <>
      <Header />
      <Notification />
      <ConfirmModal />
      <Routes>
        <Route path="/" element={<BooksPage />} />
        <Route path="/book/:id" element={<BookDetailPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/bookmarks" element={<ProtectedRoute><BookmarksPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/categories" element={<AdminRoute><CategoryPage /></AdminRoute>} />
      </Routes>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
}