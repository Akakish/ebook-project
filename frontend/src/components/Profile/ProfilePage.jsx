import { useState } from "react";
import { IconLogOut, IconTrash, IconEdit } from "../Icons.jsx";
import { useNavigate } from "react-router-dom";
import ProfileModal from "./ProfileModal.jsx";
import { deleteUser } from "../api/api.js";
import useNotify from "../Hooks/useNotify.js";
import useConfirm from "../Hooks/useConfirm.js";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../Redux/authReducer.js";
import "../../Styles/ProfilePage.css";

function ProfilePage() {
  const user = useSelector(s => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notify = useNotify();
  const confirm = useConfirm();
  const [showEdit, setShowEdit] = useState(false);

  const handleDeleteUser = () => {
    confirm("Are you sure you want to delete your account?", async () => {
      try {
        await deleteUser(user.id);
        dispatch(logout());
        navigate("/auth");
      } catch {
        notify.error("Failed to delete account");
      }
    });
  };

  return (
    <div className="profile-page">
      {showEdit && (
        <ProfileModal
          user={user}
          onClose={() => setShowEdit(false)}
          onSaved={() => { setShowEdit(false); notify.success("Profile updated!"); }}
        />
      )}

      <div className="profile-card">
        <div className="profile-avatar">{user?.username?.slice(0, 2).toUpperCase()}</div>
        <div className="profile-info">
          <div className="profile-info-item">
            <span className="profile-info-label">Username</span>
            <span className="profile-info-value">{user?.username}</span>
          </div>
          <div className="profile-info-item">
            <span className="profile-info-label">Email</span>
            <span className="profile-info-value">{user?.email || ""}</span>
          </div>
          <div className="profile-info-item">
            <span className="profile-info-label">Role</span>
            <span className="profile-info-value">{user?.role}</span>
          </div>
        </div>
      </div>

      <div className="profile-buttons">
        <button className="profile-btn" onClick={() => setShowEdit(true)}>
          <IconEdit /> Edit Profile
        </button>
        <button
          className="profile-btn"
          onClick={() => confirm("Are you sure you want to sign out?", () => {
            dispatch(logout());
            navigate("/auth");
          })}
        >
          <IconLogOut /> Sign out
        </button>
        <button className="profile-btn danger" onClick={handleDeleteUser}>
          <IconTrash /> Delete Account
        </button>
      </div>
    </div>
  );
}

export default ProfilePage;
