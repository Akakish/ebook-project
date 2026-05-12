import { useState } from "react";
import { useDispatch } from "react-redux";
import "../../Styles/ProfilePage.css";
import { updateUser } from "../api/api.js";
import { refreshUser } from "../../Redux/authReducer.js";


export default function ProfileModal( {user, onClose, onSaved} ) {

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
  }

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        zIndex: 1000,
      }}>
        {error && <div style={{ color: "red" }}>{error}</div>}
       
      <div style={{ background: "white", padding: 24, borderRadius: 10, minWidth: 340 }}>
        <h2>Profile</h2>
        {error && <div style={{ color: "red" }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div>
            <label>Username</label>
            <input value={form.username} onChange={set("username")}  />
          </div>
          <div>
            <label>Email</label>
            <input type="email" value={form.email} onChange={set("email")}  />
          </div>
          <div style={{ marginTop: 20 }}>
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}