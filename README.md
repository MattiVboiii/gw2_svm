# Headless Clothing Site

Made by Mattias, Svitlana & Viktoriia

# 🛠️ Reusable Button Component

This document explains how to use the **global Button Component** in your project. The component provides a **consistent, reusable button style** with various customization options.

# How to Use the Button Component

Instead of using regular <button> elements, use the new Button component.

# Button Variants & Sizes

The button supports different styles (variants), sizes, and icons.

{/_ Primary Buttons _/}
<Button variant="primary" size="small">Primary Small</Button>
<Button variant="primary" size="medium">Primary Medium</Button>
<Button variant="primary" size="large">Primary Large</Button>

{/_ Secondary Buttons _/}
<Button variant="secondary" size="small">Secondary Small</Button>
<Button variant="secondary" size="medium">Secondary Medium</Button>
<Button variant="secondary" size="large">Secondary Large</Button>

{/_ Buttons with Icons _/}
<Button variant="primary" size="medium" icon="🔥">Primary with Icon</Button>
<Button variant="secondary" size="medium" icon="⚡" iconPosition="right">Secondary with Right Icon</Button>

{/_ Clickable Button _/}
<Button variant="primary" size="large" onClick={() => alert("Button Clicked!")}>Click Me</Button>

# Debugging Issues

Styles not applying?
→ Check if Button.module.css is correctly imported in Button.tsx.
Button not rendering?
→ Check if the import path to Button.tsx is correct.
Button not working?
→ Add console.log inside onClick to debug.

# Summary: What You Can Do with the Button Component

✅ Customize Button Styles

Use variant="primary" for a red button.
Use variant="secondary" for a white-bordered button.
✅ Adjust Button Sizes

size="small", size="medium", size="large"
✅ Add Icons to Buttons

Use icon={<IoCartOutline />} to add an icon.
Use iconPosition="right" to move the icon to the right.
✅ Handle Click Events

Attach functions using onClick={() => console.log("Clicked!")}.

By using a global button component, we ensure consistency and reusability across the project. 🚀
