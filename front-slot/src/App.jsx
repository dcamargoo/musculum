import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Slots from './pages/slots';
import EntrarSlots from './pages/entrarslots';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/slots" element={<Slots />} />
      <Route path="/entrar-slots" element={<EntrarSlots />} />
    </Routes>
  );
}

export default App;
