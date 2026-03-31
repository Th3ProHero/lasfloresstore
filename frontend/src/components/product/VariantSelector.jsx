import { useState } from 'react';
import { motion } from 'framer-motion';

export default function VariantSelector({ variantes, selected, onSelect }) {
  if (!variantes || variantes.length === 0) return null;

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-2">
        Sabor
      </label>
      <div className="flex flex-wrap gap-2">
        {variantes.map((v) => (
          <motion.button
            key={v.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(v)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border
              ${
                selected?.id === v.id
                  ? 'bg-terracotta text-white border-terracotta shadow-md'
                  : 'bg-cream-100 text-slate-dark border-cream-300 hover:border-terracotta/50'
              }`}
          >
            {v.sabor}
            {v.precioExtra > 0 && (
              <span className="ml-1 text-[10px] opacity-75">+${Number(v.precioExtra).toFixed(2)}</span>
            )}
          </motion.button>
        ))}
      </div>
      {selected && (
        <p className="mt-2 text-xs text-slate-mid">
          SKU: {selected.sku} • Stock: {selected.numInventario}
        </p>
      )}
    </div>
  );
}
