import styles from "../styles/home/Signup.module.css";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import api from "../api";
import Button from "../components/global/Button";
import signuploginCover from "../assets/signuplogin_cover.jpg"; // <-- Import the image

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
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
    if (!firstName) newErrors.push("Please enter a first name");
    if (!lastName) newErrors.push("Please enter a last name");
    if (!email) newErrors.push("Please enter an email");
    if (!password) newErrors.push("Please enter a password");
    if (!phone) newErrors.push("Please enter a phone number");
    if (newErrors.length > 0) {
      setErrors(newErrors);
    } else {
      try {
        const { data } = await api.post<{ token: string }>(
          "/users/register",
          { firstName, lastName, email, password, phone, role: "customer" },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        localStorage.setItem("token", data.token);
        setErrors([
          "Successfully signed up! You will be redirected in 3 seconds.",
        ]);
        setTimeout(() => navigate("/"), 3000);
      } catch (error: any) {
        if (error.response.status === 400) {
          setErrors(["Email already taken"]);
        } else {
          setErrors(["Something went wrong"]);
        }
      }
    }
  };

  return (
    <div className={styles.signup_container}>
      <img src={signuploginCover} alt="" /> {/* Use imported image */}
      <form className={styles.signup_form} onSubmit={handleSubmit}>
        <h1>Create an account</h1>
        <p>Enter your details below:</p>
        {errors.length > 0 && (
          <ul className={styles.error}>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        )}
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First name"
        />
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last name"
        />
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
        <input
          type="text"
          id="phone"
          name="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone number"
        />
        <Button variant="primary" size="large">
          Create an account
        </Button>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};
export default Signup;
