import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiArrowLeft, HiCheck, HiPlusSm, HiMinusSm, HiInformationCircle, HiX } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { getProductosEspeciales, processCheckout } from '../api/client';
import FlowerExplosion from '../components/ui/FlowerExplosion';
import LegalModal from '../components/ui/LegalModal';

// ── Policy banners ────────────────────────────────
const POLICIES = [
  { icon: '📅', title: '2 días mínimos', desc: 'Para confirmar disponibilidad en sucursal.' },
  { icon: '🚚', title: '5 días mínimos', desc: 'Para garantizar entrega completa del pedido.' },
  { icon: '💵', title: 'Pago en efectivo', desc: 'Confirma y paga en la sucursal.' },
  { icon: '↩️', title: 'Reembolso parcial', desc: 'Si un artículo no está disponible, se reembolsa el importe.' },
];

export default function SpecialOrderPage() {
  const { user } = useAuth();
  const { clearCart, totalItems: globalCartItems } = useCart();
  const navigate = useNavigate();
  const [cartWasCleared, setCartWasCleared] = useState(false);

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [cart, setCart] = useState({}); // { productId: { qty, variantId } }

  const [form, setForm] = useState({
    name: user?.username || '',
    email: user?.correo || '',
    phone: user?.celular || '',
    fechaEvento: '',
    cantidadPersonas: '',
    notas: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [error, setError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Autocomplete when user logs in
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        name: user.username || prev.name,
        email: user.correo || prev.email,
        phone: user.celular || prev.phone,
      }));
    }
  }, [user]);

  // Load especial products
  useEffect(() => {
    getProductosEspeciales()
      .then(data => setProducts(data.content || data))
      .catch(console.error)
      .finally(() => setLoadingProducts(false));
  }, []);

  // Clear the global cart on mount — special orders are a completely separate flow.
  // If the user had items in the regular cart we clear them to avoid a
  // mixed-checkout situation and show a dismissible notice.
  useEffect(() => {
    if (globalCartItems > 0) {
      clearCart();
      setCartWasCleared(true);
    }
    // intentionally run only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalItems = Object.values(cart).reduce((s, v) => s + (v.qty || 0), 0);
  const totalPrice = Object.entries(cart).reduce((sum, [pid, v]) => {
    const p = products.find(pr => pr.id === Number(pid));
    return sum + (p ? p.precioFinal * (v.qty || 0) : 0);
  }, 0);

  const setQty = (productId, qty) => {
    if (qty <= 0) {
      setCart(prev => { const n = { ...prev }; delete n[productId]; return n; });
    } else {
      setCart(prev => ({ ...prev, [productId]: { ...prev[productId], qty } }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (totalItems === 0) { setError('Agrega al menos un artículo al pedido.'); return; }
    if (!form.fechaEvento) { setError('Indica la fecha del evento.'); return; }
    if (!termsAccepted) { setError('Debes aceptar los Términos y Condiciones para continuar.'); return; }
    if (!user) { navigate('/login'); return; }

    setSubmitting(true);
    setError('');
    try {
      const items = Object.entries(cart).map(([pid, v]) => ({
        productId: Number(pid),
        variantId: v.variantId || null,
        cantidad: v.qty,
      }));

      const payload = {
        userId: user.userId,
        customerName: form.name,
        customerEmail: form.email,
        customerPhone: form.phone || null,
        metodoPago: 'EFECTIVO',
        notas: form.notas || null,
        tipoOrden: 'ESPECIAL',
        fechaEvento: form.fechaEvento,
        cantidadPersonas: form.cantidadPersonas ? Number(form.cantidadPersonas) : null,
        items,
      };

      const result = await processCheckout(payload);
      setOrderResult(result);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Error al enviar la solicitud.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success screen ─────────────────────────────
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
            className="w-24 h-24 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-500/30"
          >
            <span className="text-4xl">🎉</span>
          </motion.div>

          <h2 className="font-display text-4xl font-bold text-slate-dark mb-3 italic">¡Solicitud Enviada!</h2>
          <p className="text-base text-slate-mid mb-3">{orderResult.message}</p>
          <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 p-3 rounded-xl mb-8">
            Folio: <strong>{orderResult.orderNumber}</strong> · Acude a la sucursal para confirmar tu pedido y pagar en efectivo.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/mis-pedidos"
              className="inline-flex items-center justify-center gap-2 bg-amber-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:bg-amber-700 transition-all">
              Ver Mis Pedidos
            </Link>
            <Link to="/"
              className="inline-flex items-center justify-center gap-2 bg-slate-dark text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:bg-slate-mid transition-all">
              Volver al Inicio
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Back */}
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-mid hover:text-terracotta transition-colors mb-6">
        <HiArrowLeft className="w-4 h-4" /> Volver al inicio
      </Link>

      {/* Banner: global cart was auto-cleared */}
      <AnimatePresence>
        {cartWasCleared && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-start justify-between gap-3 bg-amber-50 border border-amber-300 rounded-2xl px-4 py-3 mb-6 text-sm text-amber-800"
          >
            <div className="flex items-start gap-2">
              <HiInformationCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600" />
              <p>
                <strong>Tu carrito regular fue vaciado.</strong> Los pedidos especiales son un proceso separado
                y no pueden combinarse con compras del catálogo. Si deseas hacer una compra normal,
                {' '}<Link to="/catalogo" className="underline font-semibold hover:text-amber-900">regresa al catálogo</Link>.
              </p>
            </div>
            <button
              onClick={() => setCartWasCleared(false)}
              className="flex-shrink-0 p-1 hover:bg-amber-100 rounded-lg transition-colors"
              aria-label="Cerrar aviso"
            >
              <HiX className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-800 via-amber-700 to-orange-600 text-white p-8 sm:p-12 mb-10 shadow-xl">
        <div className="absolute top-0 right-0 text-[160px] opacity-10 select-none leading-none -translate-y-8 translate-x-8">🎉</div>
        <div className="relative z-10">
          <span className="inline-block bg-white/20 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            Pedidos Especiales · Eventos
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-3 leading-tight">
            Grandes eventos,<br />grandes pedidos 🍺🥤
          </h1>
          <p className="text-white/80 text-base max-w-xl">
            Rejas de Coca-Cola, cartones de cerveza, refrescos fríos, hielo y más. Solicita con anticipación
            y garantizamos que llegue todo a tiempo.
          </p>
        </div>
      </div>

      {/* Policies */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {POLICIES.map((p, i) => (
          <div key={i} className="bg-white rounded-2xl border border-cream-300 p-4 shadow-sm text-center">
            <div className="text-3xl mb-2">{p.icon}</div>
            <p className="text-xs font-bold text-amber-800 mb-1">{p.title}</p>
            <p className="text-[11px] text-slate-mid">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* LEFT: Products + Form */}
        <div className="lg:col-span-3 space-y-6">

          {/* Products */}
          <div className="bg-white rounded-2xl border border-cream-300 p-6 shadow-sm">
            <h2 className="font-display text-lg font-bold text-slate-dark mb-5">
              Selecciona tus Artículos
            </h2>

            {loadingProducts ? (
              <div className="flex justify-center py-12">
                <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-10 text-slate-mid">
                <div className="text-5xl mb-3">📦</div>
                <p>No hay artículos especiales disponibles en este momento.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {products.map(product => {
                  const qty = cart[product.id]?.qty || 0;
                  return (
                    <div key={product.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${qty > 0 ? 'border-amber-400 bg-amber-50' : 'border-cream-300 hover:border-cream-400'}`}
                    >
                      {product.imagenUrl ? (
                        <img src={product.imagenUrl} alt={product.nombre}
                          className="w-14 h-14 object-cover rounded-xl flex-shrink-0" />
                      ) : (
                        <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                          🍺
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-dark text-sm">{product.nombre}</p>
                        <p className="text-xs text-slate-mid">{product.marca}</p>
                        {product.descripcion && (
                          <p className="text-[11px] text-slate-light mt-0.5 line-clamp-1">{product.descripcion}</p>
                        )}
                        <p className="text-sm font-bold text-amber-700 mt-1">
                          ${product.precioFinal.toFixed(2)}
                          {product.enOferta && <span className="ml-2 text-[10px] bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded font-bold">OFERTA</span>}
                        </p>
                      </div>

                      {/* Qty control */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={() => setQty(product.id, qty - 1)}
                          disabled={qty === 0}
                          className="w-8 h-8 rounded-full bg-cream-200 hover:bg-cream-300 flex items-center justify-center disabled:opacity-40 transition">
                          <HiMinusSm className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-bold text-slate-dark text-sm">{qty}</span>
                        <button onClick={() => setQty(product.id, qty + 1)}
                          className="w-8 h-8 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center transition">
                          <HiPlusSm className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-2xl border border-cream-300 p-6 shadow-sm space-y-4">
              <h2 className="font-display text-lg font-bold text-slate-dark">Datos del Evento</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-1">Fecha del Evento *</label>
                  <input type="date" required
                    min={new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0]}
                    value={form.fechaEvento}
                    onChange={e => setForm({ ...form, fechaEvento: e.target.value })}
                    className="w-full px-4 py-3 bg-cream-50 border border-cream-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition" />
                  <p className="text-[11px] text-slate-light mt-1 ml-1">Mínimo 2 días de anticipación.</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-1">Personas Aprox.</label>
                  <input type="number" min={1}
                    value={form.cantidadPersonas}
                    onChange={e => setForm({ ...form, cantidadPersonas: e.target.value })}
                    placeholder="Ej: 50"
                    className="w-full px-4 py-3 bg-cream-50 border border-cream-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition" />
                </div>
              </div>

              <h2 className="font-display text-lg font-bold text-slate-dark pt-2">Tus Datos</h2>

              <div>
                <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-1">Nombre Completo *</label>
                <input type="text" required
                  value={form.name}
                  readOnly={!!user}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className={`w-full px-4 py-3 border border-cream-300 rounded-xl text-sm transition focus:outline-none focus:ring-2 focus:ring-amber-400 ${user ? 'bg-cream-200 text-slate-mid cursor-not-allowed' : 'bg-cream-50'}`} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-1">Correo *</label>
                  <input type="email" required
                    value={form.email}
                    readOnly={!!user}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className={`w-full px-4 py-3 border border-cream-300 rounded-xl text-sm transition focus:outline-none focus:ring-2 focus:ring-amber-400 ${user ? 'bg-cream-200 text-slate-mid cursor-not-allowed' : 'bg-cream-50'}`} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-1">Teléfono</label>
                  <input type="tel"
                    value={form.phone}
                    readOnly={!!user}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="55 1234 5678"
                    className={`w-full px-4 py-3 border border-cream-300 rounded-xl text-sm transition focus:outline-none focus:ring-2 focus:ring-amber-400 ${user ? 'bg-cream-200 text-slate-mid cursor-not-allowed' : 'bg-cream-50'}`} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-mid uppercase tracking-wider mb-1">Notas / Instrucciones Especiales</label>
                <textarea rows={3}
                  value={form.notas}
                  onChange={e => setForm({ ...form, notas: e.target.value })}
                  placeholder="Ej: La mitad corona, la mitad victoria. Necesito hielo también..."
                  className="w-full px-4 py-3 bg-cream-50 border border-cream-300 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-400 transition" />
              </div>

              {!user && (
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 p-3 rounded-xl text-sm text-amber-800">
                  <HiInformationCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>
                    <Link to="/login" className="font-bold underline">Inicia sesión</Link> para autocompletar tus datos y hacer seguimiento de tu pedido.
                  </span>
                </div>
              )}

              {error && (
                <div className="bg-red-50 text-red-600 border border-red-100 p-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              {/* Terms */}
              <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 p-3 rounded-xl">
                <input
                  id="special-terms"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={e => setTermsAccepted(e.target.checked)}
                  className="mt-1 w-5 h-5 text-amber-600 border-cream-300 rounded focus:ring-amber-400 cursor-pointer flex-shrink-0"
                />
                <label htmlFor="special-terms" className="text-sm text-amber-800 cursor-pointer select-none">
                  He leído y acepto los{' '}
                  <button type="button" onClick={e => { e.preventDefault(); setShowTermsModal(true); }}
                    className="font-bold underline hover:text-amber-900">
                    Términos y Condiciones
                  </button>
                  {' '}<a href="/terminos" target="_blank" rel="noopener noreferrer"
                    className="text-xs text-amber-700 hover:underline">(ver página completa)</a>
                  {' '}para enviar este pedido especial.
                </label>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                disabled={submitting || totalItems === 0 || !termsAccepted}
                className="w-full py-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <><HiCheck className="w-5 h-5" /> Solicitar Pedido Especial</>
                )}
              </motion.button>
            </div>
          </form>
        </div>

        {/* RIGHT: Summary */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 bg-white rounded-2xl border border-cream-300 p-6 shadow-sm">
            <h3 className="font-display text-lg font-semibold text-slate-dark mb-4">Resumen</h3>

            {totalItems === 0 ? (
              <div className="text-center py-8 text-slate-light">
                <div className="text-4xl mb-2">🛒</div>
                <p className="text-sm">Selecciona artículos de la lista</p>
              </div>
            ) : (
              <AnimatePresence>
                {Object.entries(cart).map(([pid, v]) => {
                  const p = products.find(pr => pr.id === Number(pid));
                  if (!p || !v.qty) return null;
                  return (
                    <motion.div key={pid}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex justify-between text-sm py-2 border-b border-dashed border-cream-200 last:border-0"
                    >
                      <div>
                        <p className="text-slate-dark font-medium">{p.nombre}</p>
                        <p className="text-slate-light text-xs">x{v.qty}</p>
                      </div>
                      <span className="font-bold text-amber-700">${(p.precioFinal * v.qty).toFixed(2)}</span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}

            {totalItems > 0 && (
              <div className="border-t border-cream-300 pt-4 mt-2">
                <div className="flex justify-between text-lg font-bold text-slate-dark">
                  <span>Total Estimado</span>
                  <span className="text-amber-700">${totalPrice.toFixed(2)}</span>
                </div>
                <p className="text-[11px] text-slate-light mt-1">* El precio final puede variar según disponibilidad.</p>
              </div>
            )}

            <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 leading-relaxed">
              <strong>💵 Pago en efectivo</strong> en sucursal al confirmar el pedido. Sin cargos adicionales online.
            </div>
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
