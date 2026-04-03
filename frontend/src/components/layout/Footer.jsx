import { Link } from 'react-router-dom';
import { HiLocationMarker, HiClock, HiPhone } from 'react-icons/hi';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-dark text-white">
      {/* Main grid */}
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-3xl">🌸</span>
            <span className="font-display text-xl font-bold text-cream-100">Las Flores</span>
          </div>
          <p className="text-cream-400 text-sm leading-relaxed">
            Más de 25 años siendo tu tienda de confianza en Palmitas, Iztapalapa.
            Familia, precio y buen servicio.
          </p>
          <a
            href="https://wa.me/525560678528?text=Hola%2C+vengo+desde+abarroteslasflores.com"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 bg-[#25D366] hover:bg-[#1ebe5d] text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
            WhatsApp
          </a>
        </div>

        {/* Info */}
        <div>
          <h3 className="font-display font-bold text-cream-100 uppercase tracking-wider text-xs mb-4">Visítanos</h3>
          <ul className="space-y-3 text-sm text-cream-400">
            <li className="flex items-start gap-2">
              <HiLocationMarker className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
              <div>
                <p>Niños Héroes 29, Palmitas</p>
                <p>Iztapalapa, 09670 CDMX</p>
                <a href="https://maps.app.goo.gl/A9VD57MSLLxHdjFK9"
                  target="_blank" rel="noopener noreferrer"
                  className="text-terracotta-light hover:underline text-xs mt-0.5 inline-block">
                  Ver en Google Maps →
                </a>
              </div>
            </li>
            <li className="flex items-center gap-2">
              <HiClock className="w-5 h-5 text-sage flex-shrink-0" />
              <span>Lun – Dom: <strong className="text-cream-100">9:00 AM – 9:30 PM</strong></span>
            </li>
            <li className="flex items-center gap-2">
              <HiPhone className="w-5 h-5 text-terracotta flex-shrink-0" />
              <a href="https://wa.me/525560678528" className="hover:text-cream-100 transition-colors">
                55 6067 8528
              </a>
            </li>
          </ul>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-display font-bold text-cream-100 uppercase tracking-wider text-xs mb-4">Tienda</h3>
          <ul className="space-y-2 text-sm text-cream-400">
            <li><Link to="/" className="hover:text-cream-100 transition-colors">🏠 Inicio</Link></li>
            <li><Link to="/catalogo" className="hover:text-cream-100 transition-colors">🛍️ Catálogo</Link></li>
            <li><Link to="/pedidos-especiales" className="hover:text-cream-100 transition-colors">🎉 Pedidos Especiales</Link></li>
            <li><Link to="/nosotros" className="hover:text-cream-100 transition-colors">🌸 Nosotros</Link></li>
          </ul>
          <h3 className="font-display font-bold text-cream-100 uppercase tracking-wider text-xs mt-6 mb-3">Legal</h3>
          <ul className="space-y-2 text-sm text-cream-400">
            <li><Link to="/privacidad" className="hover:text-cream-100 transition-colors">🔒 Aviso de Privacidad</Link></li>
            <li><Link to="/terminos" className="hover:text-cream-100 transition-colors">📄 Términos y Condiciones</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 px-6 py-4 space-y-1">
        <p className="text-center text-xs text-cream-400">
          🌸 © {year} Abarrotes Las Flores. Todos los derechos reservados. Hecho con ❤️ en Iztapalapa, CDMX.
        </p>
        <p className="text-center text-[11px] text-white/30 tracking-wide">
          {'</>'}  Página desarrollada por{' '}
          <span className="text-white/50 font-medium">Mauricio Bautista Flores</span>
        </p>
      </div>
    </footer>
  );
}
