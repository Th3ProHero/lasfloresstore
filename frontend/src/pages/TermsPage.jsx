import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getLegalContent } from '../api/client';

export default function TermsPage() {
  const [content, setContent] = useState('');
  const [version, setVersion] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getLegalContent('terms_and_conditions')
      .then(data => {
        setContent(data.content || '');
        setVersion(data.version || null);
        setUpdatedAt(data.updatedAt || null);
      })
      .catch(() => setError('No se pudo cargar el documento. Intenta más tarde.'))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (iso) => {
    if (!iso) return null;
    return new Date(iso).toLocaleDateString('es-MX', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  };

  return (
    <div className="bg-cream-50 min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="text-center mb-10">
            <span className="text-5xl">📄</span>
            <h1 className="font-display text-4xl font-bold text-slate-dark mt-4 mb-2">
              Términos y Condiciones
            </h1>
            <div className="flex items-center justify-center gap-4 text-slate-light text-sm mt-2">
              {version && (
                <span className="bg-cream-200 text-slate-mid px-3 py-1 rounded-full font-medium text-xs">
                  Versión {version}
                </span>
              )}
              {updatedAt && (
                <span>Última actualización: {formatDate(updatedAt)}</span>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-cream-200 p-8 md:p-10">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-cream-200 border-t-terracotta rounded-full animate-spin" />
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <p className="text-2xl mb-3">⚠️</p>
                <p className="text-slate-mid">{error}</p>
              </div>
            ) : content ? (
              /* Render as HTML if it contains tags, otherwise as plain text */
              content.trim().startsWith('<') ? (
                <div
                  className="prose prose-slate max-w-none text-slate-mid leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              ) : (
                <div className="whitespace-pre-wrap text-slate-mid text-sm leading-relaxed">
                  {content}
                </div>
              )
            ) : (
              <div className="text-center py-16 text-slate-light text-sm">
                Los términos y condiciones aún no han sido publicados.
              </div>
            )}
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-slate-light mt-6">
            🌸 Abarrotes Las Flores · Niños Héroes 29, Palmitas, Iztapalapa, CDMX
          </p>
        </motion.div>
      </div>
    </div>
  );
}
