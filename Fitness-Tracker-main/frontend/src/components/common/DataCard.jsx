import React from 'react';
import { motion } from 'framer-motion';
import './DataCard.scss';

/**
 * Reusable Data Card Component
 * Displays detailed information in a structured card format
 */
export const DataCard = ({
  title,
  children,
  icon: Icon,
  footer,
  action,
  variant = 'default',
  delay = 0,
  className = ''
}) => {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay,
        ease: 'easeOut'
      }
    }
  };

  return (
    <motion.div
      className={`data-card data-card--${variant} ${className}`}
      variants={variants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4 }}
    >
      {(title || Icon) && (
        <div className="data-card__header">
          {Icon && <div className="data-card__icon">{Icon}</div>}
          {title && <h3 className="data-card__title">{title}</h3>}
          {action && <div className="data-card__action">{action}</div>}
        </div>
      )}
      
      <div className="data-card__content">
        {children}
      </div>
      
      {footer && (
        <div className="data-card__footer">
          {footer}
        </div>
      )}
    </motion.div>
  );
};

export default DataCard;
