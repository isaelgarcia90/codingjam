import React, { useState } from 'react';
import { WorkerProfile, TradeType } from '../types/quote';
import { X, Save, Key, User, Phone, MapPin, Briefcase } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: WorkerProfile;
  onSaveProfile: (profile: WorkerProfile) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  const [formData, setFormData] = useState<WorkerProfile>(profile);
  const [showKey, setShowKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-orange-600" />
            <h3 className="font-extrabold text-base text-slate-900">
              Perfil del Profesional
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Maestro Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-orange-600" />
              Nombre o Razón Social
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej: Maestro Don Lupe"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Trade / Oficio */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-orange-600" />
              Oficio Principal
            </label>
            <select
              value={formData.trade}
              onChange={(e) => setFormData({ ...formData, trade: e.target.value as TradeType })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
            >
              <option value="plomeria">🚰 Plomería & Fontanería</option>
              <option value="electricidad">⚡ Electricidad & Instalaciones</option>
              <option value="albanileria">🧱 Albañilería & Obra Civil</option>
              <option value="pintura">🎨 Pintura & Acabados</option>
              <option value="carpinteria">🪚 Carpintería</option>
              <option value="herreria">🔩 Herrería & Soldadura</option>
              <option value="climas">❄️ Climas & Refrigeración</option>
              <option value="general">🛠️ Mantenimiento General</option>
            </select>
          </div>

          {/* Phone & City */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-orange-600" />
                Teléfono / WhatsApp
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="55 1234 5678"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-orange-600" />
                Ciudad / Zona
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="CDMX / GDL / MTY"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Gemini API Key */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-orange-600" />
                Gemini API Key (Google AI Studio)
              </span>
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="text-[10px] text-orange-600 font-semibold hover:underline"
              >
                {showKey ? 'Ocultar' : 'Mostrar'}
              </button>
            </label>
            <input
              type={showKey ? 'text' : 'password'}
              value={formData.geminiApiKey || ''}
              onChange={(e) => setFormData({ ...formData, geminiApiKey: e.target.value })}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Se guarda en tu navegador de forma segura. También puedes definirla en <code className="bg-slate-100 px-1 py-0.5 rounded">.env</code> como <code className="bg-slate-100 px-1 py-0.5 rounded">VITE_GEMINI_API_KEY</code>.
            </p>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-lg flex items-center justify-center space-x-2 transition"
          >
            <Save className="w-4 h-4 text-orange-400" />
            <span>{savedSuccess ? '¡Guardado con éxito!' : 'Guardar Cambios'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

