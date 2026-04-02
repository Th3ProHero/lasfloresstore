import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiArrowLeft, HiCreditCard, HiCash, HiOfficeBuilding, HiCheck } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { processCheckout } from '../api/client';
import FlowerExplosion from '../components/ui/FlowerExplosion';
import LegalModal from '../components/ui/LegalModal';

const PAYMENT_METHODS = [
  {
    id: 'EFECTIVO',
    label: 'Efectivo',
    desc: 'Paga al recoger tu pedido',
    icon: HiCash,
    color: 'sage',
  },
  {
    id: 'SPEI',
    label: 'Transferencia SPEI',
    desc: 'Envía tu comprobante por WhatsApp',
    icon: HiOfficeBuilding,
    color: 'terracotta',
  },
  {
    id: 'TARJETA',
    label: 'Tarjeta',
    desc: 'Próximamente disponible',
    icon: HiCreditCard,
    color: 'slate-mid',
    disabled: true,
  },
];

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: review, 2: info, 3: confirmdfs
  const [metodoPago, setMetodoPago] = useState('EFECTIVO');
  const [form, setForm] = useState({ 
    name: user?.username || '', 
    email: user?.correo || '', 
    phone: user?.celular || '', 
    notas: '' 
  });

  // Pre-fill form when user is available
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        name: user.username || prev.name,
        email: user.correo || prev.email,
        phone: user.celular || prev.phone
      }));
    }
  }, [user]);

  const [submitting, setSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [finalOrderInfo, setFinalOrderInfo] = useState(null);
  const [error, setError] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  if (items.length === 0 && !orderResult) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="font-display text-2xl text-slate-dark mb-2">Tu carrito está vacío</h2>
        <p className="text-sm text-slate-mid mb-6">Agrega productos antes de hacer checkout.</p>
        <Link
          to="/catalogo"
          className="inline-flex items-center gap-2 bg-terracotta text-white px-6 py-3 rounded-xl
                   font-semibold text-sm hover:bg-terracotta-dark transition-colors"
        >
          <HiArrowLeft className="w-4 h-4" /> Ir al catálogo
        </Link>
      </div>
    );
  }

  // ─── Success ───
  if (orderResult) {
    return (
      <div className="relative min-h-[80vh] py-16">
        <FlowerExplosion />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl mx-auto px-4 text-center z-10 relative"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 12, delay: 0.2 }}
            className="w-24 h-24 bg-sage rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-sage/30"
          >
            <HiCheck className="w-12 h-12 text-white" />
          </motion.div>
          <h2 className="font-display text-4xl font-bold text-slate-dark mb-2 italic">
            ¡Pedido Extraordinario!
          </h2>
          <p className="text-base text-slate-mid mb-8">{orderResult.message}</p>

          {/* TICKET DE COMPRA */}
          <div className="bg-white rounded-2xl border border-cream-300 shadow-xl overflow-hidden mb-8 text-left font-sans">
            <div className="bg-cream-100 p-6 border-b border-cream-300 flex justify-between items-center text-slate-dark relative overflow-hidden">
              <div className="absolute top-0 right-0 text-7xl opacity-5 -translate-y-4 translate-x-4">🌸</div>
              <div>
                <h3 className="font-bold text-lg">Ticket de Orden</h3>
                <p className="text-xs text-slate-mid tracking-tight">Fecha: {new Date(orderResult.createdAt).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-terracotta">{orderResult.orderNumber}</p>
                <span className="text-[10px] font-bold bg-sage text-white px-2 py-0.5 rounded uppercase tracking-widest">
                  {orderResult.status === 'CONFIRMED' ? 'APROBADA' : 'PENDIENTE'}
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {finalOrderInfo?.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm border-b border-dashed border-cream-200 pb-2 last:border-0">
                    <div className="flex-1">
                      <span className="font-bold text-slate-dark mr-2">{item.cantidad}x</span>
                      <span className="text-slate-mid">{item.nombre}</span>
                      {item.sabor && <div className="text-[11px] text-slate-light ml-6 italic">↳ Variedad: {item.sabor}</div>}
                    </div>
                    <div className="font-bold text-slate-dark">
                      ${(item.precioUnitario * item.cantidad).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-fuchsia-50/10 p-6 border-t border-cream-300">
              <div className="flex justify-between text-sm mb-2 text-slate-mid italic">
                <span>Método de Pago:</span>
                <span className="font-semibold">{orderResult.metodoPago}</span>
              </div>
              <div className="flex justify-between items-end border-t border-slate-200 pt-4 mt-2">
                <span className="text-xs font-bold uppercase text-slate-dark tracking-widest">Total Pagado:</span>
                <span className="text-3xl font-black text-terracotta">${Number(orderResult.total).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/mis-pedidos"
              className="inline-flex items-center gap-2 bg-sage text-white px-8 py-4 rounded-xl
                       font-semibold shadow-lg hover:shadow-xl hover:bg-sage-dark transition-all duration-300 w-full sm:w-auto"
            >
              Ver Mis Pedidos
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-slate-dark text-white px-8 py-4 rounded-xl
                       font-semibold shadow-lg hover:shadow-xl hover:bg-slate-mid transition-all duration-300 w-full sm:w-auto"
            >
              Volver a la Tienda
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        userId: user.userId,
        customerName: form.name,
        customerEmail: form.email || null,
        customerPhone: form.phone || null,
        metodoPago,
        notas: form.notas || null,
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          cantidad: item.cantidad,
        })),
      };
      
      const token = localStorage.getItem('token');
      const result = await processCheckout(payload, token);

      // Guardar informacion temporal para el ticket
      setFinalOrderInfo({
        items: [...items],
        totalPrice
      });

      setOrderResult(result);
      clearCart();
      // Forzar scroll al inicio para ver el ticket de éxito
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Error al procesar la compra';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        to="/catalogo"
        className="inline-flex items-center gap-2 text-sm text-slate-mid hover:text-terracotta
                 transition-colors duration-200 mb-6"
      >
        <HiArrowLeft className="w-4 h-4" /> Seguir comprando
      </Link>

      <h1 className="font-display text-3xl font-bold text-slate-dark mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* LEFT: Form */}
        <div className="lg:col-span-3 space-y-6">
          {/* Payment Method */}
          <div className="bg-white rounded-2xl border border-cream-300 p-6 shadow-sm">
            <h3 className="font-display text-lg font-semibold text-slate-dark mb-4">
              Método de Pago
            </h3>
            <div className="space-y-3">
              {PAYMENT_METHODS.map((pm) => (
                <motion.button
                  key={pm.id}
                  whileHover={!pm.disabled ? { scale: 1.01 } : {}}
                  onClick={() => !pm.disabled && setMetodoPago(pm.id)}
                  disabled={pm.disabled}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left
                    ${pm.disabled ? 'opacity-50 cursor-not-allowed border-cream-300' : ''}
                    ${metodoPago === pm.id && !pm.disabled
                      ? 'border-terracotta bg-terracotta/5 shadow-sm'
                      : 'border-cream-300 hover:border-cream-400'
                    }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                    ${metodoPago === pm.id ? 'bg-terracotta text-white' : 'bg-cream-200 text-slate-mid'}`}>
                    <pm.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-dark">{pm.label}</p>
                    <p className="text-xs text-slate-mid">{pm.desc}</p>
                  </div>
                  {metodoPago === pm.id && !pm.disabled && (
                    <div className="w-5 h-5 rounded-full bg-terracotta flex items-center justify-center">
                      <HiCheck className="w-3 h-3 text-white" />
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-2xl border border-cream-300 p-6 shadow-sm">
            <h3 className="font-display text-lg font-semibold text-slate-dark mb-4">
              Datos del Cliente
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={form.name}
                  readOnly={!!user}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Tu nombre completo"
                  className={`w-full px-4 py-3 border border-cream-300 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta ${
                    user ? 'bg-cream-200 text-slate-mid cursor-not-allowed' : 'bg-cream-50 text-slate-dark placeholder-slate-light'
                  }`}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    readOnly={!!user}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="correo@ejemplo.com"
                    className={`w-full px-4 py-3 border border-cream-300 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta ${
                      user ? 'bg-cream-200 text-slate-mid cursor-not-allowed' : 'bg-cream-50 text-slate-dark placeholder-slate-light'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    readOnly={!!user}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="55 1234 5678"
                    className={`w-full px-4 py-3 border border-cream-300 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta ${
                      user ? 'bg-cream-200 text-slate-mid cursor-not-allowed' : 'bg-cream-50 text-slate-dark placeholder-slate-light'
                    }`}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-1">
                  Notas
                </label>
                <textarea
                  value={form.notas}
                  onChange={(e) => setForm({ ...form, notas: e.target.value })}
                  placeholder="Instrucciones especiales para tu pedido..."
                  rows={3}
                  className="w-full px-4 py-3 bg-cream-50 border border-cream-300 rounded-xl text-sm
                           text-slate-dark placeholder-slate-light resize-none
                           focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta
                           transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-warmred/10 border border-warmred/20 text-warmred text-sm p-4 rounded-xl"
            >
              {error}
            </motion.div>
          )}
        </div>

        {/* RIGHT: Order Summary */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 bg-white rounded-2xl border border-cream-300 p-6 shadow-sm">
            <h3 className="font-display text-lg font-semibold text-slate-dark mb-4">
              Resumen del Pedido
            </h3>

            <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
              {items.map((item) => (
                <div key={item.key} className="flex justify-between text-sm">
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-dark truncate">{item.nombre}</p>
                    <p className="text-[11px] text-slate-light">
                      {item.sabor && `${item.sabor} • `}x{item.cantidad}
                    </p>
                  </div>
                  <span className="font-semibold text-slate-dark ml-2">
                    ${(item.precioUnitario * item.cantidad).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-cream-300 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-slate-mid">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-mid">
                <span>Envío</span>
                <span className="text-sage font-medium">Gratis (recoger)</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-slate-dark pt-2 border-t border-cream-300">
                <span>Total</span>
                <span className="text-terracotta">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-cream-50 rounded-xl border border-cream-200 flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 w-5 h-5 text-terracotta border-cream-300 rounded focus:ring-terracotta cursor-pointer"
              />
              <label htmlFor="terms" className="text-sm text-slate-mid cursor-pointer select-none">
                He leído y acepto los <button type="button" onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }} className="text-terracotta font-semibold hover:underline">Términos y Condiciones</button> para proceder con la compra.
              </label>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={!form.name || !termsAccepted || submitting}
              className="w-full mt-4 py-3.5 bg-terracotta text-white font-semibold rounded-xl
                       hover:bg-terracotta-dark transition-all shadow-lg hover:shadow-xl
                       disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <HiCheck className="w-5 h-5" />
                  Confirmar Pedido
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      <LegalModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        type="terms_and_conditions"
        title="Términos y Condiciones"
      />
    </div>
  );
}
