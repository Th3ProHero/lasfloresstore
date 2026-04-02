import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiLock, FiCheckCircle } from 'react-icons/fi';
import axios from 'axios';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    celular: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setLoading(true);
    try {
      await axios.post('http://localhost:8080/api/auth/register', formData);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrarse. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#fdfcf8]">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center p-12 bg-white rounded-3xl shadow-2xl border border-[#4a5d4e]/10 max-w-sm w-full"
        >
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle className="text-4xl text-green-500" />
          </div>
          <h2 className="text-3xl font-serif text-[#4a5d4e] mb-4">¡Registro Exitoso!</h2>
          <p className="text-gray-600 font-sans tracking-wide">Bienvenido a la familia de Las Flores Store. Redirigiendo al login...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-[#fdfcf8] flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full bg-white p-10 rounded-2xl shadow-xl border border-[#e0d0b0]/30"
      >
        <div className="text-center mb-10">
          <h2 className="text-4xl font-serif text-[#4a5d4e] italic">Crea tu Cuenta</h2>
          <p className="mt-2 text-sm text-gray-500 font-sans uppercase tracking-widest">Únete a nosotros</p>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
          {error && (
            <motion.div 
              initial={{ scale: 0.95 }} 
              animate={{ scale: 1 }}
              className="col-span-full bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-100"
            >
              {error}
            </motion.div>
          )}

          <div className="relative">
            <label className="text-xs font-bold text-[#4a5d4e] uppercase ml-1">Nombre Completo *</label>
            <div className="mt-1 relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                name="nombre"
                type="text"
                required
                className="block w-full pl-10 pr-3 py-3 border border-gray-100 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-[#4a5d4e] outline-none transition-all shadow-sm"
                placeholder="Juan Pérez"
                value={formData.nombre}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="relative">
            <label className="text-xs font-bold text-[#4a5d4e] uppercase ml-1">Correo Electrónico *</label>
            <div className="mt-1 relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                name="correo"
                type="email"
                required
                className="block w-full pl-10 pr-3 py-3 border border-gray-100 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-[#4a5d4e] outline-none transition-all shadow-sm"
                placeholder="ejemplo@correo.com"
                value={formData.correo}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="relative">
            <label className="text-xs font-bold text-[#4a5d4e] uppercase ml-1">Celular (Opcional)</label>
            <div className="mt-1 relative">
              <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                name="celular"
                type="tel"
                className="block w-full pl-10 pr-3 py-3 border border-gray-100 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-[#4a5d4e] outline-none transition-all shadow-sm"
                placeholder="55-1234-5678"
                value={formData.celular}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="relative border-b-2 border-transparent">
            {/* Spacer */}
          </div>

          <div className="relative">
            <label className="text-xs font-bold text-[#4a5d4e] uppercase ml-1">Contraseña *</label>
            <div className="mt-1 relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                name="password"
                type="password"
                required
                className="block w-full pl-10 pr-3 py-3 border border-gray-100 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-[#4a5d4e] outline-none transition-all shadow-sm"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="relative">
            <label className="text-xs font-bold text-[#4a5d4e] uppercase ml-1">Confirmar Contraseña *</label>
            <div className="mt-1 relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                name="confirmPassword"
                type="password"
                required
                className="block w-full pl-10 pr-3 py-3 border border-gray-100 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-[#4a5d4e] outline-none transition-all shadow-sm"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="col-span-full mt-6">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={loading}
              type="submit"
              className="w-full flex justify-center items-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-[#4a5d4e] hover:bg-[#3d4d41] shadow-lg shadow-[#4a5d4e]/20 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                "Crear Cuenta y Empezar"
              )}
            </motion.button>
          </div>
        </form>

        <div className="text-center mt-8 border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-500">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="font-bold text-[#d4af37] hover:text-[#c25e3d] transition-colors">
              Inicia sesión
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
