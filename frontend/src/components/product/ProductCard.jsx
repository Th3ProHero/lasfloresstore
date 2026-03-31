import { motion } from 'framer-motion';
import { HiShoppingCart, HiEye } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import OfferBadge from './OfferBadge';

const CATEGORY_EMOJIS = {
  BEBIDAS: '🥤',
  LACTEOS: '🥛',
  BOTANAS: '🍿',
  LIMPIEZA: '🧹',
  HIGIENE: '🧼',
  ENLATADOS: '🥫',
  ABARROTES: '🛒',
  DULCES: '🍬',
  CONGELADOS: '🧊',
  FRUTAS_VERDURAS: '🥬',
  PANADERIA: '🍞',
  MASCOTAS: '🐾',
};

export default function ProductCard({ product, index = 0 }) {
  const navigate = useNavigate();
  const { addItem } = useCart();

  const hasVariants = product.variantes && product.variantes.length > 0;
  const isOnSale = product.enOferta && product.porcentajeDescuento > 0;

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    if (hasVariants) {
      navigate(`/producto/${product.id}`);
    } else {
      addItem(product);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="group relative bg-white rounded-2xl border border-cream-300 overflow-hidden
                 shadow-sm hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      onClick={() => navigate(`/producto/${product.id}`)}
    >
      {/* Offer badge */}
      {isOnSale && <OfferBadge porcentaje={product.porcentajeDescuento} />}

      {/* Image / Placeholder */}
      <div className="relative h-48 bg-cream-200 flex items-center justify-center overflow-hidden">
        {product.imagenUrl ? (
          <img
            src={product.imagenUrl}
            alt={product.nombre}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="text-6xl opacity-60 group-hover:scale-110 transition-transform duration-500">
            {CATEGORY_EMOJIS[product.categoria] || '📦'}
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-slate-dark/0 group-hover:bg-slate-dark/20 transition-colors duration-300
                       flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/producto/${product.id}`);
            }}
            className="bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg hover:bg-white transition-colors"
          >
            <HiEye className="w-5 h-5 text-slate-dark" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleQuickAdd}
            className="bg-terracotta text-white p-2.5 rounded-full shadow-lg hover:bg-terracotta-dark transition-colors"
          >
            <HiShoppingCart className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        {/* Category tag */}
        <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-sage
                       bg-sage/10 px-2 py-0.5 rounded-full mb-2">
          {product.categoria?.replace('_', ' ')}
        </span>

        <h3 className="font-display text-base font-semibold text-slate-dark leading-snug mb-1 line-clamp-2">
          {product.nombre}
        </h3>

        <p className="text-xs text-slate-mid mb-3">{product.marca}</p>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-terracotta">
              ${Number(product.precioFinal).toFixed(2)}
            </span>
            {isOnSale && (
              <span className="text-sm text-slate-light line-through">
                ${Number(product.precio).toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock indicator */}
          {product.numInventario <= 10 && product.numInventario > 0 && (
            <span className="text-[10px] text-warmred font-medium animate-pulse-soft">
              ¡Últimos {product.numInventario}!
            </span>
          )}
        </div>

        {/* Variants indicator */}
        {hasVariants && (
          <div className="mt-2 flex gap-1">
            {product.variantes.slice(0, 4).map((v) => (
              <span
                key={v.id}
                className="text-[9px] bg-cream-200 text-slate-mid px-1.5 py-0.5 rounded-full"
              >
                {v.sabor}
              </span>
            ))}
            {product.variantes.length > 4 && (
              <span className="text-[9px] text-slate-light">
                +{product.variantes.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
