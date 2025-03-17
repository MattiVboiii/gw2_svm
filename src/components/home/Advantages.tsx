import { FaShippingFast, FaHeadset, FaUndo } from 'react-icons/fa';
import styles from '../../styles/home/advantages.module.css';

const advantages = [
  { icon: <FaShippingFast className={styles.icon} />, title: "Free and Fast Delivery", text: "Free delivery for all orders over $140" },
  { icon: <FaHeadset className={styles.icon} />, title: "24/7 Customer Service", text: "Friendly 24/7 customer support" },
  { icon: <FaUndo className={styles.icon} />, title: "Money Back Guarantee", text: "We return money within 30 days" }
];

const Advantages = () => {
  return (
    <section className={styles.advantages}>
      {advantages.map((adv, index) => (
        <div key={index.toString()} className={styles.advantage}>
          <div className={styles.iconContainer}>
            <div className={styles.innerCircle}>{adv.icon}</div>
          </div>
          <h3>{adv.title}</h3>
          <p>{adv.text}</p>
        </div>
      ))}
    </section>
  );
};

export default Advantages;
