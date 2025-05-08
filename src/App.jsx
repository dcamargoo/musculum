import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Slots from './pages/slots';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/slots" element={<Slots />} />
    </Routes>
  );
}

export default App;
