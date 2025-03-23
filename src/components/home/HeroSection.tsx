import { useState } from "react";
import ReactSimplyCarousel from "react-simply-carousel";
import styles from "../../styles/home/HeroSection.module.css";

const slides = [
  {
    image: "/1.png",
    title: "Unleash Your Style",
    subtitle: "Fresh arrivals for the season",
    buttonText: "Shop Now",
    buttonLink: "/allproducts?category=new",
  },
  {
    image: "/2.png",
    title: "Flash Deals",
    subtitle: "Up to 50% off today only!",
    buttonText: "Grab Deal",
    buttonLink: "/flashsales",
  },
  {
    image: "/3.png",
    title: "Denim Dream",
    subtitle: "Discover timeless pieces",
    buttonText: "View Jeans",
    buttonLink: "/allproducts?category=jeans",
  },
];

const HeroSection = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <div className={styles.heroContainer}>
      <ReactSimplyCarousel
        containerProps={{ className: styles.carouselContainer }}
        activeSlideIndex={activeSlide}
        onRequestChange={setActiveSlide}
        itemsToShow={1}
        itemsToScroll={1}
        infinite
        autoplay
        autoplayDelay={3000}
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
          <div
            key={index}
            className={styles.slide}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className={styles.overlay}>
              <h2 className={styles.title}>{slide.title}</h2>
              <p className={styles.subtitle}>{slide.subtitle}</p>
              <a href={slide.buttonLink} className={styles.cta}>
                {slide.buttonText}
              </a>
            </div>
          </div>
        ))}
      </ReactSimplyCarousel>
    </div>
  );
};

export default HeroSection;
