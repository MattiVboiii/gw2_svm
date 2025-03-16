import styles from '/src/styles/global/Footer.module.css';
import { Link } from 'react-router';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from 'react-icons/fa';

const Footer = () => {
  return (
    <div className={styles.footer_cover}>
      <footer>
        <div className={styles.footer_container}>
          <div>
            <Link to='/'>
              <h1>Headless Clothing Store</h1>
            </Link>
          </div>
          <div>
            <h2>Support</h2>
            <p>123 Example Street, New York, NY 10001</p>
            <p>
              <a href='mailto:example@example.com'>example@example.com</a>
            </p>
            <p>
              <a href='tel:123-456-7890'>123-456-7890</a>
            </p>
          </div>
          <div>
            <h2>Account</h2>
            <p>
              <Link to='/account'>My Account</Link>
            </p>
            <p>
              <Link to='/login'>Login/Register</Link>
            </p>
            <p>
              <Link to='/cart'>Cart</Link>
            </p>
            <p>
              <Link to='/wishlist'>Wishlist</Link>
            </p>
            <p>
              <Link to='/shop'>Shop</Link>
            </p>
          </div>
          <div>
            <h2>Quick Link</h2>
            <p>
              <Link to='/faq'>FAQ</Link>
            </p>
            <p>
              <Link to='/contact'>Contact</Link>
            </p>
            <div className={styles.icons}>
              <a
                href='https://facebook.com'
                target='_blank'
                rel='noopener noreferrer'
              >
                <FaFacebookF />
              </a>
              <a
                href='https://twitter.com'
                target='_blank'
                rel='noopener noreferrer'
              >
                <FaTwitter />
              </a>
              <a
                href='https://instagram.com'
                target='_blank'
                rel='noopener noreferrer'
              >
                <FaInstagram />
              </a>
              <a
                href='https://linkedin.com'
                target='_blank'
                rel='noopener noreferrer'
              >
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>
        <p className={styles.copyright}>© 2025 Headless Clothing Store</p>
      </footer>
    </div>
  );
};
export default Footer;
