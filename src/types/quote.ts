export type TradeType = 
  | 'plomeria' 
  | 'electricidad' 
  | 'albanileria' 
  | 'pintura' 
  | 'carpinteria' 
  | 'herreria' 
  | 'climas' 
  | 'general';

export interface WorkerProfile {
  name: string;
  trade: TradeType;
  phone: string;
  city: string;
  avatarSeed?: string;
  geminiApiKey?: string;
}

export interface MaterialItem {
  id: string;
  concepto: string;
  especificacion: string;
  cantidad: number;
  unidad: string; // "pza", "tramo", "rollo", "bote", "kg", "m", "juego"
  precioUnitarioEstimadoMXN: number;
  subtotalMXN: number;
}

export interface QuoteData {
  id: string;
  fecha: string;
  perfilMaestro: {
    nombre: string;
    oficio: string;
    telefono: string;
    ciudad?: string;
  };
  cliente: {
    nombre: string;
    telefono?: string;
    direccion?: string;
  };
  trabajo: {
    titulo: string;
    diagnosticoVisual: string;
    tiempoEstimado: string;
    complejidad: 'Baja' | 'Media' | 'Alta';
  };
  materiales: MaterialItem[];
  manoDeObra: {
    descripcion: string;
    diasUHoras: string;
    costoSugeridoMXN: number;
  };
  totales: {
    subtotalMaterialesMXN: number;
    totalManoDeObraMXN: number;
    granTotalMXN: number;
    anticipoRecomendadoMXN: number;
  };
  terminos: {
    diasGarantia: number;
    condicionesPago: string;
    consejosSeguridad: string[];
  };
  mensajeWhatsAppCliente: string;
  fotoUrl?: string; // Preview of user's uploaded photo
}

export interface QuickPreset {
  id: string;
  trade: TradeType;
  title: string;
  description: string;
  transcription: string;
  imageSample: string;
  quoteSample: QuoteData;
}

