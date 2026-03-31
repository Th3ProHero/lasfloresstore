import { motion } from 'framer-motion';

const FLOWER_TYPES = ['🌸', '🌺', '🌻', '🌼', '🌷', '🌹', '🌿', '🌱'];

export default function FloatingFlowers({ count = 15, opacity = 0.1, className = "" }) {
  // Generamos un arreglo estático de flores basadas en el count para que no parpadee
  const flowers = Array.from({ length: count }).map((_, i) => {
    // Generación cuasi-aleatoria determinística simple
    const seed1 = (i * 13) % 100;
    const seed2 = (i * 17) % 100;
    const typeIndex = (i * 7) % FLOWER_TYPES.length;
    
    return {
      id: i,
      emoji: FLOWER_TYPES[typeIndex],
      size: seed1 * 0.8 + 30, // 30 a 110 px
      x: seed1, 
      y: seed2,
      duration: (seed1 % 20) + 20, // 20 a 40 segundos
      delay: (seed2 % 20) * -1, // Empieza de inmediato en diferente punto
      rotateStart: (seed1 * 3.6),
    };
  });

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${className}`} style={{ opacity }}>
      {flowers.map((f) => (
        <motion.div
          key={f.id}
          className="absolute"
          initial={{ left: `${f.x}%`, top: `${f.y}%`, rotate: f.rotateStart }}
          animate={{
            top: [`${f.y}%`, `${f.y - 15 > 0 ? f.y - 15 : 0}%`, `${f.y}%`],
            rotate: [f.rotateStart, f.rotateStart + 180, f.rotateStart + 360],
          }}
          transition={{
            duration: f.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: f.delay,
          }}
          style={{
            fontSize: `${f.size}px`,
            filter: 'blur(1px)',
            opacity: 0.8
          }}
        >
          {f.emoji}
        </motion.div>
      ))}
    </div>
  );
}
