import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiArrowLeft, HiCreditCard, HiCash, HiOfficeBuilding, HiCheck } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { processCheckout } from '../api/client';

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
  const [step, setStep] = useState(1); // 1: review, 2: info, 3: confirm
  const [metodoPago, setMetodoPago] = useState('EFECTIVO');
  const [form, setForm] = useState({ name: '', email: '', phone: '', notas: '' });
  const [submitting, setSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [error, setError] = useState(null);

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
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto px-4 py-16 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-20 h-20 bg-sage/20 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <HiCheck className="w-10 h-10 text-sage" />
        </motion.div>
        <h2 className="font-display text-3xl font-bold text-slate-dark mb-2">
          ¡Pedido Realizado!
        </h2>
        <p className="text-sm text-slate-mid mb-6">{orderResult.message}</p>
        <div className="bg-white rounded-2xl border border-cream-300 p-6 mb-6 text-left space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-mid">Orden #</span>
            <span className="font-semibold text-slate-dark">{orderResult.orderId}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-mid">Total</span>
            <span className="font-bold text-terracotta text-lg">${Number(orderResult.total).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-mid">Método de pago</span>
            <span className="font-semibold text-slate-dark">{orderResult.metodoPago}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-mid">Estado</span>
            <span className={`font-semibold ${orderResult.status === 'CONFIRMED' ? 'text-sage' : 'text-gold'}`}>
              {orderResult.status === 'CONFIRMED' ? 'Confirmado' : 'Pendiente'}
            </span>
          </div>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-terracotta text-white px-6 py-3 rounded-xl
                   font-semibold text-sm hover:bg-terracotta-dark transition-colors"
        >
          Volver al Inicio
        </Link>
      </motion.div>
    );
  }

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
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
      const result = await processCheckout(payload);
      setOrderResult(result);
      clearCart();
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
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Tu nombre completo"
                  className="w-full px-4 py-3 bg-cream-50 border border-cream-300 rounded-xl text-sm
                           text-slate-dark placeholder-slate-light
                           focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta
                           transition-all duration-200"
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
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="correo@ejemplo.com"
                    className="w-full px-4 py-3 bg-cream-50 border border-cream-300 rounded-xl text-sm
                             text-slate-dark placeholder-slate-light
                             focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta
                             transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="55 1234 5678"
                    className="w-full px-4 py-3 bg-cream-50 border border-cream-300 rounded-xl text-sm
                             text-slate-dark placeholder-slate-light
                             focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta
                             transition-all duration-200"
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

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={!form.name || submitting}
              className="w-full mt-6 py-3.5 bg-terracotta text-white font-semibold rounded-xl
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
    </div>
  );
}
