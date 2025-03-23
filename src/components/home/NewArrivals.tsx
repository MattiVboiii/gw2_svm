import { useNavigate } from "react-router-dom";
import styles from "../../styles/home/NewArrivals.module.css";

// Denim-themed images
import img6 from "../../assets/images/6.png";
import img8 from "../../assets/images/8.jpg";
import img17 from "../../assets/images/17.png";
import img16 from "../../assets/images/16.png";

// Cards configuration
const items = [
  {
    image: img6,
    title: "Denim Duo",
    subtitle: "Limited black & white denim capsule now in stock.",
    buttonLink: "/allproducts",
    size: "large",
  },
  {
    image: img8,
    title: "Women’s Collections",
    subtitle: "Iconic silhouettes, all in denim.",
    buttonLink: "/allproducts?category=women-s-fashion",
    size: "horizontal",
  },
  {
    image: img17,
    title: "Accessories",
    subtitle: "Bags, belts, and accents — denim edition.",
    buttonLink: "/allproducts?category=accessories",
    size: "small1",
  },
  {
    image: img16,
    title: "Fragrance & Fit",
    subtitle: "The denim scent — bold and clean.",
    buttonLink: "/allproducts",
    size: "small2",
  },
];

const NewArrivals = () => {
  const navigate = useNavigate();

  return (
    <section className={styles.container}>
      <p className={styles.tag}>Featured</p>
      <h2 className={styles.heading}>New Arrival</h2>
  
      <div className={styles.grid}>
  {/* Large card */}
  <div
    className={`${styles.card} ${styles.large}`}
    style={{ backgroundImage: `url(${items[0].image})` }}
  >
    <div className={styles.overlay}>
      <h3 className={styles.title}>{items[0].title}</h3>
      <p className={styles.subtitle}>{items[0].subtitle}</p>
      <button className={styles.button} onClick={() => navigate(items[0].buttonLink)}>
        Shop Now →
      </button>
    </div>
  </div>

  {/* Horizontal card */}
  <div
    className={`${styles.card} ${styles.horizontal}`}
    style={{ backgroundImage: `url(${items[1].image})` }}
  >
    <div className={styles.overlay}>
      <h3 className={styles.title}>{items[1].title}</h3>
      <p className={styles.subtitle}>{items[1].subtitle}</p>
      <button className={styles.button} onClick={() => navigate(items[1].buttonLink)}>
        Shop Now →
      </button>
    </div>
  </div>

  {/* Smalls container */}
  <div className={styles.smalls}>
    {[items[2], items[3]].map((item, index) => (
      <div
        key={index}
        className={`${styles.card}`}
        style={{ backgroundImage: `url(${item.image})` }}
      >
        <div className={styles.overlay}>
          <h3 className={styles.title}>{item.title}</h3>
          <p className={styles.subtitle}>{item.subtitle}</p>
          <button className={styles.button} onClick={() => navigate(item.buttonLink)}>
            Shop Now →
          </button>
        </div>
      </div>
    ))}
  </div>
</div>
    </section>
  );
};

export default NewArrivals;