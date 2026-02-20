import { Routes, Route } from 'react-router-dom';
import Reportes from './Reportes';

function App() {
  return (
    <Routes>
      {/* Esta es tu página principal actual */}
      <Route path="/" element={<Reportes />} />
      
      {/* Este es el espacio reservado para el nuevo formulario */}
      <Route path="/peticiones" element={<div className="text-white p-10 text-xl font-bold">Página de peticiones en construcción... 🚧</div>} />
    </Routes>
  );
}

export default App;
