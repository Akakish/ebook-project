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
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const notify = useNotify();

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await loginUser(form.username, form.password);
      dispatch(login(data));
      notify.success("Welcome back!");
      navigate("/");
    } catch (err) {
      notify.error(err.message)
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
    setTab("login");
    setForm(f => ({ ...f, password: "" }));
  } catch (err) {
    notify.error(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div>
      <div>
        <div>
          {tab === "login" ? "Welcome back" : "Create account"}
        </div>
        <div>
          {tab === "login"
            ? "Please, sign in"
            : "Join Biblion and track your reading journey"}
        </div>

        <div>
          <button onClick={() => { setTab("login"); setError(""); setSuccess(""); }}>
            Sign in
          </button>
          <button onClick={() => { setTab("register"); setError(""); setSuccess(""); }}>
            Register
          </button>
        </div>

        {error && <div>{error}</div>}
        {success && <div>{success}</div>}

        <form onSubmit={tab === "login" ? handleLogin : handleRegister}>
          <div>
            <label>Username</label>
            <input value={form.username} onChange={set("username")} required autoFocus />
          </div>
          {tab === "register" && (
            <div>
              <label>Email</label>
              <input type="email" value={form.email} onChange={set("email")} />
            </div>
          )}
          <div>
            <label>Password</label>
            <input type="password" value={form.password} onChange={set("password")} required />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Please wait…" : tab === "login" ? "Sign in" : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthPage;
