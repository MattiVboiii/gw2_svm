import { useState, useEffect } from 'react';
import ReactSimplyCarousel from 'react-simply-carousel';
import styles from '/src/styles/global/Carousel.module.css';

const images = [
  // Just placeholder img's for now, will expand this later so you can also add text
  'https://picsum.photos/1920/1080?random=1',
  'https://picsum.photos/1920/1080?random=2',
  'https://picsum.photos/1920/1080?random=3',
  'https://picsum.photos/1920/1080?random=4',
  'https://picsum.photos/1920/1080?random=5',
  'https://picsum.photos/1920/1080?random=6',
];

const CarouselSlider = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const speed = 1000;

  useEffect(() => {
    const imagePromises = images.map((image) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.src = image;
        img.onload = () => resolve();
      });
    });

    Promise.all(imagePromises).then(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <ReactSimplyCarousel
      containerProps={{
        className: styles.carousel_container,
      }}
      activeSlideIndex={activeSlide} // Current active slide index
      onRequestChange={setActiveSlide} // Function to change active slide
      itemsToShow={1} // Number of items to show at once
      itemsToScroll={1} // Number of items to scroll per swipe
      infinite={true} // Enable infinite scrolling
      autoplay={true} // Enable autoplay functionality
      autoplayDelay={2500} // Delay duration for autoplay
      speed={speed} // Transition speed for slide change
      updateOnItemClick // Update slide on item click
      centerMode={true} // Enable centering of items
      dotsNav={{
        show: true, // Show dots navigation
        itemBtnProps: {
          className: styles.carousel_dot,
        },
        activeItemBtnProps: {
          className: styles.carousel_dot + ' ' + styles.active,
        },
      }}
      forwardBtnProps={{
        children: '>',
        show: true,
        className: styles.carousel_forward_btn,
      }}
      backwardBtnProps={{
        children: '<',
        show: true,
        className: styles.carousel_backward_btn,
      }}
    >
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt='carousel'
          className={styles.carousel_image}
          style={{
            filter: activeSlide === index ? 'none' : `blur(${speed / 1000}rem)`,
            transition: `filter ${speed}ms ease-in-out`,
          }}
        />
      ))}
    </ReactSimplyCarousel>
  );
};

export default CarouselSlider;
