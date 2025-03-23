import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/home/ShopBanner.module.css";
import Button from "../global/Button";
import bannerImage from "../../assets/images/bannermid.jpeg";

// Interface for the timer state
interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// BannerTimer component: displays countdown timer
const BannerTimer: React.FC<{ date: string }> = ({ date }) => {
  // Function to calculate remaining time until target date
  const calculateTimeLeft = (): TimeLeft => {
    const difference = new Date(date).getTime() - new Date().getTime();
    if (difference <= 0) {
      // If difference is zero or negative, time is up
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    // Compute each time unit from the difference
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  // Initialize state with time left
  const [timeLeft, setTimeLeft] = React.useState<TimeLeft>(calculateTimeLeft());

  // useEffect to update the timer every second
  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    // Clear timer interval on component unmount
    return () => clearInterval(timer);
  }, [date]);

  // Format number for display (e.g., ensures two digits)
  const format = (num: number) => String(num).padStart(2, "0");

  return (
    // Wrapper for timer circles styled via CSS class
    <div className={styles.banner_timer_wrapper}>
      {/* Timer circle for days */}
      <div className={styles.timer_circle}>
        <span className={styles.timer_digits}>{format(timeLeft.days)}</span>
        <span className={styles.timer_label}>Days</span>
      </div>
      {/* Timer circle for hours */}
      <div className={styles.timer_circle}>
        <span className={styles.timer_digits}>{format(timeLeft.hours)}</span>
        <span className={styles.timer_label}>Hours</span>
      </div>
      {/* Timer circle for minutes */}
      <div className={styles.timer_circle}>
        <span className={styles.timer_digits}>{format(timeLeft.minutes)}</span>
        <span className={styles.timer_label}>Minutes</span>
      </div>
      {/* Timer circle for seconds */}
      <div className={styles.timer_circle}>
        <span className={styles.timer_digits}>{format(timeLeft.seconds)}</span>
        <span className={styles.timer_label}>Seconds</span>
      </div>
    </div>
  );
};

// ShopBanner component: displays the banner with background image, content, timer and Buy Now button
const ShopBanner = () => {
  const navigate = useNavigate();

  // Function to handle the "Buy Now!" button click.
  const handleBuyNow = () => {
    const salesFilter = encodeURIComponent("true");
    const categoryFilter = encodeURIComponent("sale");
    navigate(`/allproducts?sales=${salesFilter}&category=${categoryFilter}`);
  };

  return (
    // Banner section container using CSS styles
    <section className={styles.banner_section}>
      {/* Banner background image */}
      <img
        src={bannerImage}
        alt="Banner Background"
        className={styles.banner_bg}
      />
      {/* Banner content container */}
      <div className={styles.banner_content}>
        {/* Categories label */}
        <p className={styles.categories}>Categories</p>
        {/* Headline text */}
        <h2 className={styles.headline}>Designer Denim Made to Impress</h2>
        {/* Timer container */}
        <div className={styles.timer_container}>
          <BannerTimer date="2025-03-26T23:59:59" />
        </div>
        {/* "Buy Now!" button; clicking navigates to filtered Sale page */}
        <Button
          variant="primary"
          size="large"
          className={styles.buy_button}
          onClick={handleBuyNow}
        >
          Buy Now!
        </Button>
      </div>
    </section>
  );
};

export default ShopBanner;
