import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Modal.scss';

/**
 * Reusable Modal Component
 * Overlays content with backdrop
 */
export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  className = ''
}) => {
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="modal__backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          />
          
          <motion.div
            className={`modal modal--${size} ${className}`}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {title && (
              <div className="modal__header">
                <h2 className="modal__title">{title}</h2>
                <button
                  className="modal__close"
                  onClick={onClose}
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>
            )}
            
            <div className="modal__content">
              {children}
            </div>
            
            {footer && (
              <div className="modal__footer">
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
