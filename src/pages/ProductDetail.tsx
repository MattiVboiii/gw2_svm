import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { Product } from "../types";
import styles from "../styles/home/ProductDetail.module.css";
import { CiDeliveryTruck } from "react-icons/ci";
import { GrPowerCycle } from "react-icons/gr";
import api from "../api";
import { toast } from "react-toastify";
import Button from "../components/global/Button";

const ProductDetail = () => {
  // Extract the full slug from the URL
  const { slug } = useParams();
  // If your URL is in the form: "essentiel-antwerp-123abc",
  // split and use the last element as productId
  const productId = slug ? slug.split("-").pop() : "";

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColour, setSelectedColour] = useState("");
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [isUpdatingWishlist, setIsUpdatingWishlist] = useState(false);

  const token = localStorage.getItem("token");

  // Function to add a product to the cart
  const handleAddToCart = async (product: Product) => {
    // Find the matching variant or fallback to first variant (if any)
    const variant =
      product.variants.find(
        (variant) =>
          variant.size === selectedSize && variant.color === selectedColour
      ) || product.variants[0];

    if (token) {
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
              Authorization: `Bearer ${token}`,
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

  // Fetch wishlist items
  const fetchWishlist = async () => {
    if (!token) return;
    try {
      const res = await api.get<{ products: { _id: string }[] }>("/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ids = res.data.products.map((p) => p._id);
      setWishlistItems(ids);
    } catch (err: any) {
      toast.error("Error fetching wishlist: " + err.message);
    }
  };

  // Toggle wishlist state
  const handleToggleWishlist = async (product: Product) => {
    if (!token) {
      toast.error("Please log in to manage your wishlist");
      return;
    }
    try {
      setIsUpdatingWishlist(true);
      if (wishlistItems.includes(product._id)) {
        await api.delete(`/wishlist/${product._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlistItems((prev) => prev.filter((id) => id !== product._id));
        toast.success(`${product.name} removed from wishlist!`);
      } else {
        await api.post(
          "/wishlist",
          { productId: product._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWishlistItems((prev) => [...prev, product._id]);
        toast.success(`${product.name} added to wishlist!`);
      }
    } catch (error: any) {
      toast.error("Error updating wishlist: " + error.message);
    } finally {
      setIsUpdatingWishlist(false);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get<Product[]>("/products");
        const data = response.data;
        // Find product by matching _id
        const matchedProduct = data.find((p) => p._id === productId);
        setProduct(matchedProduct || null);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProducts();
    fetchWishlist();
  }, [productId]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!product) {
    return <p>Product not found.</p>;
  }

  return (
    <div className={styles.product_detail}>
      <div className={styles.images}>
        <div className={styles.vertical_images}>
          {product.images.slice(1, 4).map((image, index) => (
            <img
              src={image}
              alt={product.name}
              key={image}
              onClick={() => {
                const newImages = [...product.images];
                const temp = newImages[0];
                newImages[0] = newImages[index + 1];
                newImages[index + 1] = temp;
                setProduct({
                  ...product,
                  images: newImages,
                });
              }}
            />
          ))}
        </div>
        <img
          src={product.images[0]}
          alt={product.name}
          className={styles.main_image}
        />
      </div>
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
          <Button
            variant="primary"
            size="large"
            onClick={() => handleAddToCart(product)}
            className={styles.cart_button}
          >
            Add to cart
          </Button>
          <button
            className={styles.wishlist_button}
            onClick={() => handleToggleWishlist(product)}
            disabled={isUpdatingWishlist}
          >
            {wishlistItems.includes(product._id) ? (
              <IoHeart />
            ) : (
              <IoHeartOutline />
            )}
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
