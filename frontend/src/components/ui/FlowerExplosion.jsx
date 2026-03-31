import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const FLOWER_TYPES = ['🌸', '🌺', '🌻', '🌼', '🌷', '🌹', '✨', '🎉'];

export default function FlowerExplosion() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }).map((_, i) => {
      // Calculate a random angle and a random distance for explosion
      const angle = Math.random() * Math.PI * 2;
      const distance = 150 + Math.random() * 250; 
      return {
        id: i,
        emoji: FLOWER_TYPES[Math.floor(Math.random() * FLOWER_TYPES.length)],
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        size: Math.random() * 25 + 15, // 15px - 40px
        rotation: (Math.random() - 0.5) * 720,
        delay: Math.random() * 0.2
      };
    });
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          initial={{ scale: 0, x: 0, y: 0, rotate: 0, opacity: 1 }}
          animate={{
            scale: [0, 1.2, 1, 0],
            x: [0, p.x * 0.8, p.x],
            y: [0, p.y * 0.8, p.y + 100], // gravity effect
            rotate: p.rotation,
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 2.5 + Math.random(),
            ease: "easeOut",
            delay: p.delay,
          }}
          style={{ fontSize: `${p.size}px` }}
        >
          {p.emoji}
        </motion.div>
      ))}
    </div>
  );
}
