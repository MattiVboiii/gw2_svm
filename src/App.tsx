import Footer from './components/global/Footer';
import Navbar from './components/global/Navbar';
import Homepage from './pages/Homepage';
import Signup from './pages/Signup';
import { Routes, Route } from 'react-router';
import '/src/styles/main.css';

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/signup' element={<Signup />} />
      </Routes>
      <Footer />
    </>
  );
};
export default App;
