import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { IoHeartOutline } from "react-icons/io5";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { Product } from "../types";
import styles from "../styles/home/ProductDetail.module.css";
import { CiDeliveryTruck } from "react-icons/ci";
import { GrPowerCycle } from "react-icons/gr";
import api from "../api";
import { toast } from "react-toastify";

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColour, setSelectedColour] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  // Function to add a product to the cart
  const handleAddToCart = async (product: Product) => {
    // Find the matching variant or fallback to first variant (if any)
    const variant =
      product.variants.find(
        (variant) =>
          variant.size === selectedSize && variant.color === selectedColour
      ) || product.variants[0];

    if (localStorage.getItem("token")) {
      try {
        if (!selectedSize) {
          toast.error("Please select a size");
          return;
        }
        if (!selectedColour) {
          toast.error("Please select a colour");
          return;
        }
        await api.post<{ message: string }>(
          "/cart",
          {
            productId: product._id,
            variantId: variant._id,
            quantity: quantity, // use number from selected quantity
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        toast.success(`${product.name} added to cart`);
      } catch (error: any) {
        toast.error("Error adding product to cart: " + error.message);
      }
    } else {
      // Guest cart: Save selected product info to localStorage
      if (!selectedSize) {
        toast.error("Please select a size");
        return;
      }
      if (!selectedColour) {
        toast.error("Please select a colour");
        return;
      }
      const guestCartStr = localStorage.getItem("guestCart");
      const guestCart = guestCartStr ? JSON.parse(guestCartStr) : [];

      // Create a new cart item with selected variant information.
      // Note: _id is generated here as a combination of product and variant IDs to keep it unique.
      const newItem = {
        _id: product._id + "-" + variant._id,
        product,
        variantId: variant._id,
        quantity,
        selectedSize,
        selectedColour,
      };

      // If same variant already exists, add to its quantity.
      const existingIndex = guestCart.findIndex(
        (item: any) => item.variantId === variant._id
      );
      if (existingIndex >= 0) {
        guestCart[existingIndex].quantity += quantity;
      } else {
        guestCart.push(newItem);
      }
      localStorage.setItem("guestCart", JSON.stringify(guestCart));
      toast.success(`${product.name} added to guest cart`);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get<Product[]>("/products");
        const data = response.data;

        // Find the product by comparing generated slugs
        const matchedProduct = data.find((p) => generateSlug(p.name) === slug);

        setProduct(matchedProduct || null);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProducts();
  }, [slug]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!product) {
    return <p>Product not found.</p>;
  }

  return (
    <div className={styles.product_detail}>
      <img
        src={product.images[0]}
        alt={product.name}
        className={styles.image}
      />
      <div className={styles.info}>
        <h1>{product.name}</h1>
        <div className={styles.ratings}>
          {[...Array(5)].map((_, i) => {
            if (i < Math.floor(product.ratings)) {
              return <FaStar key={i} color="gold" />;
            } else if (i === Math.floor(product.ratings)) {
              return <FaStarHalfAlt key={i} color="gold" />;
            } else {
              return <FaRegStar key={i} color="grey" />;
            }
          })}
        </div>
        <p className={styles.price}>${product.price}</p>
        <p className={styles.description}>{product.description}</p>
        <div className={styles.colours}>
          <h2>Colours:</h2>
          {[...new Set(product.variants.map((variant) => variant.color))].map(
            (color) => (
              <button
                key={color}
                className={`${styles.colour} ${
                  selectedColour === color ? styles.active : ""
                }`}
                onClick={() => setSelectedColour(color)}
              >
                {color}
              </button>
            )
          )}
        </div>
        <div className={styles.sizes}>
          <h2>Sizes:</h2>
          {[...new Set(product.variants.map((variant) => variant.size))].map(
            (size) => (
              <button
                key={size}
                className={`${styles.size} ${
                  selectedSize === size ? styles.active : ""
                }`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            )
          )}
        </div>
        {errors.length > 0 && (
          <ul className={styles.error}>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        )}
        <div className={styles.options}>
          <div className={styles.quantity}>
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
              -
            </button>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
            />
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>
          <button
            className={styles.addto_button}
            onClick={() => handleAddToCart(product)}
          >
            Buy Now
          </button>
          <button className={styles.addto_button}>
            <IoHeartOutline className={styles.icon} />
          </button>
        </div>
        <div className={styles.delivery}>
          <div className={styles.delivery_item}>
            <CiDeliveryTruck className={styles.icon} />
            <div className={styles.text}>
              <h2>Free Delivery</h2>
              <p>Enter your postal code for Delivery Availability</p>
            </div>
          </div>
          <div className={styles.delivery_item}>
            <GrPowerCycle className={styles.icon} />
            <div className={styles.text}>
              <h2>Return Delivery</h2>
              <p>Free 30 Days Delivery Returns</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
