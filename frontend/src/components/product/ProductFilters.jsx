import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiFilter, HiX, HiSearch } from 'react-icons/hi';
import { getMarcas } from '../../api/client';

const CATEGORIAS = [
  { value: 'BEBIDAS', label: 'Bebidas', emoji: '🥤' },
  { value: 'LACTEOS', label: 'Lácteos', emoji: '🥛' },
  { value: 'BOTANAS', label: 'Botanas', emoji: '🍿' },
  { value: 'LIMPIEZA', label: 'Limpieza', emoji: '🧹' },
  { value: 'HIGIENE', label: 'Higiene', emoji: '🧼' },
  { value: 'ENLATADOS', label: 'Enlatados', emoji: '🥫' },
  { value: 'ABARROTES', label: 'Abarrotes', emoji: '🛒' },
  { value: 'DULCES', label: 'Dulces', emoji: '🍬' },
  { value: 'CONGELADOS', label: 'Congelados', emoji: '🧊' },
  { value: 'FRUTAS_VERDURAS', label: 'Frutas y Verduras', emoji: '🥬' },
  { value: 'PANADERIA', label: 'Panadería', emoji: '🍞' },
  { value: 'MASCOTAS', label: 'Mascotas', emoji: '🐾' },
  { value: 'CERVEZAS', label: 'Cervezas', emoji: '🍺' },
  { value: 'MEDICAMENTOS', label: 'Farmacia', emoji: '💊' },
  { value: 'CREMERIA', label: 'Cremería', emoji: '🧀' },
  { value: 'DESECHABLES', label: 'Desechables', emoji: '🍽️' },
  { value: 'SALSAS', label: 'Salsas', emoji: '🌶️' },
  { value: 'ACEITES', label: 'Aceites', emoji: '🧴' },
  { value: 'VELAS', label: 'Velas', emoji: '🕯️' },
];

export default function ProductFilters({ filters, onFilterChange }) {
  const [marcas, setMarcas] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    getMarcas()
      .then(setMarcas)
      .catch(() => setMarcas([]));
  }, []);

  const activeCount = [filters.categoria, filters.marca, filters.search].filter(Boolean).length;

  const handleClear = () => {
    onFilterChange({ categoria: null, marca: null, search: '' });
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-2">
          Buscar
        </label>
        <div className="relative">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-light" />
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            placeholder="Nombre del producto..."
            className="w-full pl-9 pr-4 py-2.5 bg-cream-100 border border-cream-300 rounded-xl text-sm
                     text-slate-dark placeholder-slate-light
                     focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta
                     transition-all duration-200"
          />
        </div>
      </div>

      {/* Categories */}
      <div>
        <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-2">
          Categoría
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat.value}
              onClick={() =>
                onFilterChange({
                  ...filters,
                  categoria: filters.categoria === cat.value ? null : cat.value,
                })
              }
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200
                ${
                  filters.categoria === cat.value
                    ? 'bg-terracotta text-white shadow-md'
                    : 'bg-cream-100 text-slate-mid hover:bg-cream-200'
                }`}
            >
              <span>{cat.emoji}</span>
              <span className="truncate">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      {marcas.length > 0 && (
        <div>
          <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-2">
            Marca
          </label>
          <select
            value={filters.marca || ''}
            onChange={(e) => onFilterChange({ ...filters, marca: e.target.value || null })}
            className="w-full px-3 py-2.5 bg-cream-100 border border-cream-300 rounded-xl text-sm
                     text-slate-dark focus:outline-none focus:ring-2 focus:ring-terracotta/30
                     focus:border-terracotta transition-all duration-200"
          >
            <option value="">Todas las marcas</option>
            {marcas.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      )}

      {/* Clear */}
      {activeCount > 0 && (
        <button
          onClick={handleClear}
          className="w-full py-2.5 text-sm font-medium text-warmred hover:bg-warmred/5
                   rounded-xl border border-warmred/20 transition-colors duration-200"
        >
          Limpiar filtros ({activeCount})
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24 bg-white rounded-2xl border border-cream-300 p-5 shadow-sm">
          <h3 className="font-display text-lg font-semibold text-slate-dark mb-4 flex items-center gap-2">
            <HiFilter className="w-5 h-5 text-terracotta" /> Filtros
          </h3>
          <FilterContent />
        </div>
      </div>

      {/* Mobile filter button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setMobileOpen(true)}
          className="bg-terracotta text-white p-4 rounded-full shadow-xl flex items-center gap-2"
        >
          <HiFilter className="w-5 h-5" />
          {activeCount > 0 && (
            <span className="text-xs font-bold">{activeCount}</span>
          )}
        </motion.button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-80 bg-white z-50 p-6 overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-lg font-semibold text-slate-dark flex items-center gap-2">
                  <HiFilter className="w-5 h-5 text-terracotta" /> Filtros
                </h3>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 hover:bg-cream-200 rounded-xl transition-colors"
                >
                  <HiX className="w-5 h-5 text-slate-dark" />
                </button>
              </div>
              <FilterContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
