import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Enhanced button variants
interface CyberButtonProps {
  variant?: 'hero' | 'ghost-glow' | 'data-panel' | 'terminal' | 'neon-outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  glow?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const CyberButton: React.FC<CyberButtonProps> = ({
  variant = 'hero',
  size = 'md',
  glow = false,
  className,
  children,
  onClick,
  disabled
}) => {
  const baseClasses = 'relative inline-flex items-center justify-center font-mono transition-all duration-300 ease-out';
  
  const variantClasses = {
    hero: 'hero-button text-black font-semibold rounded-lg',
    'ghost-glow': 'bg-transparent border border-accent/50 text-accent hover:bg-accent/10 hover:border-accent rounded-md',
    'data-panel': 'bg-card/80 border border-border text-foreground hover:bg-card rounded-sm backdrop-blur-sm',
    terminal: 'bg-background border border-tech-cyan/30 text-tech-cyan hover:bg-tech-cyan/10 font-mono text-sm rounded-none',
    'neon-outline': 'bg-transparent border-2 border-accent text-accent hover:bg-accent hover:text-background rounded-lg tech-glow'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl'
  };

  return (
    <motion.button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        glow && 'tech-glow-pulse',
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
};

// Progress indicators with glow
interface CyberProgressProps {
  value: number;
  max?: number;
  variant?: 'linear' | 'circular' | 'data-stream';
  size?: 'sm' | 'md' | 'lg';
  color?: 'cyan' | 'accent' | 'destructive';
  animated?: boolean;
}

export const CyberProgress: React.FC<CyberProgressProps> = ({
  value,
  max = 100,
  variant = 'linear',
  size = 'md',
  color = 'cyan',
  animated = false
}) => {
  const percentage = Math.min(100, (value / max) * 100);

  const colorClasses = {
    cyan: 'bg-tech-cyan shadow-tech-cyan/50',
    accent: 'bg-accent shadow-accent/50',
    destructive: 'bg-destructive shadow-destructive/50'
  };

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  if (variant === 'linear') {
    return (
      <div className={cn('w-full bg-muted rounded-full overflow-hidden', sizeClasses[size])}>
        <motion.div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            colorClasses[color],
            animated && 'animate-glow-pulse'
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            boxShadow: `0 0 10px currentColor`
          }}
        />
      </div>
    );
  }

  // Add circular and data-stream variants here if needed
  return null;
};

// Loading states with tech aesthetic
interface CyberLoadingProps {
  variant?: 'dots' | 'bars' | 'scanner' | 'matrix';
  size?: 'sm' | 'md' | 'lg';
  color?: 'cyan' | 'accent';
}

export const CyberLoading: React.FC<CyberLoadingProps> = ({
  variant = 'dots',
  size = 'md',
  color = 'cyan'
}) => {
  const colorClass = color === 'cyan' ? 'text-tech-cyan' : 'text-accent';
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  if (variant === 'dots') {
    return (
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={cn('rounded-full bg-current', sizeClasses[size], colorClass)}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'scanner') {
    return (
      <div className={cn('relative overflow-hidden rounded bg-muted', sizeClasses[size])}>
        <motion.div
          className={cn('absolute inset-y-0 w-1/3 bg-current', colorClass)}
          animate={{ x: ['-100%', '300%'] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear'
          }}
          style={{
            filter: 'blur(2px)',
            boxShadow: `0 0 20px currentColor`
          }}
        />
      </div>
    );
  }

  return null;
};

// Notification/toast with cyber styling
interface CyberNotificationProps {
  title: string;
  message?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  onClose?: () => void;
}

export const CyberNotification: React.FC<CyberNotificationProps> = ({
  title,
  message,
  type = 'info',
  onClose
}) => {
  const typeStyles = {
    info: 'border-tech-cyan text-tech-cyan',
    success: 'border-green-500 text-green-500',
    warning: 'border-yellow-500 text-yellow-500',
    error: 'border-destructive text-destructive'
  };

  return (
    <motion.div
      className={cn(
        'relative p-4 bg-card/90 backdrop-blur-sm border-l-4 rounded-r-lg',
        'shadow-lg max-w-sm',
        typeStyles[type]
      )}
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-mono font-semibold">{title}</h4>
          {message && (
            <p className="text-sm text-muted-foreground mt-1">{message}</p>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 text-muted-foreground hover:text-foreground"
          >
            ×
          </button>
        )}
      </div>
    </motion.div>
  );
};