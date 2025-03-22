import { useEffect, useState } from "react";
import { CountdownProps, TimeLeft } from "../../types";

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
    <div>
      <h2>Flash Sales Countdown</h2>
      <div>
        <span>{format(timeLeft.days)} Days </span>
        <span>{format(timeLeft.hours)} Hours </span>
        <span>{format(timeLeft.minutes)} Min </span>
        <span>{format(timeLeft.seconds)} Sec</span>
      </div>
    </div>
  );
};

export default FlashSalesTimer;
