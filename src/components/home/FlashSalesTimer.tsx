import { useEffect, useState } from "react";
import { CountdownProps, TimeLeft } from "../../types";
import styles from "../../styles/home/FlashSalesTimer.module.css";
const FlashSalesTimer: React.FC<CountdownProps> = ({ date }) => {
  // Function to calculate remaining time from now to the target date
  const calculateTimeLeft = (): TimeLeft => {
    const difference = new Date(date).getTime() - new Date().getTime();
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  // Recalculate every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer); // Clear interval on unmount
  }, [date]);

  // Format numbers like 01, 02, 03 etc.
  const format = (num: number) => String(num).padStart(2, "0");
  return (
    <div className={styles.timer_wrapper}>
      <div className={styles.time_box}>
        <h4>Days</h4>
        <h1>{format(timeLeft.days)}</h1>
      </div>
      <span className={styles.separator}>:</span>
      <div className={styles.time_box}>
        <h4>Hours</h4>
        <h1>{format(timeLeft.hours)}</h1>
      </div>
      <span className={styles.separator}>:</span>
      <div className={styles.time_box}>
        <h4>Minutes</h4>
        <h1>{format(timeLeft.minutes)}</h1>
      </div>
      <span className={styles.separator}>:</span>
      <div className={styles.time_box}>
        <h4>Seconds</h4>
        <h1>{format(timeLeft.seconds)}</h1>
      </div>
    </div>
  );
  
};

export default FlashSalesTimer;
