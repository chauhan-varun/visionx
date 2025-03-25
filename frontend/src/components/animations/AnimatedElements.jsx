import { motion } from 'framer-motion';

// Fade in animation for elements
export const FadeIn = ({ children, delay = 0, duration = 0.5 }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration, delay }}
  >
    {children}
  </motion.div>
);

// Scale up animation for cards or buttons
export const ScaleUp = ({ children, delay = 0, duration = 0.3 }) => (
  <motion.div
    initial={{ scale: 0.95, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration, delay }}
    whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
  >
    {children}
  </motion.div>
);

// Slide in from left animation
export const SlideInLeft = ({ children, delay = 0, duration = 0.5 }) => (
  <motion.div
    initial={{ x: -50, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration, delay }}
  >
    {children}
  </motion.div>
);

// Slide in from right animation
export const SlideInRight = ({ children, delay = 0, duration = 0.5 }) => (
  <motion.div
    initial={{ x: 50, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration, delay }}
  >
    {children}
  </motion.div>
);

// Staggered list animation - for items in a list
export const StaggerContainer = ({ children, staggerDelay = 0.1 }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay,
        },
      },
    }}
    initial="hidden"
    animate="show"
  >
    {children}
  </motion.div>
);

// Item for use with StaggerContainer
export const StaggerItem = ({ children }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    }}
  >
    {children}
  </motion.div>
);

// Button animation with support for rendering as different component types
export const AnimatedButton = ({ children, as: Component = 'button', ...props }) => {
  const MotionComponent = motion(Component);
  
  return (
    <MotionComponent
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </MotionComponent>
  );
};
