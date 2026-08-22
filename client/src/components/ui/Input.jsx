import React from 'react';
import { cn } from '../../utils/cn';

export const Input = React.forwardRef(({
  label,
  helperText,
  error,
  leftIcon,
  rightIcon,
  required = false,
  disabled = false,
  className = '',
  id,
  type = 'text',
  ...props
}, ref) => {
  const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className="df-form-field">
      {label && (
        <label htmlFor={inputId} className="df-label">
          <span>
            {label}
            {required && <span className="df-label__required">*</span>}
          </span>
        </label>
      )}

      <div className="df-input-wrapper">
        {leftIcon && <span className="df-input-icon df-input-icon--left">{leftIcon}</span>}
        <input
          ref={ref}
          id={inputId}
          type={type}
          disabled={disabled}
          required={required}
          className={cn(
            'df-input',
            leftIcon && 'df-input--has-left-icon',
            rightIcon && 'df-input--has-right-icon',
            error && 'df-input--error',
            className
          )}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-help` : undefined}
          {...props}
        />
        {rightIcon && <span className="df-input-icon df-input-icon--right">{rightIcon}</span>}
      </div>

      {error ? (
        <span id={`${inputId}-error`} className="df-field-error">
          {error}
        </span>
      ) : helperText ? (
        <span id={`${inputId}-help`} className="df-field-help">
          {helperText}
        </span>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
