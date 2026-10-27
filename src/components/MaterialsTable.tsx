import React from 'react';
import { MaterialItem } from '../types/quote';
import { Plus, Trash2, Package } from 'lucide-react';

interface MaterialsTableProps {
  materials: MaterialItem[];
  onChange: (updatedMaterials: MaterialItem[]) => void;
}

export const MaterialsTable: React.FC<MaterialsTableProps> = ({
  materials,
  onChange,
}) => {
  const handleItemChange = (
    id: string,
    field: keyof MaterialItem,
    value: any
  ) => {
    const updated = materials.map((item) => {
      if (item.id !== id) return item;

      const newItem = { ...item, [field]: value };

      // Recalculate subtotal if quantity or unit price changed
      if (field === 'cantidad' || field === 'precioUnitarioEstimadoMXN') {
        const qty = Number(field === 'cantidad' ? value : item.cantidad) || 0;
        const price = Number(field === 'precioUnitarioEstimadoMXN' ? value : item.precioUnitarioEstimadoMXN) || 0;
        newItem.subtotalMXN = qty * price;
      }

      return newItem;
    });

    onChange(updated);
  };

  const handleAddItem = () => {
    const newItem: MaterialItem = {
      id: `mat-${Date.now()}`,
      concepto: 'Nuevo insumo / refacción',
      especificacion: 'Estándar',
      cantidad: 1,
      unidad: 'pza',
      precioUnitarioEstimadoMXN: 50,
      subtotalMXN: 50,
    };
    onChange([...materials, newItem]);
  };

  const handleDeleteItem = (id: string) => {
    onChange(materials.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Package className="w-3.5 h-3.5 text-orange-600" />
          Desglose de Materiales e Insumos
        </h4>
        <button
          type="button"
          onClick={handleAddItem}
          className="inline-flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-2.5 py-1 rounded-lg transition"
        >
          <Plus className="w-3.5 h-3.5" />
          Agregar
        </button>
      </div>

      <div className="space-y-2">
        {materials.map((item, index) => (
          <div
            key={item.id}
            className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 transition hover:border-slate-300"
          >
            {/* Top row: Concept, Specs and Delete */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  value={item.concepto}
                  onChange={(e) => handleItemChange(item.id, 'concepto', e.target.value)}
                  placeholder="Nombre del material"
                  className="w-full font-semibold text-slate-800 text-xs bg-transparent border-b border-transparent hover:border-slate-300 focus:border-orange-500 focus:outline-none transition"
                />
                <input
                  type="text"
                  value={item.especificacion}
                  onChange={(e) => handleItemChange(item.id, 'especificacion', e.target.value)}
                  placeholder="Medida, calibre o marca"
                  className="w-full text-[11px] text-slate-500 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-orange-500 focus:outline-none transition"
                />
              </div>
              <button
                type="button"
                onClick={() => handleDeleteItem(item.id)}
                className="text-slate-400 hover:text-red-500 p-1 transition"
                title="Eliminar insumo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Bottom row: Cantidad, Unidad, Precio Unitario, Subtotal */}
            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-200/60 text-xs items-center">
              {/* Cantidad & Unidad */}
              <div className="flex items-center space-x-1">
                <span className="text-[10px] text-slate-400 font-medium">Cant:</span>
                <input
                  type="number"
                  min="0.1"
                  step="any"
                  value={item.cantidad}
                  onChange={(e) => handleItemChange(item.id, 'cantidad', parseFloat(e.target.value) || 0)}
                  className="w-12 px-1.5 py-0.5 bg-white border border-slate-200 rounded text-center text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
                <span className="text-[10px] text-slate-500">{item.unidad}</span>
              </div>

              {/* Precio Unitario */}
              <div className="flex items-center justify-center space-x-1">
                <span className="text-[10px] text-slate-400 font-medium">P.U: $</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={item.precioUnitarioEstimadoMXN}
                  onChange={(e) => handleItemChange(item.id, 'precioUnitarioEstimadoMXN', parseFloat(e.target.value) || 0)}
                  className="w-16 px-1.5 py-0.5 bg-white border border-slate-200 rounded text-center text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              {/* Subtotal */}
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block leading-none">Subtotal:</span>
                <span className="font-bold text-xs text-slate-800">
                  ${item.subtotalMXN.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        ))}

        {materials.length === 0 && (
          <p className="text-center py-4 text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            No hay materiales registrados para este presupuesto.
          </p>
        )}
      </div>
    </div>
  );
};

