import { Route, Routes } from 'react-router';
import HeaderFooter from './components/HeaderFooter';
import Homepage from './pages/Homepage';

const App = () => {
  return (
    <>
      <HeaderFooter>
        <Routes>
          <Route path='/' element={<Homepage />} />
        </Routes>
      </HeaderFooter>
    </>
  );
};
export default App;
