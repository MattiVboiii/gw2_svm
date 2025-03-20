import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { IoHeartOutline } from "react-icons/io5";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { Product } from "../types";
import styles from "../styles/home/ProductDetail.module.css";
import { CiDeliveryTruck } from "react-icons/ci";
import { GrPowerCycle } from "react-icons/gr";

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColour, setSelectedColour] = useState("");

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://webshop-api-wc6u.onrender.com/api/products"
        );
        const data = (await response.json()) as Product[];

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
          <button className={styles.addto_button}>Buy Now</button>
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
