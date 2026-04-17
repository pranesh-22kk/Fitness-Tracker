import React from 'react';
import { motion } from 'framer-motion';
import './GradientButton.scss';

/**
 * Gradient Button Component
 * Modern button with gradient background and hover effects
 */
export const GradientButton = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  isLoading = false,
  icon: Icon,
  className = '',
  ...props
}) => {
  return (
    <motion.button
      className={`grad-btn grad-btn--${variant} grad-btn--${size} ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled || isLoading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {isLoading ? (
        <span className="grad-btn__loader"></span>
      ) : (
        <>
          {Icon && <Icon size={20} />}
          {children}
        </>
      )}
    </motion.button>
  );
};

export default GradientButton;
