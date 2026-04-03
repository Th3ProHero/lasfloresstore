import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiLock, FiCheckCircle, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';
import { register } from '../api/client';
import LegalModal from '../components/ui/LegalModal';

// ─── Validators ───────────────────────────────────────────────────────────────
const RULES = {
  nombre: (v) => {
    if (!v.trim()) return 'El nombre completo es obligatorio.';
    if (v.trim().length < 5) return 'Mínimo 5 caracteres.';
    if (v.trim().length > 80) return 'Máximo 80 caracteres.';
    return '';
  },
  correo: (v) => {
    if (!v.trim()) return 'El correo es obligatorio.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Ingresa un correo válido.';
    return '';
  },
  celular: (v) => {
    if (!v) return ''; // optional
    const digits = v.replace(/\D/g, '');
    if (digits.length < 10) return 'Mínimo 10 dígitos.';
    if (digits.length > 15) return 'Máximo 15 dígitos.';
    if (/[^0-9\s\-()+ ]/.test(v)) return 'Solo se permiten números y guiones.';
    return '';
  },
  password: (v) => {
    if (!v) return 'La contraseña es obligatoria.';
    if (v.length < 8) return 'Mínimo 8 caracteres.';
    if (!/[A-Za-z]/.test(v) || !/[0-9]/.test(v)) return 'Debe incluir letras y números.';
    return '';
  },
  confirmPassword: (v, form) => {
    if (!v) return 'Confirma tu contraseña.';
    if (v !== form.password) return 'Las contraseñas no coinciden.';
    return '';
  },
};

