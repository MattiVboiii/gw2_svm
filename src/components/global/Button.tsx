import React from "react";
import styles from "../../styles/global/Button.module.css"; // Import CSS module for styling

// Define the prop types for the Button component
interface ButtonProps {
  children: React.ReactNode; // Button label or content inside
  variant?: "primary" | "secondary"; // Button style variation
  size?: "small" | "medium" | "large"; // Button size options
  onClick?: () => void; // Function triggered when button is clicked
  icon?: React.ReactNode; // Optional icon inside the button
  iconPosition?: "left" | "right"; // Position of the icon
}

// Functional Button Component
const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary", // Default to "primary" style
  size = "medium", // Default to "medium" size
  onClick,
  icon,
  iconPosition = "left", // Default icon position is left
}) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${styles[size]}`} // Dynamic styling based on props
      onClick={onClick} // Attach click event handler
    >
      {/* Render icon on the left */}
      {icon && iconPosition === "left" && <span className={styles.icon}>{icon}</span>} 
      
      {/* Render button label */}
      {children}

      {/* Render icon on the right */}
      {icon && iconPosition === "right" && <span className={styles.icon}>{icon}</span>}
    </button>
  );
};

export default Button; // Export component for use in other parts of the project
