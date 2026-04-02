import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import client from '../api/client';

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) { setError('La contraseña debe tener al menos 6 caracteres.'); return; }
    if (newPassword !== confirm) { setError('Las contraseñas no coinciden.'); return; }
    setLoading(true); setError('');
    try {
      await client.post('/api/auth/reset-password', { token, newPassword });
      setDone(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'El enlace es inválido o ha expirado. Solicita uno nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-10 text-center border border-red-200 max-w-sm">
          <div className="text-5xl mb-4">❌</div>
          <h2 className="font-display text-xl font-bold text-slate-dark mb-3">Enlace Inválido</h2>
          <p className="text-slate-mid text-sm mb-5">Este enlace de recuperación no es válido.</p>
          <Link to="/recuperar-contrasena"
            className="px-6 py-3 bg-terracotta text-white font-bold rounded-2xl inline-block">
            Solicitar Nuevo Enlace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4 py-16">
      <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}}
        className="w-full max-w-md bg-white rounded-3xl shadow-lg border border-cream-200 overflow-hidden">
        <div className="bg-gradient-to-br from-sage to-sage-dark px-8 py-10 text-center">
          <span className="text-5xl mb-3 inline-block">{done ? '✅' : '🔐'}</span>
          <h1 className="font-display text-2xl font-bold text-white">
            {done ? '¡Contraseña Actualizada!' : 'Nueva Contraseña'}
          </h1>
          <p className="text-white/70 text-sm mt-1">Las Flores Store</p>
        </div>

        <div className="p-8">
          {done ? (
            <div className="text-center">
              <p className="text-slate-mid text-sm leading-relaxed mb-6">
                Tu contraseña ha sido actualizada correctamente. Serás redirigido al login en unos segundos...
              </p>
              <Link to="/login"
                className="inline-block px-6 py-3 bg-sage text-white font-bold rounded-2xl hover:opacity-90 transition">
                Ir al Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">{error}</div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-dark mb-2">Nueva Contraseña</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-cream-50 focus:outline-none focus:ring-2 focus:ring-sage/40 focus:border-sage transition-colors text-slate-dark"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-dark mb-2">Confirmar Contraseña</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Repite la contraseña"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-cream-50 focus:outline-none focus:ring-2 focus:ring-sage/40 focus:border-sage transition-colors text-slate-dark"
                />
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-sage to-sage-dark text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? 'Actualizando...' : '✅ Actualizar Contraseña'}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
