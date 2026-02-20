import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export type RedLine = {
  id: string;
  fecha: string;
  sistema: string;
  modificacion: string;
  causa: string;
  estatus: string;
};

export type ShopDrawing = {
  id: string;
  fecha: string;
  plano: string;
  revision: string;
  area: string;
};

export type Clash = {
  id: string;
  fecha: string;
  conflicto: string;
  desplazamiento: string;
  resolucion: string;
  estatus: string;
};
