import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiOutlineDocumentText } from 'react-icons/hi';
import { getLegalContent } from '../../api/client';

export default function LegalModal({ isOpen, onClose, type, title }) {
  const [content, setContent] = useState('');
  const [version, setVersion] = useState(null);
  const [date, setDate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      getLegalContent(type)
        .then(data => {
          setContent(data.content || 'Este documento aún no ha sido redactado.');
          setVersion(data.version);
          setDate(data.updatedAt);
        })
        .catch(err => {
          console.error(err);
          setContent('Hubo un error cargando el documento legal. Por favor, intenta de nuevo más tarde.');
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, type]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-dark/60 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden relative flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-cream-200 flex justify-between items-center bg-cream-50 sticky top-0 z-10">
            <div className="flex items-center gap-3 text-terracotta">
              <HiOutlineDocumentText className="w-8 h-8" />
              <div>
                <h2 className="font-display text-2xl font-bold text-slate-dark leading-none">
                  {title}
                </h2>
                {version > 0 && (
                  <p className="text-xs text-slate-mid font-semibold mt-1">
                    Versión {version} • Actualizado el {new Date(date).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-cream-200 hover:bg-cream-300 text-slate-dark rounded-full transition-colors"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 md:p-8 overflow-y-auto hide-scrollbar bg-white">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-mid">
                <div className="w-8 h-8 border-4 border-cream-200 border-t-terracotta rounded-full animate-spin mb-4" />
                <p className="font-semibold text-sm">Cargando documento...</p>
              </div>
            ) : (
              <div className="prose prose-sm md:prose-base max-w-none text-slate-mid whitespace-pre-wrap">
                {content}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 md:p-6 border-t border-cream-200 bg-cream-50 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-sage hover:bg-sage-dark text-white font-bold rounded-xl shadow-md transition-all"
            >
              Regresar / Cerrar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
