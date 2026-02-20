import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Activity, ArrowLeft } from 'lucide-react';

function Peticiones() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-blue-500/30 pb-20">
      
      {/* Encabezado idéntico al panel principal */}
      <header className="sticky top-0 z-40 bg-[#020617]/95 backdrop-blur-md border-b border-slate-800 p-4 md:p-6 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="bg-white p-2 rounded-xl flex items-center justify-center h-16 min-w-[160px] shadow-lg border border-slate-700/50">
              <img src="https://i.imgur.com/rGbnBAe.jpeg" alt="Logo IMEC" className="h-12 w-auto object-contain" />
            </div>
            <div className="hidden md:block h-10 w-px bg-slate-800"></div>
            <div>
              <h1 className="text-xl font-black text-white uppercase tracking-tight italic text-blue-500/90">Control de documentación técnica de obra (CDTO)</h1>
              <div className="flex items-center gap-3 mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                <span className="flex items-center gap-1.5"><ShieldCheck size={10} className="text-blue-400" /> Operador: Borrell</span>
                <span className="flex items-center gap-1.5"><Activity size={10} className="text-emerald-500 animate-pulse" /> Gestión Activa</span>
              </div>
            </div>
          </div>
          
          {/* Botón para regresar al inicio */}
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg flex items-center gap-2 border border-slate-700 transition-all"
            >
              <ArrowLeft size={16} /> Volver al Panel
            </Link>
          </div>
        </div>
      </header>

      {/* Contenedor central donde construiremos el formulario */}
      <main className="max-w-3xl mx-auto p-4 md:p-8 mt-8">
        <div className="bg-slate-900/40 rounded-[2.5rem] border border-slate-800 p-8 shadow-2xl backdrop-blur-sm">
          <h2 className="text-2xl font-black text-white mb-6">Subir Nuevo Pendiente</h2>
          <p className="text-slate-500 italic">El formulario se construirá aquí...</p>
        </div>
      </main>

    </div>
  );
}

export default Peticiones;