// ─── Field helper ─────────────────────────────────────────────────────────────
function Field({ label, error, touched, hint, children }) {
  const hasError = touched && error;
  const isOk = touched && !error;
  return (
    <div className="relative">
      <label className={`text-xs font-bold uppercase ml-1 tracking-wide transition-colors ${hasError ? 'text-red-500' : 'text-[#4a5d4e]'}`}>
        {label}
      </label>
      <div className="mt-1 relative">
        {children}
        {/* Status icon */}
        <AnimatePresence>
          {hasError && (
            <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400">
              <FiAlertCircle className="w-4 h-4" />
            </motion.span>
          )}
          {isOk && (
            <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
              <FiCheckCircle className="w-4 h-4" />
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      {/* Error / hint message */}
      <AnimatePresence>
        {hasError && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mt-1 ml-1 text-[11px] text-red-500 font-medium">
            {error}
          </motion.p>
        )}
        {!hasError && hint && (
          <p className="mt-1 ml-1 text-[11px] text-gray-400">{hint}</p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Input class helper ───────────────────────────────────────────────────────
function inputCls(touched, error) {
  const base = 'block w-full pl-10 pr-9 py-3 rounded-xl bg-gray-50/50 outline-none transition-all shadow-sm text-sm';
  if (!touched) return `${base} border border-gray-100 focus:bg-white focus:ring-2 focus:ring-[#4a5d4e]/40 focus:border-[#4a5d4e]`;
  if (error)    return `${base} border border-red-300 bg-red-50/30 focus:ring-2 focus:ring-red-300 focus:border-red-400`;
  return         `${base} border border-green-300 bg-green-50/20 focus:ring-2 focus:ring-green-300 focus:border-green-400`;
}

// ─── Component ────────────────────────────────────────────────────────────────
const RegisterPage = () => {
  const [form, setForm] = useState({ nombre: '', correo: '', celular: '', password: '', confirmPassword: '' });
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsTouched, setTermsTouched] = useState(false);
  const navigate = useNavigate();

  const validate = useCallback((field, value, currentForm) => {
    const rule = RULES[field];
    return rule ? rule(value, currentForm || form) : '';
  }, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Phone: strip non-digit/allowed chars on input
    const coerced = name === 'celular' ? value.replace(/[^0-9\s\-()+]/g, '') : value;
    const newForm = { ...form, [name]: coerced };
    setForm(newForm);
    setServerError('');
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validate(name, coerced, newForm) }));
    }
    // Also re-validate confirmPassword if password changed
    if (name === 'password' && touched.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: validate('confirmPassword', newForm.confirmPassword, newForm) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validate(name, value) }));
  };

  const isFormValid = () => {
    return (
      !RULES.nombre(form.nombre) &&
      !RULES.correo(form.correo) &&
      !RULES.celular(form.celular) &&
      !RULES.password(form.password) &&
      !RULES.confirmPassword(form.confirmPassword, form) &&
      termsAccepted
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Touch all fields to show errors
    const allTouched = { nombre: true, correo: true, celular: true, password: true, confirmPassword: true };
    setTouched(allTouched);
    const newErrors = {
      nombre: RULES.nombre(form.nombre),
      correo: RULES.correo(form.correo),
      celular: RULES.celular(form.celular),
      password: RULES.password(form.password),
      confirmPassword: RULES.confirmPassword(form.confirmPassword, form),
    };
    setErrors(newErrors);
    setTermsTouched(true);

    if (Object.values(newErrors).some(Boolean) || !termsAccepted) return;

    setLoading(true);
    setServerError('');
    try {
      await register({ nombre: form.nombre, correo: form.correo, celular: form.celular || null, password: form.password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      if (err.response?.status === 409 || err.response?.data?.message?.toLowerCase().includes('correo')) {
        setErrors(prev => ({ ...prev, correo: 'Este correo ya está registrado.' }));
        setTouched(prev => ({ ...prev, correo: true }));
      } else if (err.response?.data?.details) {
        const firstMsg = Object.values(err.response.data.details)[0];
        setServerError(firstMsg);
      } else {
        setServerError(err.response?.data?.error || err.response?.data?.message || 'Error al registrarse. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Success ────────────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#fdfcf8]">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="text-center p-12 bg-white rounded-3xl shadow-2xl border border-[#4a5d4e]/10 max-w-sm w-full">
          <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 12 }}
            className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-100">
            <FiCheckCircle className="text-4xl text-green-500" />
          </motion.div>
          <h2 className="text-3xl font-serif text-[#4a5d4e] mb-3">¡Registro Exitoso!</h2>
          <p className="text-gray-500 font-sans text-sm">Bienvenido/a a Las Flores. Redirigiendo al login…</p>
        </motion.div>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-[#fdfcf8] flex items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full bg-white p-10 rounded-2xl shadow-xl border border-[#e0d0b0]/30">

        <div className="text-center mb-8">
          <h2 className="text-4xl font-serif text-[#4a5d4e] italic">Crea tu Cuenta</h2>
          <p className="mt-2 text-xs text-gray-400 uppercase tracking-widest">Únete a Las Flores</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">

          {/* Server error */}
          <AnimatePresence>
            {serverError && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="bg-red-50 text-red-600 p-3 rounded-xl text-sm text-center border border-red-100">
                {serverError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Grid: nombre + correo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Nombre */}
            <Field label="Nombre Completo *" error={errors.nombre} touched={touched.nombre} hint="Mínimo 5 caracteres">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input name="nombre" type="text" autoComplete="name"
                className={inputCls(touched.nombre, errors.nombre)}
                placeholder="Juan Pérez García"
                value={form.nombre}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Field>

            {/* Correo */}
            <Field label="Correo Electrónico *" error={errors.correo} touched={touched.correo}>
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input name="correo" type="email" autoComplete="email"
                className={inputCls(touched.correo, errors.correo)}
                placeholder="ejemplo@correo.com"
                value={form.correo}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Field>
          </div>

          {/* Celular */}
          <Field label="Celular (Opcional)" error={errors.celular} touched={touched.celular} hint="Solo números — Ej: 55 1234 5678">
            <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input name="celular" type="tel" autoComplete="tel"
              inputMode="numeric"
              className={inputCls(touched.celular, errors.celular)}
              placeholder="55 1234 5678"
              value={form.celular}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Field>

          {/* Contraseñas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Contraseña *" error={errors.password} touched={touched.password} hint="Mín. 8 caracteres con letras y números">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password"
                className={`${inputCls(touched.password, errors.password)} pr-16`}
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <button type="button" tabIndex={-1} onClick={() => setShowPassword(p => !p)}
                className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
              </button>
            </Field>

            <Field label="Confirmar Contraseña *" error={errors.confirmPassword} touched={touched.confirmPassword}>
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input name="confirmPassword" type={showConfirm ? 'text' : 'password'} autoComplete="new-password"
                className={`${inputCls(touched.confirmPassword, errors.confirmPassword)} pr-16`}
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <button type="button" tabIndex={-1} onClick={() => setShowConfirm(p => !p)}
                className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                {showConfirm ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
              </button>
            </Field>
          </div>

          {/* Password strength mini-bar */}
          {form.password && (
            <div className="space-y-1">
              <div className="flex gap-1">
                {[
                  form.password.length >= 8,
                  /[A-Z]/.test(form.password),
                  /[0-9]/.test(form.password),
                  /[^A-Za-z0-9]/.test(form.password),
                ].map((ok, i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${ok ? 'bg-green-400' : 'bg-gray-200'}`} />
                ))}
              </div>
              <p className="text-[10px] text-gray-400 ml-0.5">
                {form.password.length < 8 ? 'Muy corta' :
                  /[A-Z]/.test(form.password) && /[0-9]/.test(form.password) && /[^A-Za-z0-9]/.test(form.password) ? '💪 Contraseña fuerte' :
                  /[A-Za-z]/.test(form.password) && /[0-9]/.test(form.password) ? 'Aceptable' : 'Agrega números o símbolos'}
              </p>
            </div>
          )}

          {/* Terms */}
          <div className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${termsTouched && !termsAccepted ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-100'}`}>
            <input id="reg-terms" type="checkbox"
              checked={termsAccepted}
              onChange={e => { setTermsAccepted(e.target.checked); setTermsTouched(true); }}
              className="mt-0.5 w-4 h-4 text-[#4a5d4e] border-gray-300 rounded focus:ring-[#4a5d4e] cursor-pointer flex-shrink-0"
            />
            <label htmlFor="reg-terms" className="text-xs text-gray-600 cursor-pointer select-none leading-relaxed">
              He leído y acepto los{' '}
              <button type="button" onClick={() => setShowTermsModal(true)}
                className="text-[#4a5d4e] font-bold hover:underline">
                Términos y Condiciones
              </button>
              {' y la '}
              <Link to="/privacidad" target="_blank" className="text-[#4a5d4e] font-bold hover:underline">
                Política de Privacidad
              </Link>
              {' '}de Abarrotes Las Flores.
            </label>
          </div>
          <AnimatePresence>
            {termsTouched && !termsAccepted && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="text-[11px] text-red-500 ml-1 -mt-3">
                Debes aceptar los términos para continuar.
              </motion.p>
            )}
          </AnimatePresence>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            disabled={loading}
            type="submit"
            className="w-full flex justify-center items-center gap-2 py-4 px-4 text-sm font-bold rounded-xl text-white bg-[#4a5d4e] hover:bg-[#3d4d41] shadow-lg shadow-[#4a5d4e]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <FiCheckCircle className="w-4 h-4" />
                Crear Cuenta y Empezar
              </>
            )}
          </motion.button>
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

      <LegalModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        type="terms_and_conditions"
        title="Términos y Condiciones"
      />
    </div>
  );
};

export default RegisterPage;
