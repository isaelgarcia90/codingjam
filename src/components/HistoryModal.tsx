import React from 'react';
import { QuoteData } from '../types/quote';
import { generateQuotePDF } from '../services/pdfService';
import { X, FileDown, Share2, Trash2, ArrowUpRight, FolderOpen } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  quotes: QuoteData[];
  onSelectQuote: (quote: QuoteData) => void;
  onDeleteQuote: (id: string) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  quotes,
  onSelectQuote,
  onDeleteQuote,
}) => {
  if (!isOpen) return null;

  const handleShare = (quote: QuoteData) => {
    const text = encodeURIComponent(
      quote.mensajeWhatsAppCliente ||
        `Hola ${quote.cliente.nombre}, le comparto la cotización de MaestroPro para "${quote.trabajo.titulo}". Total: $${quote.totales.granTotalMXN.toLocaleString('es-MX')} MXN.`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <FolderOpen className="w-5 h-5 text-orange-600" />
            <h3 className="font-extrabold text-base text-slate-900">
              Historial de Cotizaciones ({quotes.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1 space-y-3 pr-1">
          {quotes.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <FolderOpen className="w-10 h-10 mx-auto text-slate-300 stroke-[1.5]" />
              <p className="text-xs font-medium">Aún no tienes cotizaciones guardadas.</p>
              <p className="text-[11px] text-slate-500">
                Las cotizaciones que generes aparecerán aquí automáticamente.
              </p>
            </div>
          ) : (
            quotes.map((q) => (
              <div
                key={q.id}
                className="p-3.5 bg-slate-50 hover:bg-orange-50/40 border border-slate-200 hover:border-orange-300 rounded-2xl transition space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 block">
                      {q.fecha} • Folio: #{q.id.slice(-6).toUpperCase()}
                    </span>
                    <h4 className="font-bold text-xs text-slate-900 line-clamp-1">
                      {q.trabajo.titulo}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Cliente: <strong className="text-slate-700">{q.cliente.nombre}</strong>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-orange-600 block">
                      ${q.totales.granTotalMXN.toLocaleString('es-MX')} MXN
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {q.materiales.length} materiales
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                  <button
                    onClick={() => {
                      onSelectQuote(q);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1 font-bold text-orange-600 hover:text-orange-700 transition"
                  >
                    Abrir detalle
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => generateQuotePDF(q)}
                      className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition"
                      title="Descargar PDF"
                    >
                      <FileDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleShare(q)}
                      className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-white rounded-lg transition"
                      title="Compartir por WhatsApp"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteQuote(q.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg transition"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

