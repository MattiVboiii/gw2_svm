import styles from "../styles/home/Login.module.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import Button from "../components/global/Button";
import { toast } from "react-toastify";
import { useGlobalCounts } from "../context/GlobalCountsContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { refreshCounts } = useGlobalCounts();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  const syncGuestCart = async (token: string) => {
    const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");

    if (guestCart.length > 0) {
      for (const item of guestCart) {
        try {
          await api.post(
            "/cart",
            {
              productId: item.product._id,
              variantId: item.variantId,
              quantity: item.quantity,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        } catch (error) {
          console.error("Error syncing guest cart:", error);
        }
      }
      localStorage.removeItem("guestCart");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter an email and password");
      return;
    }

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

      // Sync guest cart
      await syncGuestCart(data.token);

      // Refresh cart and wishlist counts
      await refreshCounts();

      toast.success("Successfully logged in! Redirecting shortly...");
      setTimeout(() => navigate("/"), 1500);
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        toast.error("User not found");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className={styles.login_container}>
      <img src="/src/assets/signuplogin_cover.jpg" alt="" />
      <form className={styles.login_form} onSubmit={handleSubmit}>
        <h1>Login</h1>
        <p>Enter your details below:</p>
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
        <Button variant="primary" size="large">
          Login
        </Button>
        <p>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
