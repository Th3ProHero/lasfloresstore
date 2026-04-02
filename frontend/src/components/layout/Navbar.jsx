import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { HiShoppingCart, HiMenu, HiX, HiUser, HiOutlineLogout, HiOutlineShoppingBag, HiOutlinePencilAlt } from 'react-icons/hi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import EditProfileModal from '../ui/EditProfileModal';

export default function Navbar() {
  const { totalItems, toggleCart } = useCart();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: 'Inicio' },
    { to: '/catalogo', label: 'Catálogo' },
    { to: '/pedidos-especiales', label: '🎉 Pedidos Especiales' },
    { to: '/nosotros', label: '🌸 Nosotros' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-cream-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-terracotta flex items-center justify-center text-white font-display font-bold text-lg
                          group-hover:bg-terracotta-dark transition-colors duration-300 relative">
              <span className="z-10">F</span>
              <span className="absolute -top-1.5 -right-1.5 text-sm transform rotate-12 group-hover:rotate-45 transition-transform duration-300">🌸</span>
              <span className="absolute -bottom-1 -left-1 text-[10px] transform -rotate-12 group-hover:-rotate-45 transition-transform duration-300">🌿</span>
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

          {/* Icons Context Data */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* User Icon / Dropdown */}
            {user ? (
              <Menu as="div" className="relative inline-block text-left z-50">
                <Menu.Button className="relative p-2 rounded-xl hover:bg-cream-200 transition-colors duration-200 group flex items-center justify-center">
                  <div className="relative">
                    <HiUser className="w-6 h-6 text-slate-dark group-hover:text-terracotta transition-colors" />
                    <span className="absolute -top-2 -right-2 text-sm drop-shadow-sm transition-transform duration-300 group-hover:rotate-45 group-hover:scale-110">🌸</span>
                  </div>
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-cream-200 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-4 py-3">
                      <p className="text-sm text-slate-mid">Bienvenido,</p>
                      <p className="text-sm font-bold text-slate-dark truncate">
                        {user.username ? (user.username.length > 8 ? user.username.substring(0, 8) + '...' : user.username) : 'Usuario'}
                      </p>
                    </div>
                    <div className="px-1 py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/mis-pedidos"
                            className={`${active ? 'bg-cream-100 text-terracotta' : 'text-slate-dark'} group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium transition-colors`}
                          >
                            <HiOutlineShoppingBag className="mr-2 h-5 w-5" aria-hidden="true" />
                            Mis Pedidos
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => setIsProfileOpen(true)}
                            className={`${active ? 'bg-cream-100 text-terracotta' : 'text-slate-dark'} group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium transition-colors`}
                          >
                            <HiOutlinePencilAlt className="mr-2 h-5 w-5" aria-hidden="true" />
                            Editar Perfil
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                    <div className="px-1 py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={`${active ? 'bg-warmred/10 text-warmred' : 'text-slate-mid'} group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium transition-colors`}
                          >
                            <HiOutlineLogout className="mr-2 h-5 w-5" aria-hidden="true" />
                            Cerrar Sesión
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <Link
                to="/login"
                className="relative p-2 rounded-xl hover:bg-cream-200 transition-colors duration-200 group flex items-center justify-center"
                title="Iniciar Sesión"
              >
                <div className="relative">
                  <HiUser className="w-6 h-6 text-slate-dark group-hover:text-terracotta transition-colors" />
                  <span className="absolute -top-2 -right-2 text-sm drop-shadow-sm transition-transform duration-300 group-hover:rotate-45 group-hover:scale-110">🌸</span>
                </div>
              </Link>
            )}

            {/* Cart toggle */}
            <button
              id="cart-toggle"
              aria-label="Abrir carrito"
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
              aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
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
      <EditProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </nav>
  );
}
