import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiMinus, HiPlus, HiTrash, HiShoppingCart } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function CartDrawer() {
  const navigate = useNavigate();
  const {
    items,
    isOpen,
    closeCart,
    totalItems,
    totalPrice,
    updateCantidad,
    removeItem,
    clearCart,
  } = useCart();

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-white z-50 shadow-2xl
                     flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-cream-300">
              <div className="flex items-center gap-2">
                <HiShoppingCart className="w-5 h-5 text-terracotta" />
                <h2 className="font-display text-lg font-semibold text-slate-dark">
                  Tu Carrito
                </h2>
                <span className="text-xs bg-terracotta/10 text-terracotta px-2 py-0.5 rounded-full font-semibold">
                  {totalItems}
                </span>
              </div>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-cream-200 rounded-xl transition-colors"
              >
                <HiX className="w-5 h-5 text-slate-dark" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">🛒</div>
                  <p className="text-sm text-slate-mid">Tu carrito está vacío</p>
                  <button
                    onClick={closeCart}
                    className="mt-4 text-sm text-terracotta hover:underline"
                  >
                    Continuar comprando
                  </button>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.div
                      key={item.key}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0 }}
                      className="flex gap-4 bg-cream-50 rounded-xl p-3 border border-cream-300"
                    >
                      {/* Thumbnail */}
                      <div className="w-16 h-16 rounded-lg bg-cream-200 flex items-center justify-center shrink-0 text-2xl">
                        {item.imagenUrl ? (
                          <img src={item.imagenUrl} alt="" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          '📦'
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-slate-dark truncate">
                          {item.nombre}
                        </h4>
                        <p className="text-[11px] text-slate-mid">
                          {item.marca}
                          {item.sabor && ` • ${item.sabor}`}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center bg-white rounded-lg border border-cream-300">
                            <button
                              onClick={() => updateCantidad(item.key, item.cantidad - 1)}
                              className="p-1.5 hover:bg-cream-100 rounded-l-lg transition-colors"
                            >
                              <HiMinus className="w-3 h-3" />
                            </button>
                            <span className="px-3 text-xs font-semibold">{item.cantidad}</span>
                            <button
                              onClick={() => updateCantidad(item.key, item.cantidad + 1)}
                              className="p-1.5 hover:bg-cream-100 rounded-r-lg transition-colors"
                            >
                              <HiPlus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="text-sm font-bold text-terracotta">
                            ${(item.precioUnitario * item.cantidad).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.key)}
                        className="self-start p-1 hover:bg-warmred/10 rounded-lg transition-colors"
                      >
                        <HiTrash className="w-4 h-4 text-warmred" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-cream-300 p-5 space-y-4 bg-white">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-mid">Total</span>
                  <span className="text-2xl font-bold text-slate-dark">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  className="w-full py-3.5 bg-terracotta text-white font-semibold rounded-xl
                           hover:bg-terracotta-dark transition-colors shadow-lg hover:shadow-xl"
                >
                  Ir al Checkout
                </motion.button>

                <button
                  onClick={clearCart}
                  className="w-full py-2 text-xs text-warmred hover:bg-warmred/5 rounded-xl transition-colors"
                >
                  Vaciar carrito
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
