import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiExternalLink, HiShoppingBag } from 'react-icons/hi';
import { Link } from 'react-router-dom';

export default function PromotionModal({ promo, onClose }) {
  if (!promo) return null;

  return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ willChange: 'opacity' }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-dark/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          style={{ willChange: 'transform, opacity' }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-md"
          >
            <HiX className="w-5 h-5" />
          </button>

          {/* Banner */}
          <div className="h-48 md:h-64 bg-slate-200 relative">
            {promo.imageUrl ? (
              <img src={promo.imageUrl} alt={promo.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-terracotta to-warmred">
                 <span className="text-white text-xl font-bold font-display opacity-80">{promo.title}</span>
              </div>
            )}
          </div>

          <div className="p-6 md:p-8">
            <h2 className="font-display text-2xl font-bold text-slate-dark mb-4">
              {promo.title}
            </h2>
            
            <div className="prose prose-sm text-slate-mid mb-6 max-h-48 overflow-y-auto hide-scrollbar">
              <p className="whitespace-pre-wrap">{promo.description}</p>
            </div>

            <div className="pt-4 border-t border-cream-300 flex flex-col gap-3">
              {promo.externalLink && (
                <a
                  href={promo.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-sage hover:bg-sage/90 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-md hover:shadow-lg"
                >
                  <HiExternalLink className="w-5 h-5" />
                  Ir al sitio participante
                </a>
              )}
              
              {promo.productId && (
                <Link
                  to={`/producto/${promo.productId}`}
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-2 bg-terracotta hover:bg-terracotta-dark text-white font-semibold py-3.5 rounded-xl transition-colors shadow-md hover:shadow-lg"
                >
                  <HiShoppingBag className="w-5 h-5" />
                  Ver "{promo.productName}"
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
  );
}
