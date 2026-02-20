import { Routes, Route } from 'react-router-dom';
import Reportes from './Reportes';
import Peticiones from './Peticiones'; // <-- Agregamos esta importación

function App() {
  return (
    <Routes>
      <Route path="/" element={<Reportes />} />
      <Route path="/peticiones" element={<Peticiones />} /> {/* <-- Actualizamos esta ruta */}
    </Routes>
  );
}

export default App;
