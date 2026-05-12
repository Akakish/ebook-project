import { useNavigate, NavLink } from 'react-router-dom'
import { IconBook, IconBookmark, IconStar, IconUser, IconLogOut } from "./Icons.jsx";
import "../Styles/Header.css";
import useConfirm from './Hooks/useConfirm.js';
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../Redux/authReducer.js";


export default function Header() {
  const user = useSelector(s => s.auth.user);
  const dispatch = useDispatch();

  const navigate = useNavigate()
  const confirm = useConfirm()

  const navItems = [
    { to: "/", label: "Books", icon: <IconBook /> },
    { to: "/bookmarks", label: "My Shelf", icon: <IconBookmark /> },
  ]

  return (
    <header>
      <div>
        <div onClick={() => navigate("/")}>
          <IconBook /> Biblion
        </div>

        {user && (
          <nav>
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => isActive ? 'nav-btn active' : 'nav-btn'}
              >
                {item.icon} {item.label}
              </NavLink>
            ))}

            {user.role === "admin" && (
              <NavLink
                to="/categories"
                className={({ isActive }) => isActive ? 'nav-btn active' : 'nav-btn'}
              >
                <IconStar /> Categories
              </NavLink>
            )}
            
          </nav>
        )}

        <div>
          {user ? (
            <>
              <button onClick={() => navigate("/profile")}>
                <IconUser /> {user.username}
              </button>
                <button onClick={() => { confirm("Are you sure you want to sign out?", () => { dispatch(logout()); navigate("/auth"); }); }}>
                <IconLogOut /> Sign out
              </button>
            </>
          ) : (
            <button onClick={() => navigate("/auth")}>Sign in</button>
          )}
        </div>
      </div>
    </header>
  )
}