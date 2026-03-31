import { motion } from 'framer-motion';

export default function OfferBadge({ porcentaje }) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -12 }}
      animate={{ scale: 1, rotate: -12 }}
      className="absolute top-3 -right-1 z-10"
    >
      <div className="bg-warmred text-white text-xs font-bold px-3 py-1 rounded-l-full shadow-lg">
        -{porcentaje}%
      </div>
    </motion.div>
  );
}
