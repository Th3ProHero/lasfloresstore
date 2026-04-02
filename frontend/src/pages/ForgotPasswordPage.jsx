import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import client from '../api/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setError('Ingresa tu correo electrónico.'); return; }
    setLoading(true); setError('');
    try {
      await client.post('/api/auth/forgot-password', { email: email.trim().toLowerCase() });
      setSent(true);
    } catch {
      setError('Ocurrió un error. Por favor intenta más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4 py-16">
      <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}}
        className="w-full max-w-md bg-white rounded-3xl shadow-lg border border-cream-200 overflow-hidden">
        <div className="bg-gradient-to-br from-terracotta to-terracotta-dark px-8 py-10 text-center">
          <span className="text-5xl mb-3 inline-block">🔑</span>
          <h1 className="font-display text-2xl font-bold text-white">Recuperar Contraseña</h1>
          <p className="text-white/70 text-sm mt-1">Las Flores Store</p>
        </div>

        <div className="p-8">
          {sent ? (
            <motion.div initial={{opacity:0,scale:.95}} animate={{opacity:1,scale:1}} className="text-center">
              <div className="text-5xl mb-4">📬</div>
              <h2 className="font-display text-xl font-bold text-slate-dark mb-3">¡Listo!</h2>
              <p className="text-slate-mid text-sm leading-relaxed mb-6">
                Si existe una cuenta con ese correo, recibirás un enlace para restablecer tu contraseña en los próximos minutos. Revisa también tu carpeta de spam.
              </p>
              <Link to="/login"
                className="inline-block px-6 py-3 bg-terracotta text-white font-bold rounded-2xl hover:bg-terracotta-dark transition-colors">
                Volver al Login
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <p className="text-slate-mid text-sm leading-relaxed">
                Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña. El enlace es válido por <strong>1 hora</strong>.
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">{error}</div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-dark mb-2">Correo electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-cream-50 focus:outline-none focus:ring-2 focus:ring-terracotta/40 focus:border-terracotta transition-colors placeholder-slate-light text-slate-dark"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-terracotta to-terracotta-dark text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Enviando...' : '📧 Enviar Enlace de Recuperación'}
              </button>

              <p className="text-center text-sm text-slate-mid">
                ¿Ya recordaste tu contraseña?{' '}
                <Link to="/login" className="text-terracotta font-semibold hover:underline">Inicia sesión</Link>
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
