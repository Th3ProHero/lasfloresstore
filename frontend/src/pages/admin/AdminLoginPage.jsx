import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiLockClosed } from 'react-icons/hi';
import { login } from '../../api/client';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [debugInfo, setDebugInfo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setDebugInfo(null);
    setLoading(true);

    try {
      const response = await login(credentials);
      // Guardamos el token
      localStorage.setItem('token', response.token);
      navigate('/admin/dashboard');
    } catch (err) {
      const apiMessage = err.response?.data?.message || err.message;
      const apiErrorDetail = err.response?.data?.error || 'Sin detalle';
      
      setError(`Error del Backend: [${apiErrorDetail}] - ${apiMessage}`);

      // Auto-fetch debug info temporal para ayudarte
      try {
        const debugRes = await fetch(`http://localhost:8080/api/auth/debug?correo=${credentials.username}`);
        if(debugRes.ok) {
           const debugJson = await debugRes.json();
           setDebugInfo(debugJson);
        }
      } catch (debugErr) {
        console.warn("No se pudo obtener debug info localmente", debugErr);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-cream-300"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-slate-dark text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <HiLockClosed className="w-8 h-8" />
          </div>
          <h1 className="font-display text-2xl font-bold text-slate-dark text-center">
            Admin Portal
          </h1>
          <p className="text-sm text-slate-mid mt-1">Ingresa tus credenciales maestras</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-2">
              Correo
            </label>
            <input
              type="email"
              required
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              className="w-full px-4 py-3 bg-cream-50 border border-cream-300 rounded-xl text-sm focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-2">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full px-4 py-3 bg-cream-50 border border-cream-300 rounded-xl text-sm focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta transition-all"
            />
          </div>

          {error && (
            <div className="bg-warmred/10 text-warmred text-sm font-medium px-4 py-3 rounded-lg text-left">
              <strong>Fallo al Iniciar Sesión:</strong><br/>
              {error}
            </div>
          )}

          {debugInfo && (
            <div className="bg-slate-dark text-white p-4 rounded-lg text-xs font-mono overflow-auto max-h-48 border border-slate-700 shadow-inner">
              <span className="text-terracotta border-b border-terracotta mb-2 inline-block">-- DB DEBUG INFO --</span>
              <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-slate-dark hover:bg-black text-white rounded-xl font-semibold shadow-md transition-all disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Ingresar'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
