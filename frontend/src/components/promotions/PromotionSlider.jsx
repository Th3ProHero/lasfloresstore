import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiFire, HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';
import { getActivePromotions, registerPromotionClick } from '../../api/client';
import PromotionModal from './PromotionModal';

export default function PromotionSlider() {
  const [promotions, setPromotions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    getActivePromotions().then(setPromotions).catch(console.error);
  }, []);

  // Auto-rotate
  useEffect(() => {
    if (promotions.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
       setCurrentIndex(prev => (prev + 1) % promotions.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [promotions, isPaused]);

  const handlePromoClick = (promo) => {
     registerPromotionClick(promo.id).catch(console.error); // Fuego y olvido
     setSelectedPromo(promo);
     setIsPaused(true); // Pausa el carrusel cuando se abre el modal
  };

  const closeModal = () => {
      setSelectedPromo(null);
      setIsPaused(false);
  };

  if (promotions.length === 0) return null;

  const current = promotions[currentIndex];
  // Helper to check if promo is new (last 3 days)
  const isNew = (startDate) => {
      const start = new Date(startDate);
      const diffTime = Math.abs(new Date() - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      return diffDays <= 3;
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div 
        className="relative bg-slate-900 rounded-3xl overflow-hidden shadow-2xl h-[28rem] md:h-[400px] flex group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => !selectedPromo && setIsPaused(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{ willChange: 'transform, opacity' }}
            className="absolute inset-0 w-full h-full flex flex-col md:flex-row cursor-pointer"
            onClick={() => handlePromoClick(current)}
          >
            {/* Image Side */}
            <div className="md:w-1/2 h-1/2 md:h-full relative overflow-hidden">
               {current.imageUrl ? (
                 <img src={current.imageUrl} alt={current.title} className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full bg-gradient-to-br from-terracotta to-warmred" />
               )}
               {isNew(current.startDate) && (
                 <div className="absolute top-4 left-4 bg-sage text-white text-xs font-bold uppercase py-1 px-3 rounded-full flex items-center gap-1 shadow-lg">
                   <HiFire className="w-4 h-4" /> ¡Nueva Dinámica!
                 </div>
               )}
            </div>
            
            {/* Content Side */}
            <div className="md:w-1/2 h-1/2 md:h-full bg-cream-50 flex flex-col justify-center p-8 md:p-12">
               <span className="text-terracotta text-sm font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                  Promoción Especial
               </span>
               <h2 className="font-display text-3xl md:text-5xl font-bold text-slate-dark mb-4 leading-tight">
                 {current.title}
               </h2>
               <p className="text-slate-mid mb-8 line-clamp-3 text-sm md:text-base">
                 {current.description}
               </p>
               
               <button className="w-fit bg-slate-800 text-white hover:bg-slate-700 px-6 py-3 rounded-xl font-semibold transition-colors shadow-lg shadow-slate-900/20">
                 Ver Dinámica
               </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        {promotions.length > 1 && (
            <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 flex gap-2 z-10">
               <button 
                  onClick={(e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev - 1 + promotions.length) % promotions.length); }}
                  className="w-10 h-10 rounded-full bg-white/50 backdrop-blur border border-white/20 flex items-center justify-center text-slate-dark hover:bg-white transition-colors"
               >
                   <HiOutlineChevronLeft className="w-5 h-5" />
               </button>
               <button 
                  onClick={(e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev + 1) % promotions.length); }}
                  className="w-10 h-10 rounded-full bg-white/50 backdrop-blur border border-white/20 flex items-center justify-center text-slate-dark hover:bg-white transition-colors"
               >
                   <HiOutlineChevronRight className="w-5 h-5" />
               </button>
            </div>
        )}

        {/* Indicators */}
        {promotions.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10 md:hidden">
               {promotions.map((p, idx) => (
                  <div key={p.id} className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-terracotta w-6' : 'bg-slate-300/50'}`} />
               ))}
            </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedPromo && <PromotionModal promo={selectedPromo} onClose={closeModal} />}
      </AnimatePresence>
    </section>
  );
}
