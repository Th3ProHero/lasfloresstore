import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPackage, FiCalendar, FiDollarSign, FiClock, FiChevronRight, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const OrderHistoryPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8080/api/orders/user/${user.userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data);
      } catch (err) {
        setError('No pudimos cargar tus pedidos. Intenta más tarde.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.userId) {
      fetchOrders();
    }
  }, [user]);

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
        <header className="mb-12 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-serif text-[#4a5d4e] italic mb-4"
          >
            Mis Pedidos
          </motion.h1>
          <p className="text-gray-500 uppercase tracking-widest text-sm font-sans font-bold">Historial de tus compras</p>
          <div className="mt-4 w-24 h-1 bg-[#d4af37] mx-auto rounded-full opacity-50"></div>
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
          <div className="space-y-6">
            <AnimatePresence>
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-sm border border-[#e0d0b0]/20 hover:shadow-md transition-shadow overflow-hidden group"
                >
                  <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center flex-wrap gap-3">
                        <span className="text-lg font-bold text-[#4a5d4e] tracking-tight">{order.orderNumber}</span>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <FiCalendar className="mr-2 text-[#d4af37]" />
                          {new Date(order.createdAt).toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </div>
                        <div className="flex items-center">
                          <FiDollarSign className="mr-1 text-[#d4af37]" />
                          <span className="text-gray-900 font-bold font-sans">${order.total.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center italic">
                          {order.metodoPago}
                        </div>
                      </div>
                    </div>

                    <div className="md:border-l border-gray-100 md:pl-8 flex flex-col items-center justify-center min-w-[140px]">
                      <span className="text-xs text-gray-400 mb-2 uppercase font-bold tracking-tighter">Artículos</span>
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
                    </div>

                    <div className="flex items-center">
                      <button className="p-3 bg-gray-50 rounded-xl group-hover:bg-[#4a5d4e] group-hover:text-white transition-all text-[#4a5d4e]">
                        <FiChevronRight className="text-xl" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
