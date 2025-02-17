import '/src/css/HeaderFooter.css';
import { CiSearch } from 'react-icons/ci';
import { CiHeart } from 'react-icons/ci';
import { CiShoppingCart } from 'react-icons/ci';

type Props = {
  children: React.ReactNode;
};

const HeaderFooter = ({ children }: Props) => {
  return (
    <>
      <div className='banner'>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus
        distinctio odio repellendus!
      </div>
      <nav>
        <h1>Headless Clothing Store</h1>
        <ul>
          <li>Home</li>
          <li>Contact</li>
          <li>About</li>
          <li>Sign Up</li>
        </ul>
        <input type='text' placeholder='What are you looking for?' />
        <ul>
          <CiSearch />
          <CiHeart />
          <CiShoppingCart />
        </ul>
      </nav>
      <main>{children}</main>
      <footer>
        <div>
          <div>
            <h1>Headless Clothing Store</h1>
          </div>
          <div>
            <h2>Support</h2>
            <p>123 Main Street, New York, NY 10001</p>
            <p>(123) 456-7890</p>
            <p>2Bm8D@example.com</p>
          </div>
          <div>
            <h2>Account</h2>
            <p>My Account</p>
            <p>Login / Register</p>
            <p>Cart</p>
            <p>Wishlist</p>
            <p>Shop</p>
          </div>
          <div>
            <h2>Quick Link</h2>
            <p>Home</p>
            <p>Contact</p>
            <p>About</p>
          </div>
        </div>
        <span>&copy; 2023 Headless Clothing Store</span>
      </footer>
    </>
  );
};
export default HeaderFooter;
