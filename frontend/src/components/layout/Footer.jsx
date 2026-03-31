import { HiHeart } from 'react-icons/hi';

export default function Footer() {
  return (
    <footer className="bg-slate-dark text-cream-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-display text-2xl font-bold text-white mb-2">
              Las Flores
            </h3>
            <p className="text-sm text-cream-400 leading-relaxed">
              Tu tienda de abarrotes de confianza. Productos de calidad al mejor precio, 
              con entrega directa y atención personalizada.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display text-lg font-semibold text-white mb-3">Navegación</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-terracotta-light transition-colors">Inicio</a></li>
              <li><a href="/catalogo" className="hover:text-terracotta-light transition-colors">Catálogo</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold text-white mb-3">Contacto</h4>
            <ul className="space-y-2 text-sm text-cream-400">
              <li>📍 Tu colonia, Tu ciudad</li>
              <li>📞 (555) 123-4567</li>
              <li>📧 contacto@lasflores.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-light/20 mt-8 pt-6 text-center text-xs text-cream-400">
          <p className="flex items-center justify-center gap-1">
            © 2026 Abarrotes Las Flores — Hecho con 
            <HiHeart className="w-3 h-3 text-warmred" /> 
            en México
          </p>
        </div>
      </div>
    </footer>
  );
}
