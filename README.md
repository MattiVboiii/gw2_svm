# Headless Clothing Site

Made by Mattias, Svitlana & Viktoriia

# 🛠️ Reusable Button Component

This document explains how to use the **global Button Component** in your project. The component provides a **consistent, reusable button style** with various customization options.

# How to Use the Button Component

Instead of using regular <button> elements, use the new Button component.

Basic Usage

import Button from "../global/Button"; // Adjust the path if necessary

<Button onClick={() => console.log("Button clicked!")}> Click Me </Button>

Example: Add to Cart Button in ExploreProducts.tsx
Replace the old button with the new Button component.

❌ Before (Old Button)
<button className={styles.add_to_cart}>
<IoCartOutline className={styles.cart_icon} />
<span>Add to Cart</span>
</button>

✅ After (New Button Component)
import Button from "../global/Button"; // Import the new Button component

<Button
variant="primary"
size="medium"
icon={<IoCartOutline />}
onClick={() => console.log("Added to cart!")}

> Add to Cart
> </Button>

Now, the button follows global styles and can be used everywhere!

# Button Variants & Sizes

The button supports different styles (variants), sizes, and icons.

🔴 Primary Button (Red)

<Button variant="primary" size="large" onClick={() => alert("Primary Button Clicked!")}>
Buy Now
</Button>
⚪ Secondary Button (White with Black Border)

<Button variant="secondary" size="small" onClick={() => alert("Secondary Button Clicked!")}>
Learn More
</Button>
🛒 Button with Icon

<Button variant="primary" size="medium" icon={<IoCartOutline />} onClick={() => alert("Cart clicked!")}>
Add to Cart
</Button>

# Debugging Issues

Styles not applying?
→ Check if Button.module.css is correctly imported in Button.tsx.
Button not rendering?
→ Check if the import path to Button.tsx is correct.
Button not working?
→ Add console.log inside onClick to debug.

By using a global button component, we ensure consistency and reusability across the project. 🚀
