import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', formData);
      const { token, userId, username, role } = response.data;
      login({ userId, username, role }, token);
      navigate(-1); // Go back to where we came from (e.g., checkout)
    } catch (err) {
      setError(err.response?.data?.error || 'Credenciales incorrectas. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#fdfcf8]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-[#e0d0b0]/30"
      >
        <div className="text-center">
          <h2 className="text-4xl font-serif text-[#4a5d4e] italic">Bienvenido</h2>
          <p className="mt-2 text-sm text-gray-600 font-sans tracking-wide">
            Inicia sesión para continuar con tu pedido
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <motion.div 
              initial={{ scale: 0.95 }} 
              animate={{ scale: 1 }}
              className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-100"
            >
              {error}
            </motion.div>
          )}
          
          <div className="space-y-4">
            <div className="relative">
              <label className="text-xs font-semibold text-[#4a5d4e] uppercase ml-1">Correo Electrónico</label>
              <div className="mt-1 relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="username"
                  type="email"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4a5d4e] focus:border-transparent outline-none transition-all"
                  placeholder="tu@email.com"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="relative">
              <label className="text-xs font-semibold text-[#4a5d4e] uppercase ml-1">Contraseña</label>
              <div className="mt-1 relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="password"
                  type="password"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4a5d4e] focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-[#4a5d4e] focus:ring-[#4a5d4e] border-gray-300 rounded cursor-pointer" />
              <label htmlFor="remember-me" className="ml-2 block text-gray-600 cursor-pointer">Recordarme</label>
            </div>
            <a href="#" className="font-medium text-[#d4af37] hover:text-[#b08d2b] transition-colors">¿Olvidaste tu contraseña?</a>
          </div>

          <div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-[#4a5d4e] hover:bg-[#3d4d41] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4a5d4e] transition-all disabled:opacity-50 disabled:cursor-not-wait"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <span className="flex items-center">
                  Entrar <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </motion.button>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            ¿Aún no tienes cuenta?{' '}
            <Link to="/registro" className="font-bold text-[#d4af37] hover:underline underline-offset-4 decoration-2">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
