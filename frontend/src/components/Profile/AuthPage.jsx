import { useState } from "react";
import "../../Styles/AuthPage.css";
import { useNavigate } from "react-router-dom";
import useNotify from "../Hooks/useNotify.js";
import { registerUser, loginUser } from "../api/api.js";
import { login } from "../../Redux/authReducer.js";
import { useDispatch } from "react-redux";

function AuthPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notify   = useNotify();

  const [tab, setTab]       = useState("login");
  const [form, setForm]     = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const switchTab = (t) => { setTab(t); setForm(f => ({ ...f, password: "" })); };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await loginUser(form.username, form.password);
      dispatch(login(data));
      notify.success("Welcome back!");
      navigate("/");
    } catch (err) {
      notify.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser(form.username, form.email, form.password);
      notify.success("Account created! Please sign in.");
      switchTab("login");
    } catch (err) {
      notify.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">

        <div className="auth-header">
          <h2>{tab === "login" ? "Please sign in" : "Create account"}</h2>
          <p className="auth-subtitle">
            {tab === "login"
              ? "Welcome back! Please enter your credentials."
              : "Join Biblion and track your reading journey."}
          </p>
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab${tab === "login" ? " auth-tab--active" : ""}`}
            onClick={() => switchTab("login")}
          >
            Sign in
          </button>
          <button
            className={`auth-tab${tab === "register" ? " auth-tab--active" : ""}`}
            onClick={() => switchTab("register")}
          >
            Register
          </button>
        </div>

        <form className="auth-form" onSubmit={tab === "login" ? handleLogin : handleRegister}>
          <div className="form-group">
            <label>Username</label>
            <input value={form.username} onChange={set("username")} required autoFocus />
          </div>

          {tab === "register" && (
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={form.email} onChange={set("email")} />
            </div>
          )}

          <div className="form-group">
            <label>Password</label>
            <input type="password" value={form.password} onChange={set("password")} required />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Please wait…" : tab === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="auth-footer">
          {tab === "login" ? "Don't have an account? " : "Already have an account? "}
          <a onClick={() => switchTab(tab === "login" ? "register" : "login")}>
            {tab === "login" ? "Register" : "Sign in"}
          </a>
        </p>

      </div>
    </div>
  );
}

export default AuthPage;
