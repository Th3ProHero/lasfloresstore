import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-cream-50 flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Animated background flowers */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {['🌸','🌼','🌺','🌹','🌻','🌷','💐','🌸','🌼','🌺'].map((f, i) => (
          <motion.span
            key={i}
            className="absolute text-4xl opacity-20"
            style={{ left: `${10 + i * 9}%`, top: `${10 + (i % 3) * 30}%` }}
            animate={{ y: [0, -18, 0], rotate: [0, i % 2 === 0 ? 12 : -12, 0] }}
            transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            {f}
          </motion.span>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center max-w-lg"
      >
        {/* Big flower icon */}
        <motion.div
          className="text-9xl mb-4 inline-block"
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          🌸
        </motion.div>

        <h1 className="font-display text-8xl font-bold text-terracotta mb-2">404</h1>
        <p className="font-display text-2xl font-bold text-slate-dark mb-3">
          ¡Ups! Esta página se perdió entre las flores
        </p>
        <p className="text-slate-mid text-base mb-8 leading-relaxed">
          No pudimos encontrar lo que buscabas, pero tenemos muchas cosas deliciosas en nuestra tienda. 🛒
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="px-8 py-3 bg-terracotta hover:bg-terracotta-dark text-white font-bold rounded-2xl shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
          >
            🏠 Ir al Inicio
          </Link>
          <Link
            to="/catalogo"
            className="px-8 py-3 bg-white hover:bg-cream-100 text-slate-dark font-bold rounded-2xl border border-cream-300 shadow transition-all hover:-translate-y-0.5"
          >
            🛍️ Ver Catálogo
          </Link>
        </div>

        {/* Flower divider */}
        <p className="mt-10 text-2xl tracking-widest opacity-30">🌸 🌼 🌺 🌹 🌻 🌷</p>
      </motion.div>
    </div>
  );
}
