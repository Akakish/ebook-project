import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateUser } from "../api/api.js";
import { refreshUser } from "../../Redux/authReducer.js";
import "../../Styles/Modal.css";

export default function ProfileModal({ user, onClose, onSaved }) {
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.username.trim()) {
      setError("Username is required");
      return;
    }

    try {
      const response = await updateUser(user.id, form);
      dispatch(refreshUser(response.data));
      onSaved();
    } catch (err) {
      setError(err.message || "An error occurred");
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Profile</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="modal-error">{error}</div>}

            <div className="modal-form">
              <div className="modal-form-group">
                <label>Username</label>
                <input value={form.username} onChange={set("username")} />
              </div>
              <div className="modal-form-group">
                <label>Email</label>
                <input type="email" value={form.email} onChange={set("email")} />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="modal-btn modal-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="modal-btn modal-btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
