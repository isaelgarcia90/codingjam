import React, { useEffect } from 'react';
import { QuoteData, MaterialItem } from '../types/quote';
import { MaterialsTable } from './MaterialsTable';
import { generateQuotePDF } from '../services/pdfService';
import confetti from 'canvas-confetti';
import {
  FileDown,
  Share2,
  ShieldCheck,
  Clock,
  AlertTriangle,
  ArrowLeft,
  DollarSign,
  Send,
  CheckCircle2,
} from 'lucide-react';

interface QuoteResultProps {
  quote: QuoteData;
  onUpdateQuote: (quote: QuoteData) => void;
  onBack: () => void;
}

export const QuoteResult: React.FC<QuoteResultProps> = ({
  quote,
  onUpdateQuote,
  onBack,
}) => {
  useEffect(() => {
    // Fire celebratory confetti on mount
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#ea580c', '#f59e0b', '#10b981', '#3b82f6'],
      });
    } catch (e) {
      // ignore
    }
  }, []);

  const handleMaterialsChange = (materials: MaterialItem[]) => {
    const subtotalMat = materials.reduce((acc, curr) => acc + curr.subtotalMXN, 0);
    const granTotal = subtotalMat + quote.manoDeObra.costoSugeridoMXN;
    const anticipo = Math.round(subtotalMat + (quote.manoDeObra.costoSugeridoMXN * 0.3));

    onUpdateQuote({
      ...quote,
      materiales: materials,
      totales: {
        ...quote.totales,
        subtotalMaterialesMXN: subtotalMat,
        granTotalMXN: granTotal,
        anticipoRecomendadoMXN: anticipo,
      },
    });
  };

  const handleLaborCostChange = (newCost: number) => {
    const granTotal = quote.totales.subtotalMaterialesMXN + newCost;
    const anticipo = Math.round(quote.totales.subtotalMaterialesMXN + (newCost * 0.3));

    onUpdateQuote({
      ...quote,
      manoDeObra: {
        ...quote.manoDeObra,
        costoSugeridoMXN: newCost,
      },
      totales: {
        ...quote.totales,
        totalManoDeObraMXN: newCost,
        granTotalMXN: granTotal,
        anticipoRecomendadoMXN: anticipo,
      },
    });
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      quote.mensajeWhatsAppCliente ||
        `Hola ${quote.cliente.nombre}, le comparto la cotización de MaestroPro para "${quote.trabajo.titulo}". Total: $${quote.totales.granTotalMXN.toLocaleString('es-MX')} MXN. Con 30 días de garantía. Saludos, ${quote.perfilMaestro.nombre}.`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleDownloadPDF = () => {
    generateQuotePDF(quote);
  };

  return (
    <div className="space-y-5 pb-12 animate-fadeIn">
      {/* Navigation & Actions Top Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Nueva Cotización
        </button>

        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Cotización Lista
        </span>
      </div>

      {/* Main Quote Card */}
      <div className="bg-white rounded-3xl p-5 shadow-xl border border-slate-200/80 space-y-5">
        {/* Header with Title and Folio */}
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200/60">
                Presupuesto Formal
              </span>
              <h2 className="text-lg font-extrabold text-slate-900 mt-1 leading-snug">
                {quote.trabajo.titulo}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Cliente: <strong className="text-slate-700">{quote.cliente.nombre}</strong> • {quote.fecha}
              </p>
            </div>
          </div>

          {/* Badges: Time & Complexity */}
          <div className="flex flex-wrap gap-2 mt-3 text-xs">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              {quote.trabajo.tiempoEstimado}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 font-medium border border-amber-200/60">
              Complejidad: {quote.trabajo.complejidad}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-medium border border-emerald-200/60">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Garantía: {quote.terminos.diasGarantia} días
            </span>
          </div>

          {/* Diagnosis Box */}
          <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs text-slate-600">
            <strong className="text-slate-800 block mb-0.5">Diagnóstico Técnico:</strong>
            {quote.trabajo.diagnosticoVisual}
          </div>
        </div>

        {/* Materials Table (Editable) */}
        <MaterialsTable
          materials={quote.materiales}
          onChange={handleMaterialsChange}
        />

        {/* Labor Cost Section (Editable) */}
        <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-amber-700" />
              Mano de Obra Especializada
            </h4>
            <div className="flex items-center space-x-1">
              <span className="text-xs font-bold text-amber-900">$</span>
              <input
                type="number"
                min="0"
                step="50"
                value={quote.manoDeObra.costoSugeridoMXN}
                onChange={(e) => handleLaborCostChange(parseFloat(e.target.value) || 0)}
                className="w-24 px-2 py-1 bg-white border border-amber-300 rounded-lg text-right font-extrabold text-amber-950 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <span className="text-[11px] font-semibold text-amber-800">MXN</span>
            </div>
          </div>
          <p className="text-xs text-amber-900/80 leading-relaxed">
            {quote.manoDeObra.descripcion}
          </p>
          <span className="inline-block text-[10px] font-semibold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded">
            ⏱ {quote.manoDeObra.diasUHoras}
          </span>
        </div>

        {/* Grand Total Summary Box */}
        <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-lg space-y-3">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Subtotal Materiales ({quote.materiales.length} artículos):</span>
            <span className="text-white font-semibold">
              ${quote.totales.subtotalMaterialesMXN.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
            </span>
          </div>
          <div className="flex justify-between text-xs text-slate-400">
            <span>Mano de Obra Sugerida:</span>
            <span className="text-white font-semibold">
              ${quote.totales.totalManoDeObraMXN.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
            </span>
          </div>

          <div className="border-t border-slate-700/80 pt-2 flex items-baseline justify-between">
            <div>
              <span className="text-xs uppercase font-extrabold text-orange-400 tracking-wider">
                Total Estimado
              </span>
              <p className="text-[10px] text-slate-400">
                Anticipo sugerido: ${quote.totales.anticipoRecomendadoMXN.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-white tracking-tight">
                ${quote.totales.granTotalMXN.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-xs text-orange-400 font-bold ml-1">MXN</span>
            </div>
          </div>
        </div>

        {/* Terms & Payment Conditions */}
        <div className="text-xs text-slate-500 space-y-1.5 p-3 bg-slate-50 rounded-xl border border-slate-200/60">
          <p>
            <strong className="text-slate-700">Condición de Pago:</strong> {quote.terminos.condicionesPago}
          </p>
          <p>
            <strong className="text-slate-700">Garantía por escrito:</strong> {quote.terminos.diasGarantia} días de garantía en mano de obra.
          </p>
          {quote.terminos.consejosSeguridad?.length > 0 && (
            <div className="mt-2 pt-2 border-t border-slate-200/60">
              <span className="text-slate-700 font-bold flex items-center gap-1 mb-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Seguridad Recomendada (EPP):
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-slate-600 pl-1">
                {quote.terminos.consejosSeguridad.map((consejo, idx) => (
                  <li key={idx}>{consejo}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Two Giant Action Buttons for Direct Deliverables */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Share on WhatsApp */}
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-xs shadow-lg shadow-emerald-600/25 flex items-center justify-center space-x-2 transition"
          >
            <Share2 className="w-4 h-4" />
            <span>Compartir por WhatsApp</span>
          </button>

          {/* Download Official PDF */}
          <button
            type="button"
            onClick={handleDownloadPDF}
            className="w-full py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-bold text-xs shadow-lg shadow-slate-900/25 flex items-center justify-center space-x-2 transition"
          >
            <FileDown className="w-4 h-4 text-orange-400" />
            <span>Descargar Cotización PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};

