import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowRight, HiSparkles, HiShoppingBag } from 'react-icons/hi';
import { getProductsOnSale, getProducts } from '../api/client';
import ProductCard from '../components/product/ProductCard';
import FloatingFlowers from '../components/ui/FloatingFlowers';

const HERO_CATEGORIES = [
  { emoji: '🥤', label: 'Bebidas', value: 'BEBIDAS' },
  { emoji: '🍿', label: 'Botanas', value: 'BOTANAS' },
  { emoji: '🥛', label: 'Lácteos', value: 'LACTEOS' },
  { emoji: '🧹', label: 'Limpieza', value: 'LIMPIEZA' },
  { emoji: '🍬', label: 'Dulces', value: 'DULCES' },
  { emoji: '🥫', label: 'Enlatados', value: 'ENLATADOS' },
  { emoji: '🛒', label: 'Abarrotes', value: 'ABARROTES' },
  { emoji: '🧼', label: 'Higiene', value: 'HIGIENE' },
];

export default function HomePage() {
  const [ofertas, setOfertas] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getProductsOnSale({ page: 0, size: 4 }).catch(() => ({ content: [] })),
      getProducts({ page: 0, size: 8, sortBy: 'id', direction: 'desc' }).catch(() => ({ content: [] })),
    ]).then(([ofertasData, featuredData]) => {
      setOfertas(ofertasData.content || []);
      setFeatured(featuredData.content || []);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cream-100 via-cream-50 to-cream-200">
        <FloatingFlowers count={25} opacity={0.15} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider
                           text-terracotta bg-terracotta/10 px-3 py-1.5 rounded-full mb-4">
                <HiSparkles className="w-3 h-3" /> Bienvenido a tu tienda
              </span>

              <h1 className="font-display text-4xl md:text-6xl font-bold text-slate-dark leading-tight mb-4">
                Abarrotes{' '}
                <span className="text-terracotta relative">
                  Las Flores
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                    <path d="M2 6C52 2 148 2 198 6" stroke="#C4723A" strokeWidth="3" strokeLinecap="round" opacity="0.3"/>
                  </svg>
                </span>
              </h1>

              <p className="text-base md:text-lg text-slate-mid leading-relaxed mb-8 max-w-lg">
                Tu tienda de confianza con los mejores productos al mejor precio. 
                Descubre nuestras ofertas y disfruta la comodidad de comprar desde casa.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link to="/catalogo">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 bg-terracotta text-white px-6 py-3.5 rounded-xl
                             font-semibold text-sm shadow-lg hover:bg-terracotta-dark hover:shadow-xl
                             transition-all duration-300"
                  >
                    <HiShoppingBag className="w-5 h-5" />
                    Ver Catálogo
                    <HiArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Categories ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-2xl font-bold text-slate-dark mb-6">
            Categorías
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {HERO_CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.value}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/catalogo?categoria=${cat.value}`}
                  className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-cream-300
                           hover:border-terracotta/30 hover:shadow-md transition-all duration-300 group"
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                    {cat.emoji}
                  </span>
                  <span className="text-xs font-medium text-slate-mid group-hover:text-terracotta transition-colors">
                    {cat.label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ─── Ofertas ─── */}
      {ofertas.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-slate-dark flex items-center gap-2">
                  🔥 Ofertas del Momento
                </h2>
                <p className="text-sm text-slate-mid mt-1">
                  Aprovecha nuestros mejores precios
                </p>
              </div>
              <Link
                to="/catalogo?ofertas=true"
                className="text-sm text-terracotta hover:underline flex items-center gap-1"
              >
                Ver todas <HiArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {ofertas.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* ─── Featured Products ─── */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold text-slate-dark">
                Productos Destacados
              </h2>
              <Link
                to="/catalogo"
                className="text-sm text-terracotta hover:underline flex items-center gap-1"
              >
                Ver todo <HiArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.slice(0, 8).map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* ─── CTA Banner ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-terracotta to-terracotta-dark rounded-3xl p-8 md:p-12 text-white
                   shadow-xl relative overflow-hidden"
        >
          <FloatingFlowers count={10} opacity={0.2} />
          
          <div className="relative max-w-lg z-10">
            <h3 className="font-display text-2xl md:text-3xl font-bold mb-3">
              ¿Primera vez aquí?
            </h3>
            <p className="text-sm text-white/80 mb-6 leading-relaxed">
              Descubre la variedad de productos que tenemos para ti. 
              Desde bebidas y botanas hasta artículos de limpieza, todo lo que necesitas en un solo lugar.
            </p>
            <Link to="/catalogo">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-terracotta font-semibold px-6 py-3 rounded-xl text-sm
                         hover:bg-cream-100 transition-colors shadow-lg"
              >
                Explorar Catálogo →
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
