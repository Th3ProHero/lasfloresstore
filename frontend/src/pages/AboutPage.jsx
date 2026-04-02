import { motion } from 'framer-motion';
import { HiLocationMarker, HiPhone, HiClock, HiHeart } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const VALUES = [
  { icon: '🏡', title: 'Negocio Familiar', desc: 'Somos una familia que trabaja unida para darte siempre lo mejor. Aquí cada cliente es un vecino más.' },
  { icon: '💰', title: 'Los Mejores Precios', desc: 'Buscamos y negociamos los precios más accesibles para que tu dinero alcance más en cada visita.' },
  { icon: '🇲🇽', title: '100% Mexicano', desc: 'Apoyamos productos nacionales y proveedores locales. Lo hecho en México, primero en Las Flores.' },
  { icon: '❤️', title: '25+ Años de Servicio', desc: 'Desde hace más de 25 años somos parte de la colonia Palmitas. Crecimos contigo y seguimos aquí.' },
];

export default function AboutPage() {
  return (
    <div className="bg-cream-50 min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-terracotta to-terracotta-dark py-24 px-4">
        <div className="absolute inset-0 pointer-events-none select-none">
          {['🌸','🌼','🌺','🌷','💐'].map((f, i) => (
            <motion.span key={i} className="absolute text-5xl opacity-10"
              style={{ left: `${5 + i * 20}%`, top: `${15 + (i % 2) * 40}%` }}
              animate={{ y: [0,-15,0], rotate: [0, i%2===0?10:-10,0] }}
              transition={{ duration: 3+i*.5, repeat:Infinity, ease:'easeInOut' }}
            >{f}</motion.span>
          ))}
        </div>
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="relative max-w-3xl mx-auto text-center">
          <span className="text-6xl mb-4 inline-block">🌸</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">Abarrotes Las Flores</h1>
          <p className="text-xl text-white/80 font-light">Más de 25 años siendo parte de tu familia</p>
        </motion.div>
      </div>

      {/* Story */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1}}
          className="bg-white rounded-3xl shadow-sm border border-cream-200 p-8 md:p-12 mb-12">
          <h2 className="font-display text-3xl font-bold text-slate-dark mb-6">Nuestra Historia 📖</h2>
          <div className="prose text-slate-mid leading-relaxed space-y-4 text-base">
            <p>
              Hace más de <strong>25 años</strong>, en el corazón de la colonia <strong>Palmitas, Iztapalapa</strong>,
              abrimos las puertas de <em>Abarrotes Las Flores</em> con un sueño sencillo: ser la tienda de confianza
              de cada familia del barrio.
            </p>
            <p>
              Empezamos con poco, pero con mucho corazón. Desde el principio supimos que nuestro mayor capital
              no estaba en los anaqueles, sino en la <strong>confianza de nuestra gente</strong> —clientes que
              se volvieron amigos, y amigos que se volvieron familia.
            </p>
            <p>
              Hoy, con orgullo, continuamos esa misma tradición. Buscamos los mejores precios del mercado,
              apoyamos a proveedores mexicanos y atendemos con la calidez de siempre.
              Porque en Las Flores, <em>cada quien que llega, llega a su casa</em>. 🏡
            </p>
          </div>
        </motion.div>

        {/* Values grid */}
        <h2 className="font-display text-2xl font-bold text-slate-dark mb-6 text-center">¿Por qué elegirnos?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
          {VALUES.map((v, i) => (
            <motion.div key={i} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.15*i}}
              className="bg-white rounded-2xl border border-cream-200 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">{v.icon}</div>
              <h3 className="font-display font-bold text-slate-dark text-lg mb-2">{v.title}</h3>
              <p className="text-slate-mid text-sm leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Info card */}
        <div className="bg-gradient-to-br from-sage/10 to-terracotta/10 rounded-3xl border border-cream-200 p-8 space-y-5">
          <h2 className="font-display text-2xl font-bold text-slate-dark mb-2">📍 Visítanos</h2>
          <div className="flex items-start gap-3">
            <HiLocationMarker className="w-6 h-6 text-terracotta flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-dark">Niños Héroes 29, Palmitas, Iztapalapa</p>
              <p className="text-slate-mid text-sm">09670 Ciudad de México, CDMX</p>
              <a href="https://maps.app.goo.gl/A9VD57MSLLxHdjFK9" target="_blank" rel="noopener noreferrer"
                className="text-sm text-terracotta hover:underline font-semibold mt-1 inline-block">
                📍 Ver en Google Maps →
              </a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <HiClock className="w-6 h-6 text-sage flex-shrink-0" />
            <div>
              <p className="font-semibold text-slate-dark">Lunes a Domingo</p>
              <p className="text-slate-mid text-sm">9:00 AM – 9:30 PM</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <HiPhone className="w-6 h-6 text-terracotta flex-shrink-0" />
            <a href="https://wa.me/525560678528" target="_blank" rel="noopener noreferrer"
              className="font-semibold text-slate-dark hover:text-terracotta transition-colors">
              WhatsApp: 55 6067 8528
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
