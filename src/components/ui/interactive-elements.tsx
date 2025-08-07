import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  hoverScale?: number;
  glowColor?: string;
  onClick?: () => void;
  variant?: 'chapter' | 'character' | 'location' | 'default';
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  children,
  className,
  hoverScale = 1.03,
  glowColor = 'var(--tech-cyan)',
  onClick,
  variant = 'default'
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const variantStyles = {
    chapter: 'chapter-card tech-card-glow',
    character: 'character-card',
    location: 'tech-card-glow border border-border/50',
    default: 'tech-card-glow'
  };

  return (
    <motion.div
      className={cn(
        'relative cursor-pointer transition-all duration-300 ease-out',
        'bg-card/80 backdrop-blur-sm rounded-lg overflow-hidden',
        variantStyles[variant],
        className
      )}
      whileHover={{ 
        scale: hoverScale,
        y: -4 
      }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      style={{
        '--glow-color': glowColor
      } as React.CSSProperties}
    >
      {/* Animated glow overlay */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/10 to-transparent"
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: '100%' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Chapter-specific glow overlay */}
      {variant === 'chapter' && (
        <div className="chapter-glow-overlay" />
      )}
    </motion.div>
  );
};

// Tooltip hover component
interface TooltipHoverProps {
  content: string;
  children: React.ReactNode;
  delay?: number;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const TooltipHover: React.FC<TooltipHoverProps> = ({
  content,
  children,
  delay = 300,
  position = 'top'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={cn(
              'absolute z-50 px-2 py-1 text-xs rounded-md',
              'bg-card border border-border/50 text-foreground',
              'backdrop-blur-sm shadow-lg',
              positionClasses[position]
            )}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            {content}
            {/* Arrow */}
            <div 
              className={cn(
                'absolute w-2 h-2 bg-card border transform rotate-45',
                position === 'top' && 'top-full left-1/2 -translate-x-1/2 -mt-1 border-b border-r border-border/50',
                position === 'bottom' && 'bottom-full left-1/2 -translate-x-1/2 -mb-1 border-t border-l border-border/50',
                position === 'left' && 'left-full top-1/2 -translate-y-1/2 -ml-1 border-t border-r border-border/50',
                position === 'right' && 'right-full top-1/2 -translate-y-1/2 -mr-1 border-b border-l border-border/50'
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Delayed reveal component
interface DelayedRevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale';
  className?: string;
}

export const DelayedReveal: React.FC<DelayedRevealProps> = ({
  children,
  delay = 0,
  direction = 'up',
  className
}) => {
  const variants = {
    up: {
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0 }
    },
    down: {
      hidden: { opacity: 0, y: -30 },
      visible: { opacity: 1, y: 0 }
    },
    left: {
      hidden: { opacity: 0, x: 30 },
      visible: { opacity: 1, x: 0 }
    },
    right: {
      hidden: { opacity: 0, x: -30 },
      visible: { opacity: 1, x: 0 }
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 }
    }
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={variants[direction]}
      transition={{
        duration: 0.6,
        delay: delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      {children}
    </motion.div>
  );
};

// Stagger container for lists
interface StaggerContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  staggerDelay = 0.1,
  className
}) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
};

// Floating action button with pulse
interface FloatingActionProps {
  children: React.ReactNode;
  onClick?: () => void;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
}

export const FloatingAction: React.FC<FloatingActionProps> = ({
  children,
  onClick,
  position = 'bottom-right',
  size = 'md',
  pulse = false
}) => {
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-14 h-14',
    lg: 'w-16 h-16'
  };

  return (
    <motion.button
      className={cn(
        'fixed z-50 rounded-full',
        'bg-primary text-primary-foreground',
        'shadow-lg border border-border/20',
        'flex items-center justify-center',
        'transition-all duration-300',
        positionClasses[position],
        sizeClasses[size],
        pulse && 'animate-glow-pulse',
        'hover:scale-110 active:scale-95'
      )}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};