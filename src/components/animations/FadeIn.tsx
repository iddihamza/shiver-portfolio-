import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export const FadeIn = ({ 
  children, 
  delay = 0, 
  duration = 0.4, 
  className = "" 
}: FadeInProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ 
      duration, 
      delay,
      ease: 'easeOut' 
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export default FadeIn;