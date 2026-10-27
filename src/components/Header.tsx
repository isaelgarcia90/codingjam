import React from 'react';
import { WorkerProfile } from '../types/quote';
import { Wrench, Settings, History, Sparkles } from 'lucide-react';

interface HeaderProps {
  profile: WorkerProfile;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  onOpenSettings,
  onOpenHistory,
  historyCount,
}) => {
  const tradeLabels: Record<string, string> = {
    plomeria: 'Plomería & Fontanería',
    electricidad: 'Instalaciones Eléctricas',
    albanileria: 'Albañilería & Obra Civil',
    pintura: 'Pintura & Acabados',
    carpinteria: 'Carpintería',
    herreria: 'Herrería & Soldadura',
    climas: 'Aire Acondicionado',
    general: 'Mantenimiento General',
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900 text-white shadow-md border-b border-slate-800">
      <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand & Profile info */}
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-xl overflow-hidden bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30 border border-orange-400/40">
            <img
              src="/logo.png"
              alt="MaestroPro Logo"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to Wrench icon if image fails
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                MaestroPro
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  AI for Good
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-300 flex items-center gap-1">
              <span className="font-semibold text-orange-300">{profile.name}</span>
              <span>•</span>
              <span className="text-slate-400">{tradeLabels[profile.trade] || profile.trade}</span>
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={onOpenHistory}
            className="relative p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            title="Historial de cotizaciones"
          >
            <History className="w-5 h-5" />
            {historyCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center border-2 border-slate-900">
                {historyCount > 9 ? '9+' : historyCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            title="Configuración de perfil y API Key"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

