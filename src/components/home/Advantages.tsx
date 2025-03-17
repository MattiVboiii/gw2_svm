import { FaShippingFast, FaHeadset, FaUndo } from 'react-icons/fa';

const advantages = [
  { icon: <FaShippingFast />, title: 'Free and Fast Delivery', text: 'Free delivery for all orders over $140' },
  { icon: <FaHeadset />, title: '24/7 Customer Service', text: 'Friendly 24/7 customer support' },
  { icon: <FaUndo />, title: 'Money Back Guarantee', text: 'We return money within 30 days' }
];
const Advantages = () => {
  return (
    <section>
      {advantages.map((adv, index) => (
        <div key={index}>
          <div>{adv.icon}</div>
          <h3>{adv.title}</h3>
          <p>{adv.text}</p>
        </div>
      ))}
    </section>
  );
};

export default Advantages;
