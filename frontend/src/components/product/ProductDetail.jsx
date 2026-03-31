import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiShoppingCart, HiMinus, HiPlus } from 'react-icons/hi';
import { getProduct } from '../../api/client';
import { useCart } from '../../context/CartContext';
import VariantSelector from './VariantSelector';
import OfferBadge from './OfferBadge';

const CATEGORY_EMOJIS = {
  BEBIDAS: '🥤', LACTEOS: '🥛', BOTANAS: '🍿', LIMPIEZA: '🧹',
  HIGIENE: '🧼', ENLATADOS: '🥫', ABARROTES: '🛒', DULCES: '🍬',
  CONGELADOS: '🧊', FRUTAS_VERDURAS: '🥬', PANADERIA: '🍞', MASCOTAS: '🐾',
};

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    getProduct(id)
      .then((data) => {
        setProduct(data);
        if (data.variantes?.length > 0) {
          setSelectedVariant(data.variantes[0]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="h-96 bg-cream-200 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-4 bg-cream-300 rounded w-20" />
            <div className="h-8 bg-cream-300 rounded w-3/4" />
            <div className="h-4 bg-cream-300 rounded w-1/3" />
            <div className="h-24 bg-cream-300 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">😥</div>
        <h2 className="font-display text-2xl text-slate-dark mb-2">Producto no encontrado</h2>
        <Link to="/catalogo" className="text-terracotta hover:underline">← Volver al catálogo</Link>
      </div>
    );
  }

  const isOnSale = product.enOferta && product.porcentajeDescuento > 0;
  const hasVariants = product.variantes?.length > 0;
  const precioExtra = selectedVariant?.precioExtra || 0;
  const precioFinal = Number(product.precioFinal) + Number(precioExtra);

  const handleAddToCart = () => {
    addItem(product, hasVariants ? selectedVariant : null, cantidad);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Back */}
      <Link
        to="/catalogo"
        className="inline-flex items-center gap-2 text-sm text-slate-mid hover:text-terracotta
                 transition-colors duration-200 mb-6"
      >
        <HiArrowLeft className="w-4 h-4" /> Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative bg-white rounded-2xl border border-cream-300 overflow-hidden shadow-sm"
        >
          {isOnSale && <OfferBadge porcentaje={product.porcentajeDescuento} />}
          <div className="h-96 flex items-center justify-center bg-cream-100">
            {product.imagenUrl ? (
              <img src={product.imagenUrl} alt={product.nombre} className="w-full h-full object-cover" />
            ) : (
              <span className="text-8xl opacity-50">
                {CATEGORY_EMOJIS[product.categoria] || '📦'}
              </span>
            )}
          </div>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col"
        >
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-sage
                         bg-sage/10 px-3 py-1 rounded-full w-fit mb-3">
            {product.categoria?.replace('_', ' ')}
          </span>

          <h1 className="font-display text-3xl font-bold text-slate-dark mb-1">
            {product.nombre}
          </h1>

          <p className="text-sm text-slate-mid mb-4">{product.marca}</p>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-terracotta">
              ${precioFinal.toFixed(2)}
            </span>
            {isOnSale && (
              <span className="text-lg text-slate-light line-through">
                ${Number(product.precio).toFixed(2)}
              </span>
            )}
            {isOnSale && (
              <span className="text-sm font-semibold text-warmred bg-warmred/10 px-2 py-0.5 rounded-full">
                Ahorra ${(Number(product.precio) - Number(product.precioFinal)).toFixed(2)}
              </span>
            )}
          </div>

          {/* Description */}
          {product.descripcion && (
            <p className="text-sm text-slate-mid leading-relaxed mb-6">
              {product.descripcion}
            </p>
          )}

          {/* Variants */}
          {hasVariants && (
            <div className="mb-6">
              <VariantSelector
                variantes={product.variantes}
                selected={selectedVariant}
                onSelect={setSelectedVariant}
              />
            </div>
          )}

          {/* Quantity + Add */}
          <div className="flex items-center gap-4 mt-auto">
            <div className="flex items-center bg-cream-100 rounded-xl border border-cream-300">
              <button
                onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                className="p-3 hover:bg-cream-200 rounded-l-xl transition-colors"
              >
                <HiMinus className="w-4 h-4 text-slate-dark" />
              </button>
              <span className="px-5 text-sm font-semibold text-slate-dark min-w-[3rem] text-center">
                {cantidad}
              </span>
              <button
                onClick={() => setCantidad(cantidad + 1)}
                className="p-3 hover:bg-cream-200 rounded-r-xl transition-colors"
              >
                <HiPlus className="w-4 h-4 text-slate-dark" />
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={added}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl
                       text-sm font-semibold transition-all duration-300 shadow-md
                       ${added
                         ? 'bg-sage text-white'
                         : 'bg-terracotta text-white hover:bg-terracotta-dark hover:shadow-lg'
                       }`}
            >
              <HiShoppingCart className="w-5 h-5" />
              {added ? '¡Agregado!' : 'Agregar al carrito'}
            </motion.button>
          </div>

          {/* Stock */}
          <div className="mt-4 text-xs text-slate-light">
            {product.numInventario > 10
              ? `✓ ${product.numInventario} en stock`
              : product.numInventario > 0
              ? `⚠ Solo quedan ${product.numInventario} unidades`
              : '✕ Agotado'}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
