import { motion } from 'framer-motion';

const AnimatedCard = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ 
        duration: 0.4, 
        delay, 
        ease: 'easeOut' 
      }}
      whileHover={{ 
        y: -10,
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        transition: { duration: 0.2 }
      }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
