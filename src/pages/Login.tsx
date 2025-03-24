import styles from "../styles/home/Login.module.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import api from "../api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: string[] = [];
    if (!email) newErrors.push("Please enter an email");
    if (!password) newErrors.push("Please enter a password");
    if (newErrors.length > 0) {
      setErrors(newErrors);
    } else {
      try {
        const { data } = await api.post<{ token: string }>(
          "/users/login",
          { email, password },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        localStorage.setItem("token", data.token);
        setErrors([
          "Successfully logged in! You will be redirected in 3 seconds.",
        ]);
        setTimeout(() => window.location.reload(), 3000);
      } catch (error: any) {
        setErrors(["User not found"]);
      }
    }
  };

  return (
    <div className={styles.login_container}>
      <img src="/src/assets/signuplogin_cover.jpg" alt="" />
      <form className={styles.login_form} onSubmit={handleSubmit}>
        <h1>Login</h1>
        <p>Enter your details below:</p>
        {errors.length > 0 && (
          <ul className={styles.error}>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        )}
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Login</button>
        <p>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
};
export default Login;
