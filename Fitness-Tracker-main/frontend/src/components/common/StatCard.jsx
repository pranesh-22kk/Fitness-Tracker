import React from 'react';
import { motion } from 'framer-motion';
import './StatCard.scss';

/**
 * Reusable Stat Card Component
 * Displays metrics with title, value, and icon
 */
export const StatCard = ({
  title,
  value,
  icon: Icon,
  subtitle,
  trend,
  color = 'primary',
  onClick,
  isGlass = false,
  delay = 0
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
      className={`stat-card stat-card--${color} ${isGlass ? 'stat-card--glass' : ''}`}
      variants={variants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4 }}
      onClick={onClick}
    >
      <div className="stat-card__header">
        <div className="stat-card__icon">
          {Icon && <Icon size={24} />}
        </div>
        {trend && (
          <div className={`stat-card__trend trend--${trend.direction}`}>
            {trend.value}
          </div>
        )}
      </div>
      
      <div className="stat-card__content">
        <p className="stat-card__title">{title}</p>
        <h3 className="stat-card__value">{value}</h3>
        {subtitle && <p className="stat-card__subtitle">{subtitle}</p>}
      </div>
    </motion.div>
  );
};

export default StatCard;
