import React, { useState, useEffect } from 'react';
import { WorkerProfile, QuoteData } from './types/quote';
import {
  getSavedProfile,
  saveProfile,
  getSavedQuotes,
  saveQuote,
  deleteQuote,
} from './services/storageService';
import { generateQuoteWithGemini } from './services/gemini';
import { SAMPLE_PRESETS } from './services/sampleData';
import { Header } from './components/Header';
import { MediaCapture } from './components/MediaCapture';
import { QuoteResult } from './components/QuoteResult';
import { SettingsModal } from './components/SettingsModal';
import { HistoryModal } from './components/HistoryModal';
import { ShieldCheck, HeartHandshake, Zap, Sparkles, AlertCircle } from 'lucide-react';

export const App: React.FC = () => {
  const [profile, setProfile] = useState<WorkerProfile>(getSavedProfile());
  const [quotes, setQuotes] = useState<QuoteData[]>(getSavedQuotes());
  const [currentQuote, setCurrentQuote] = useState<QuoteData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Auto-sync quotes state
  const refreshQuotes = () => {
    setQuotes(getSavedQuotes());
  };

  const handleGenerate = async (data: {
    audioBase64?: string;
    audioMimeType?: string;
    imageBase64?: string;
    imageMimeType?: string;
    notes: string;
    clientName: string;
  }) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const generated = await generateQuoteWithGemini({
        ...data,
        profile,
      });

      // Save to localStorage
      saveQuote(generated);
      refreshQuotes();
      setCurrentQuote(generated);
    } catch (err: any) {
      console.error('Error al generar:', err);
      setErrorMessage(
        err.message || 'Ocurrió un error al procesar con Gemini. Revisa tu conexión o API Key.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSample = (presetId: string) => {
    const preset = SAMPLE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    const sampleQuote: QuoteData = {
      ...preset.quoteSample,
      id: `quote-${Date.now()}`,
      fecha: new Date().toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      perfilMaestro: {
        nombre: profile.name,
        oficio: profile.trade,
        telefono: profile.phone,
        ciudad: profile.city,
      },
    };

    saveQuote(sampleQuote);
    refreshQuotes();
    setCurrentQuote(sampleQuote);
    setErrorMessage(null);
  };

  const handleUpdateCurrentQuote = (updated: QuoteData) => {
    setCurrentQuote(updated);
    saveQuote(updated);
    refreshQuotes();
  };

  const handleSaveProfile = (newProfile: WorkerProfile) => {
    setProfile(newProfile);
    saveProfile(newProfile);
  };

  const handleDeleteQuote = (id: string) => {
    deleteQuote(id);
    refreshQuotes();
    if (currentQuote?.id === id) {
      setCurrentQuote(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-800">
      {/* Top Header */}
      <Header
        profile={profile}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={quotes.length}
      />

      {/* Main Container (Mobile Max Width) */}
      <main className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-5">
        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-3 text-red-900 text-xs">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="font-bold block mb-0.5">Atención:</strong>
              <p>{errorMessage}</p>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                className="mt-2 text-xs font-bold text-red-700 underline hover:text-red-900"
              >
                Abrir configuración para verificar Gemini API Key
              </button>
            </div>
          </div>
        )}

        {/* View Switch: Quote Result OR Media Capture Form */}
        {currentQuote ? (
          <QuoteResult
            quote={currentQuote}
            onUpdateQuote={handleUpdateCurrentQuote}
            onBack={() => setCurrentQuote(null)}
          />
        ) : (
          <div>
            {/* Value Proposition Hero Banner */}
            <div className="mb-4 text-center px-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 bg-orange-100/70 border border-orange-200 px-3 py-1 rounded-full mb-1">
                <Sparkles className="w-3 h-3" />
                Economía Informal & Inclusión Laboral
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Cotiza en 30 segundos con audio y foto
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Sin computadoras ni papeleos. Gemini desglosa materiales en pesos mexicanos y crea un presupuesto formal para WhatsApp o PDF.
              </p>
            </div>

            {/* Main Interactive Capture Form */}
            <MediaCapture
              onGenerate={handleGenerate}
              isLoading={isLoading}
              onSelectSample={handleSelectSample}
            />

            {/* Social Impact Highlights for Judges */}
            <div className="grid grid-cols-3 gap-2.5 mt-2">
              <div className="p-3 bg-white rounded-2xl border border-slate-200 text-center shadow-sm">
                <div className="w-8 h-8 mx-auto rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 mb-1.5">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <h4 className="text-[11px] font-bold text-slate-800">Dignificación</h4>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                  Protege al maestro de regateos abusivos
                </p>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-slate-200 text-center shadow-sm">
                <div className="w-8 h-8 mx-auto rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 mb-1.5">
                  <Zap className="w-4 h-4" />
                </div>
                <h4 className="text-[11px] font-bold text-slate-800">Precios MXN</h4>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                  Calculado con ferreterías mexicanas
                </p>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-slate-200 text-center shadow-sm">
                <div className="w-8 h-8 mx-auto rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-1.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="text-[11px] font-bold text-slate-800">Garantía</h4>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                  Cláusulas y anticipo seguro para ambas partes
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-slate-200 bg-white/70 text-center text-xs text-slate-400">
        <div className="max-w-xl mx-auto px-4">
          <p className="font-semibold text-slate-600">
            MaestroPro • Prototipo para Mexico Tech Week Coding Jam
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Impulsado por Google Gemini Multimodal API • Categoría AI for Good
          </p>
        </div>
      </footer>

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        quotes={quotes}
        onSelectQuote={(q) => setCurrentQuote(q)}
        onDeleteQuote={handleDeleteQuote}
      />
    </div>
  );
};

