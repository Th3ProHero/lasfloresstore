import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPackage, FiCalendar, FiDollarSign, FiClock, FiChevronRight, FiCheckCircle, FiAlertCircle, FiRefreshCw, FiX, FiShoppingCart, FiSlash } from 'react-icons/fi';
import { getUserOrders, cancelOrder } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const OrderHistoryPage = () => {
  const { user } = useAuth();
  const { addItem } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchOrders = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    setError('');
    try {
      const data = await getUserOrders(user.userId);
      setOrders(data);
    } catch (err) {
      const status = err?.response?.status;
      const detail = err?.response?.data?.message || err?.response?.data?.error || err?.message || 'Error desconocido';
      console.error('[OrderHistoryPage] Error al cargar pedidos:', { status, detail, fullError: err });
      setError(`Error ${status || ''}: ${detail}`.trim());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    if (user?.userId) fetchOrders();
  }, [user, fetchOrders]);

  /** Re-add all items from a completed/delivered order to cart.
   *  Special orders redirect to the special-order page instead. */
  const handleReorder = (order) => {
    if (!order.items?.length) return;

    // If it was a special order, send to the special order page
    if (order.tipoOrden === 'ESPECIAL') {
      if (window.confirm('Este era un pedido especial. ¿Quieres ir a la página de Pedidos Especiales para crear uno nuevo?')) {
        navigate('/pedidos-especiales');
      }
      return;
    }

    // Regular order — add all items to the global cart
    order.items.forEach(item => {
      addItem({
        id: item.productId || item.id,
        nombre: item.productName,
        precio: item.unitPrice,
        imagenUrl: null,
      }, item.cantidad, item.variantSabor || null);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    alert(`✅ Se agregaron ${order.items.length} producto(s) al carrito.`);
  };

  /** Cancel an order within the 1-hour window */
  const handleCancel = async (order) => {
    const confirmed = window.confirm(
      `¿Cancelar el pedido ${order.orderNumber || '#' + order.id}?\n\nEsta acción es definitiva. Recibirás un correo de confirmación.`
    );
    if (!confirmed) return;
    setCancellingId(order.id);
    try {
      await cancelOrder(order.id, user.userId);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'No se pudo cancelar el pedido.');
    } finally {
      setCancellingId(null);
    }
  };

  const canCancel = (order) => {
    const CANCELLABLE = ['PENDING', 'AWAITING_CONFIRMATION'];
    if (!CANCELLABLE.includes(order.status)) return false;
    const created = new Date(order.createdAt);
    const diffMs = Date.now() - created.getTime();
    return diffMs < 60 * 60 * 1000; // 1 hour
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'DELIVERED': return 'bg-green-100 text-green-700 border-green-200';
      case 'PENDING': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'DELIVERED': return <FiCheckCircle className="mr-1" />;
      case 'PENDING': return <FiClock className="mr-1" />;
      case 'CANCELLED': return <FiAlertCircle className="mr-1" />;
      default: return <FiPackage className="mr-1" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdfcf8] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#4a5d4e]/10 border-t-[#4a5d4e] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfcf8] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 text-center relative">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-serif text-[#4a5d4e] italic mb-4"
          >
            Mis Pedidos
          </motion.h1>
          <p className="text-gray-500 uppercase tracking-widest text-sm font-sans font-bold">Historial de tus compras</p>
          <div className="mt-4 w-24 h-1 bg-[#d4af37] mx-auto rounded-full opacity-50"></div>
          <button
            onClick={() => fetchOrders(true)}
            disabled={refreshing}
            className="absolute right-0 top-0 flex items-center gap-2 text-xs font-bold text-[#4a5d4e] bg-white border border-[#e0d0b0] rounded-xl px-3 py-2 hover:bg-[#f4efdf] transition-all disabled:opacity-50"
          >
            <FiRefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Actualizando...' : 'Actualizar'}
          </button>
        </header>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center mb-8 border border-red-100 font-sans tracking-wide">
            {error}
          </div>
        )}

        {orders.length === 0 && !error ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white rounded-3xl shadow-sm border border-[#e0d0b0]/30"
          >
            <FiPackage className="text-6xl text-gray-200 mx-auto mb-6" />
            <h3 className="text-2xl font-serif text-gray-400">Aún no has realizado pedidos</h3>
            <p className="mt-4 text-gray-500">¿Qué tal si exploras nuestro catálogo hoy?</p>
            <a href="/catalogo" className="mt-8 inline-block px-8 py-3 bg-[#4a5d4e] text-white rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-[#3d4d41] transition-all shadow-lg shadow-[#4a5d4e]/10">
              Ir al Catálogo
            </a>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {orders.map((order, index) => {
                const isOpen = expandedId === order.id;
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.07 }}
                    className="bg-white rounded-2xl shadow-sm border border-[#e0d0b0]/20 hover:shadow-md transition-shadow overflow-hidden"
                  >
                    {/* ─ Card Header (always visible, clickable) ─ */}
                    <button
                      className="w-full text-left p-6 md:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                      onClick={() => setExpandedId(isOpen ? null : order.id)}
                    >
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center flex-wrap gap-3">
                          <span className="text-lg font-bold text-[#4a5d4e] tracking-tight">{order.orderNumber}</span>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {order.status === 'CONFIRMED' ? 'Confirmado'
                              : order.status === 'PENDING' ? 'Pendiente'
                              : order.status === 'DELIVERED' ? 'Entregado'
                              : order.status === 'CANCELLED' ? 'Cancelado' : order.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-gray-500">
                          <div className="flex items-center">
                            <FiCalendar className="mr-2 text-[#d4af37]" />
                            {new Date(order.createdAt).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </div>
                          <div className="flex items-center">
                            <FiDollarSign className="mr-1 text-[#d4af37]" />
                            <span className="text-gray-900 font-bold">${order.total.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center italic">{order.metodoPago}</div>
                        </div>
                      </div>

                      {/* Avatars de productos */}
                      <div className="flex items-center gap-4">
                        <div className="flex -space-x-2">
                          {order.items.slice(0, 3).map((item, i) => (
                            <div key={i} className="w-8 h-8 rounded-full bg-[#f4efdf] border-2 border-white flex items-center justify-center text-[10px] font-bold text-[#4a5d4e]">
                              {item.productName.charAt(0)}
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <div className="w-8 h-8 rounded-full bg-gray-50 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-400">
                              +{order.items.length - 3}
                            </div>
                          )}
                        </div>
                        <div className={`p-2 rounded-xl transition-all duration-300 ${isOpen ? 'bg-[#4a5d4e] text-white rotate-90' : 'bg-gray-50 text-[#4a5d4e] group-hover:bg-[#4a5d4e] group-hover:text-white'}`}>
                          <FiChevronRight className="text-lg" />
                        </div>
                      </div>
                    </button>

                    {/* ─ Expandable detail ─ */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          key="detail"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-[#e0d0b0]/40 mx-6 md:mx-8 pt-5 pb-6 space-y-4">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Artículos del pedido</p>
                            <div className="space-y-2">
                              {order.items.map((item, i) => (
                                <div key={i} className="flex items-center justify-between text-sm py-2 border-b border-dashed border-gray-100 last:border-0">
                                  <div>
                                    <span className="font-semibold text-[#4a5d4e] mr-2">{item.cantidad}x</span>
                                    <span className="text-gray-700">{item.productName}</span>
                                    {item.variantSabor && (
                                      <span className="ml-2 text-[11px] italic text-gray-400">({item.variantSabor})</span>
                                    )}
                                  </div>
                                  <span className="font-bold text-gray-800">${(item.precioUnitario * item.cantidad).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                            {order.notas && (
                              <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-sm text-amber-800 italic">
                                <span className="font-semibold not-italic">📝 Notas: </span>{order.notas}
                              </div>
                            )}

                            {/* ─ Action Buttons ─ */}
                            <div className="flex flex-wrap gap-2 pt-2">
                              {/* Volver a pedir: solo COMPLETED o DELIVERED */}
                              {['COMPLETED', 'DELIVERED'].includes(order.status) && (
                                <button
                                  onClick={() => handleReorder(order)}
                                  className="flex items-center gap-2 px-4 py-2 bg-sage/10 hover:bg-sage/20 text-sage border border-sage/20 rounded-xl text-sm font-bold transition-colors"
                                >
                                  <FiShoppingCart className="w-4 h-4" />
                                  🔄 Volver a Pedir
                                </button>
                              )}
                              {/* Cancelar: solo dentro de 1 hora */}
                              {canCancel(order) && (
                                <button
                                  onClick={() => handleCancel(order)}
                                  disabled={cancellingId === order.id}
                                  className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-sm font-bold transition-colors disabled:opacity-50"
                                >
                                  <FiX className="w-4 h-4" />
                                  {cancellingId === order.id ? 'Cancelando...' : '❌ Cancelar Pedido'}
                                </button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
