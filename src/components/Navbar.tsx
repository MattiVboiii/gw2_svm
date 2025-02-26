import { CiSearch } from 'react-icons/ci';
import { CiHeart } from 'react-icons/ci';
import { CiShoppingCart } from 'react-icons/ci';
import { Link } from 'react-router';
import '/src/css/Navbar.css';

const Navbar = () => {
  return (
    <>
      <nav>
        <h1>Headless Clothing Store</h1>
        <ul>
          <li>
            <Link to='/'>Home</Link>
          </li>
          <li>
            <Link to='/contact'>Contact</Link>
          </li>
          <li>
            <Link to='/about'>About</Link>
          </li>
          <li>
            <Link to='/signup'>Sign Up</Link>
          </li>
        </ul>
        <input type='text' placeholder='What are you looking for?' />
        <ul className='icons'>
          <CiSearch className='search-icon' />
          <CiHeart className='heart-icon' />
          <CiShoppingCart className='cart-icon' />
        </ul>
      </nav>
    </>
  );
};
export default Navbar;
