import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiShoppingCart, HiMenu, HiX } from 'react-icons/hi';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const { totalItems, toggleCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Inicio' },
    { to: '/catalogo', label: 'Catálogo' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-cream-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-terracotta flex items-center justify-center text-white font-display font-bold text-lg
                          group-hover:bg-terracotta-dark transition-colors duration-300">
              F
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display text-xl font-bold text-slate-dark leading-tight">
                Las Flores
              </h1>
              <p className="text-[10px] text-slate-mid tracking-widest uppercase -mt-1">
                Abarrotes
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="relative text-sm font-medium text-slate-mid hover:text-terracotta transition-colors duration-200
                         after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5
                         after:bg-terracotta after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Cart + Mobile */}
          <div className="flex items-center gap-4">
            <button
              id="cart-toggle"
              onClick={toggleCart}
              className="relative p-2 rounded-xl hover:bg-cream-200 transition-colors duration-200 group"
            >
              <HiShoppingCart className="w-6 h-6 text-slate-dark group-hover:text-terracotta transition-colors" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 bg-warmred text-white text-[10px] font-bold
                             w-5 h-5 rounded-full flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-xl hover:bg-cream-200 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <HiX className="w-6 h-6 text-slate-dark" />
              ) : (
                <HiMenu className="w-6 h-6 text-slate-dark" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t border-cream-300"
            >
              <div className="py-3 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className="block py-2 px-3 rounded-lg text-sm font-medium text-slate-mid
                             hover:bg-cream-200 hover:text-terracotta transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
