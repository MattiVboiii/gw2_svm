import Button from "../components/global/Button";
import styles from "../styles/home/Signup.module.css";
import { useState } from "react";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: string[] = [];
    if (!username) newErrors.push("Please enter a username");
    if (!email) newErrors.push("Please enter an email");
    if (!password) newErrors.push("Please enter a password");
    if (newErrors.length > 0) {
      setErrors(newErrors);
    } else {
      setErrors([]);
    }
  };

  return (
    <div className={styles.signup_container}>
      <img src="/src/assets/signuplogin_cover.jpg" alt="" />
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
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
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
        <Button variant="primary" size="large">
          Create an account
        </Button>
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
};
export default Signup;
