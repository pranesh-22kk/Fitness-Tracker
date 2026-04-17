import React from 'react';
import './LoadingSpinner.scss';

/**
 * Reusable Loading Spinner Component
 * Shows animated loading indicator
 */
export const LoadingSpinner = ({ size = 'md', fullScreen = false }) => {
  return (
    <div className={`spinner ${fullScreen ? 'spinner--fullscreen' : ''} spinner--${size}`}>
      <div className="spinner__ring"></div>
      <div className="spinner__ring"></div>
      <div className="spinner__ring"></div>
      <div className="spinner__ring"></div>
    </div>
  );
};

export default LoadingSpinner;
