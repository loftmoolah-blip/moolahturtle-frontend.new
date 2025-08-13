import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const LoadingSpinner = ({ 
  size = 'default', 
  text = 'Loading...', 
  className = '',
  showText = true 
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    default: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const textSizes = {
    small: 'text-sm',
    default: 'text-base',
    large: 'text-lg'
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <Loader2 className={`${sizeClasses[size]} text-green-600`} />
      </motion.div>
      {showText && (
        <motion.p 
          className={`text-gray-600 ${textSizes[size]}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export const PageLoadingSpinner = ({ text = 'Loading page...' }) => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
    <LoadingSpinner size="large" text={text} />
  </div>
);

export const InlineLoadingSpinner = ({ text = 'Loading...' }) => (
  <div className="flex items-center justify-center py-8">
    <LoadingSpinner size="default" text={text} />
  </div>
);

export default LoadingSpinner;