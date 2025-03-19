import React from "react";
import styles from "../../styles/global/Button.module.css"; // Import global styles

// Define Button Props
interface ButtonProps {
  children?: React.ReactNode; // Button label or content
  variant?: "primary" | "secondary"; // Button type
  size?: "small" | "medium" | "large"; // Size of the button
  onClick?: () => void; // Click handler
  icon?: React.ReactNode; // Optional icon
  iconPosition?: "left" | "right"; // Icon alignment
  className?: string; // Allow additional styles
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "medium",
  onClick,
  icon,
  iconPosition = "left",
  className = "",
}) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${className}`}
      onClick={onClick}
    >
      {/* Icon on the left */}
      {icon && iconPosition === "left" && <span className={styles.icon}>{icon}</span>}
      
      {/* Button Label */}
      {children}
      
      {/* Icon on the right */}
      {icon && iconPosition === "right" && <span className={styles.icon}>{icon}</span>}
    </button>
  );
};

export default Button;
