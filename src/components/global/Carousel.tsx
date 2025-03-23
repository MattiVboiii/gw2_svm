import { useEffect, useState } from "react";
import ReactSimplyCarousel from "react-simply-carousel";
import styles from "/src/styles/global/Carousel.module.css";

const images = [
  "https://picsum.photos/1920/1080?random=1",
  "https://picsum.photos/1920/1080?random=2",
  "https://picsum.photos/1920/1080?random=3",
  "https://picsum.photos/1920/1080?random=4",
  "https://picsum.photos/1920/1080?random=5",
  "https://picsum.photos/1920/1080?random=6",
];

const Carousel = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const speed = 1000;

  // Autoplay logic using setInterval
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % images.length);
    }, 3000); // Slide every 3 seconds

    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  return (
    <div className={styles.carouselWrapper}>
      <ReactSimplyCarousel
        containerProps={{
          className: styles.carousel_container,
        }}
        activeSlideIndex={activeSlide}
        onRequestChange={setActiveSlide}
        itemsToShow={1}
        itemsToScroll={1}
        infinite={true}
        speed={speed}
        dotsNav={{
          show: true,
          itemBtnProps: {
            className: styles.carousel_dot,
          },
          activeItemBtnProps: {
            className: `${styles.carousel_dot} ${styles.active}`,
          },
        }}
        forwardBtnProps={{ show: false }}
        backwardBtnProps={{ show: false }}
      >
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`carousel-${index}`}
            className={styles.carousel_image}
            style={{
              filter: activeSlide === index ? "none" : `blur(${speed / 1000}rem)`,
              transition: `filter ${speed}ms ease-in-out`,
            }}
          />
        ))}
      </ReactSimplyCarousel>
    </div>
  );
};

export default Carousel;
