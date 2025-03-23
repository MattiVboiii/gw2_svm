import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactSimplyCarousel from "react-simply-carousel";
import styles from "../../styles/home/HeroSection.module.css";
import img1 from "../../assets/images/1.png";
import img2 from "../../assets/images/2.png";
import img3 from "../../assets/images/3.png";
import img4 from "../../assets/images/4.png";
import img5 from "../../assets/images/5.png";

const slides = [
  {
    image: img1,
    title: "Unleash Your Style",
    subtitle: "Fresh arrivals for the season",
    buttonText: "Shop Now",
    buttonLink: "/allproducts",
  },
  {
    image: img2,
    title: "Flash Deals",
    subtitle: "Up to 50% off today only!",
    buttonText: "Grab Deal",
    buttonLink: "/allproducts",
  },
  {
    image: img3,
    title: "Denim Dream",
    subtitle: "Discover timeless pieces",
    buttonText: "View Jeans",
    buttonLink: "/allproducts",
  },
  {
    image: img4,
    title: "Summer Essentials",
    subtitle: "Get ready for sunny days",
    buttonText: "Explore Now",
    buttonLink: "/allproducts",
  },
  {
    image: img5,
    title: "Stylish & Comfy",
    subtitle: "Fall in love with style",
    buttonText: "Feel Amazing, baby",
    buttonLink: "/allproducts",
  },
];

const HeroSection = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const navigate = useNavigate();

  // Autoplay
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prevIndex) => (prevIndex + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.heroContainer}>
      <ReactSimplyCarousel
        containerProps={{
          className: styles.carouselContainer,
        }}
        activeSlideIndex={activeSlide}
        onRequestChange={setActiveSlide}
        itemsToShow={1}
        itemsToScroll={1}
        infinite
        speed={1000}
        dotsNav={{
          show: true,
          itemBtnProps: { className: styles.dot },
          activeItemBtnProps: { className: `${styles.dot} ${styles.active}` },
        }}
        forwardBtnProps={{ show: false }}
        backwardBtnProps={{ show: false }}
      >
        {slides.map((slide, index) => (
          <div key={index} className={styles.slideWrapper}>
            <div
              className={styles.slide}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className={styles.overlay}>
                <p className={styles.subtitle}>{slide.subtitle}</p>
                <h2 className={styles.title}>{slide.title}</h2>
                <button
                  className={styles.cta}
                  onClick={() => navigate(slide.buttonLink)}
                >
                  {slide.buttonText} →
                </button>
              </div>
            </div>
          </div>
        ))}
      </ReactSimplyCarousel>
    </div>
  );
};

export default HeroSection;
