este es el codigo en app.tsx

import React, { useState, useMemo, useEffect } from 'react';
import {
  Activity,
  CheckCircle2,
  Clock,
  Send,
  FileSignature,
  ShieldCheck,
  Layers,
  Zap,
  Calendar,
  Plus,
  Trash2,
  AlertTriangle,
  Wand2,
  Loader2
} from 'lucide-react';
import { supabase, type RedLine, type ShopDrawing, type Clash } from './lib/supabase';

const ESTADOS_REDLINES = ['Borrador', 'En revisión interna', 'En revisión por el cliente', 'Aprobado para ejecución', 'Rexeitado / Con comentarios'];
const ESTADOS_CLASHES = ['Resuelto', 'Pendiente', 'En espera'];

const StatusBadge = ({ status }: { status: string }) => {
  let styles = '';
  let Icon = Activity;
  const s = status?.toLowerCase() || '';

  if (s.includes('aprobado') || s.includes('resuelto')) {
    styles = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    Icon = CheckCircle2;
  } else if (s.includes('revisión') || s.includes('pendiente')) {
    styles = s.includes('cliente') ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    Icon = s.includes('cliente') ? Send : Clock;
  } else if (s.includes('rechazado') || s.includes('rexeitado') || s.includes('espera')) {
    styles = 'bg-red-500/10 text-red-500 border-red-500/20';
    Icon = AlertTriangle;
  } else {
    styles = 'bg-slate-800 text-slate-400 border-slate-700';
    Icon = FileSignature;
  }

  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[10px] font-black uppercase tracking-wider ${styles}`}>
      <Icon size={12} /> {status}
    </div>
  );
};

const EditableField = ({ value, onChange, className, isTextarea = false, placeholder = "Escribir..." }:
  { value: string; onChange: (val: string) => void; className?: string; isTextarea?: boolean; placeholder?: string }) => {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    const inputClasses = "w-full bg-slate-800 border border-blue-500/50 rounded px-2 py-1 text-inherit font-inherit outline-none focus:ring-1 focus:ring-blue-400 transition-all";
    return isTextarea ? (
      <textarea
        autoFocus
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setIsEditing(false)}
        className={`${inputClasses} resize-none`}
        rows={3}
      />
    ) : (
      <input
        autoFocus
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setIsEditing(false)}
        onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
        className={inputClasses}
      />
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className={`cursor-text group/edit rounded transition-all duration-200 border border-transparent hover:border-blue-500/30 hover:bg-blue-500/5 p-1 min-h-[1.5em] relative ${className}`}
    >
      {value || <span className="opacity-20 italic font-normal">{placeholder}</span>}
      <div className="absolute top-1 right-1 opacity-0 group-hover/edit:opacity-30 transition-opacity">
        <Wand2 size={10} className="text-blue-400" />
      </div>
    </div>
  );
};

function Reportes() {
  const [activeTab, setActiveTab] = useState('redlines');
  const [redLines, setRedLines] = useState<RedLine[]>([]);
  const [shopDrawings, setShopDrawings] = useState<ShopDrawing[]>([]);
  const [clashes, setClashes] = useState<Clash[]>([]);
  const [loading, setLoading] = useState(true);

  const PERIOD_HVAC = "09/02/26 - 21/02/26";

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [redLinesData, shopDrawingsData, clashesData] = await Promise.all([
        supabase.from('redlines').select('*'),
        supabase.from('shop_drawings').select('*'),
        supabase.from('clashes').select('*')
      ]);

      if (redLinesData.data) setRedLines(redLinesData.data as RedLine[]);
      if (shopDrawingsData.data) setShopDrawings(shopDrawingsData.data as ShopDrawing[]);
      if (clashesData.data) setClashes(clashesData.data as Clash[]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => ({
    redLines: redLines.length,
    shopDrawings: shopDrawings.length,
    clashes: clashes.length
  }), [redLines, shopDrawings, clashes]);

  const updateItem = async (index: number, field: string, newValue: string, listType: string) => {
    let table: string;
    let list: any[];
    let setList: React.Dispatch<React.SetStateAction<any[]>>;

    if (listType === 'redlines') {
      table = 'redlines';
      list = redLines;
      setList = setRedLines;
    } else if (listType === 'shopdrawings') {
      table = 'shop_drawings';
      list = shopDrawings;
      setList = setShopDrawings;
    } else {
      table = 'clashes';
      list = clashes;
      setList = setClashes;
    }

    const item = list[index];
    const updatedItem = { ...item, [field]: newValue };

    const newList = [...list];
    newList[index] = updatedItem;
    setList(newList);

    try {
      await supabase.from(table).update(updatedItem).eq('id', item.id);
    } catch (error) {
      console.error('Error updating item:', error);
      setList(list);
    }
  };

  const addNewRow = async (type: string) => {
    const today = new Date().toLocaleDateString('es-ES');
    let newItem: any;
    let table: string;
    let setList: React.Dispatch<React.SetStateAction<any[]>>;

    if (type === 'redlines') {
      newItem = { id: `R${Date.now()}`, fecha: today, sistema: '', modificacion: '', causa: '', estatus: 'Borrador' };
      table = 'redlines';
      setList = setRedLines;
    } else if (type === 'shopdrawings') {
      newItem = { id: `D${Date.now()}`, fecha: today, plano: '', revision: '', area: '' };
      table = 'shop_drawings';
      setList = setShopDrawings;
    } else {
      newItem = { id: `ASB: ${Date.now().toString().slice(-4)}`, fecha: PERIOD_HVAC, conflicto: '', desplazamiento: '', resolucion: '', estatus: 'Pendiente' };
      table = 'clashes';
      setList = setClashes;
    }

    try {
      await supabase.from(table).insert([newItem]);
      setList(prev => [newItem, ...prev]);
    } catch (error) {
      console.error('Error adding row:', error);
    }
  };

  const deleteRow = async (index: number, type: string) => {
    let table: string;
    let list: any[];
    let setList: React.Dispatch<React.SetStateAction<any[]>>;
    let item: any;

    if (type === 'redlines') {
      table = 'redlines';
      list = redLines;
      setList = setRedLines;
      item = redLines[index];
    } else if (type === 'shopdrawings') {
      table = 'shop_drawings';
      list = shopDrawings;
      setList = setShopDrawings;
      item = shopDrawings[index];
    } else {
      table = 'clashes';
      list = clashes;
      setList = setClashes;
      item = clashes[index];
    }

    try {
      await supabase.from(table).delete().eq('id', item.id);
      setList(list.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error deleting row:', error);
    }
  };

  const currentData = activeTab === 'clashes' ? clashes : activeTab === 'redlines' ? redLines : shopDrawings;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-blue-500/30 pb-20">

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
          <button
            onClick={() => addNewRow(activeTab)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg flex items-center gap-2 border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50"
            disabled={loading}
          >
            <Plus size={16} /> Nuevo Reporte
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8">

        <div className="flex flex-wrap gap-2 mb-8 bg-slate-900/50 p-2 rounded-2xl border border-slate-800 w-fit backdrop-blur shadow-inner">
          <button onClick={() => setActiveTab('redlines')} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'redlines' ? 'bg-blue-600 text-white shadow-lg border border-blue-500' : 'text-slate-500 hover:bg-slate-800'}`}>
            <Activity size={16} /> Red Lines ({stats.redLines})
          </button>
          <button onClick={() => setActiveTab('shopdrawings')} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'shopdrawings' ? 'bg-emerald-600 text-white shadow-lg border border-emerald-500' : 'text-slate-500 hover:bg-slate-800'}`}>
            <Layers size={16} /> Shop Drawings ({stats.shopDrawings})
          </button>
          <button onClick={() => setActiveTab('clashes')} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'clashes' ? 'bg-indigo-600 text-white shadow-lg border border-indigo-500' : 'text-slate-500 hover:bg-slate-800'}`}>
            <Zap size={16} /> Clashes HVAC ({stats.clashes})
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="text-blue-500 animate-spin" />
          </div>
        ) : (
          <div className="bg-slate-900/40 rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800/40 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-800">
                    <th className="px-6 py-5 text-center min-w-[140px]">Ref (Dibujo)</th>
                    <th className="px-6 py-5">Período / Fecha</th>
                    <th className="px-6 py-5">{activeTab === 'redlines' ? 'Sistema / Disciplina' : activeTab === 'shopdrawings' ? 'Título del Plano' : 'Zona / Sistema'}</th>
                    <th className="px-6 py-5">{activeTab === 'clashes' ? 'Descripción Desplazamiento' : (activeTab === 'shopdrawings' ? 'Revisión / Detalle' : 'Descripción Técnica')}</th>
                    <th className="px-6 py-5">{activeTab === 'clashes' ? 'Resolución Técnica' : (activeTab === 'shopdrawings' ? 'Área Funcional' : 'Justificación / Causa')}</th>
                    {activeTab !== 'shopdrawings' && <th className="px-6 py-5">Estado</th>}
                    <th className="px-6 py-5 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">

                  {currentData.map((item: any, idx: number) => (
                    <tr key={`${activeTab}-${idx}`} className="group hover:bg-blue-500/[0.02] transition-colors">

                      <td className="px-6 py-7 align-top">
                        <EditableField
                          value={item.id}
                          onChange={(val) => updateItem(idx, 'id', val, activeTab)}
                          className={`font-mono text-base font-black text-center ${activeTab==='clashes'?'text-indigo-400': activeTab==='shopdrawings' ? 'text-emerald-400' : 'text-blue-500'} bg-slate-900/80 p-3 rounded-xl border border-slate-700 shadow-inner flex items-center justify-center min-h-[60px]`}
                        />
                      </td>

                      <td className="px-6 py-7 align-top">
                        <div className="flex items-center gap-1.5 bg-indigo-950/30 px-2 py-1.5 rounded border border-indigo-900/40 text-slate-300 w-fit">
                          <Calendar size={13} className="text-indigo-500 shrink-0" />
                          <EditableField
                            value={item.fecha}
                            onChange={(val) => updateItem(idx, 'fecha', val, activeTab)}
                            className="text-[10px] font-bold uppercase tracking-tight"
                          />
                        </div>
                      </td>

                      <td className="px-6 py-7 align-top min-w-[150px]">
                        <EditableField
                          value={activeTab === 'clashes' ? item.conflicto : activeTab === 'redlines' ? item.sistema : item.plano}
                          onChange={(val) => updateItem(idx, activeTab === 'clashes' ? 'conflicto' : activeTab === 'redlines' ? 'sistema' : 'plano', val, activeTab)}
                          className="text-slate-100 font-bold text-sm"
                        />
                        <div className="text-[9px] text-slate-500 font-mono uppercase tracking-tighter ml-1 mt-1 opacity-50">BIM Section</div>
                      </td>

                      <td className="px-6 py-7 align-top max-w-xs">
                        <EditableField
                          value={activeTab === 'clashes' ? item.desplazamiento : (activeTab === 'redlines' ? item.modificacion : item.revision)}
                          onChange={(val) => updateItem(idx, activeTab === 'clashes' ? 'desplazamiento' : (activeTab === 'redlines' ? 'modificacion' : 'revision'), val, activeTab)}
                          isTextarea={true}
                          className="text-slate-400 text-xs font-medium leading-relaxed italic"
                        />
                      </td>

                      <td className="px-6 py-7 align-top max-w-xs">
                        <EditableField
                          value={activeTab === 'clashes' ? item.resolucion : (activeTab === 'redlines' ? item.causa : item.area)}
                          onChange={(val) => updateItem(idx, activeTab === 'clashes' ? 'resolucion' : (activeTab === 'redlines' ? 'causa' : 'area'), val, activeTab)}
                          isTextarea={true}
                          className="text-slate-300 text-[11px] font-bold leading-relaxed"
                        />
                      </td>

                      {activeTab !== 'shopdrawings' && (
                        <td className="px-6 py-7 align-top min-w-[190px]">
                          <div className="space-y-3">
                            <StatusBadge status={item.estatus} />
                            <select
                              value={item.estatus}
                              onChange={(e) => updateItem(idx, 'estatus', e.target.value, activeTab)}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-[10px] font-bold text-slate-500 outline-none appearance-none cursor-pointer hover:border-slate-600 transition-all shadow-sm"
                            >
                              {(activeTab==='clashes'?ESTADOS_CLASHES:ESTADOS_REDLINES).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                        </td>
                      )}

                      <td className="px-6 py-7 align-top text-center">
                        <button
                          onClick={() => deleteRow(idx, activeTab)}
                          className="p-2 text-slate-600 hover:text-red-500 transition-colors rounded-lg hover:bg-red-500/10"
                          title="Eliminar Registro"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Reportes;
