import React, { useState } from 'react';
import './FormInput.scss';

/**
 * Enhanced Form Input Component
 * Provides modern input styling with label, error, and icon support
 */
export const FormInput = React.forwardRef(({
  label,
  error,
  icon: Icon,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  disabled = false,
  required = false,
  helpText,
  className = '',
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`form-input-group ${className}`}>
      {label && (
        <label className="form-input__label">
          {label}
          {required && <span className="form-input__required">*</span>}
        </label>
      )}
      
      <div className={`form-input__wrapper ${error ? 'form-input__wrapper--error' : ''} ${isFocused ? 'form-input__wrapper--focused' : ''}`}>
        {Icon && <Icon className="form-input__icon" size={20} />}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          onFocus={() => setIsFocused(true)}
          disabled={disabled}
          className="form-input__input"
          {...props}
        />
      </div>
      
      {error && <span className="form-input__error">{error}</span>}
      {helpText && !error && <span className="form-input__help">{helpText}</span>}
    </div>
  );
});

FormInput.displayName = 'FormInput';

export default FormInput;
