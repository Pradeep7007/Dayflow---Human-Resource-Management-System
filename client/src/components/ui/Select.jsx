import React from 'react';
import { cn } from '../../utils/cn';

export const Select = React.forwardRef(({
  label,
  options = [],
  placeholder = 'Select an option',
  helperText,
  error,
  required = false,
  disabled = false,
  className = '',
  id,
  children,
  ...props
}, ref) => {
  const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className="df-form-field">
      {label && (
        <label htmlFor={selectId} className="df-label">
          <span>
            {label}
            {required && <span className="df-label__required">*</span>}
          </span>
        </label>
      )}

      <div className="df-input-wrapper">
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          required={required}
          className={cn('df-select', error && 'df-select--error', className)}
          aria-invalid={Boolean(error)}
          {...props}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.length > 0
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
      </div>

      {error ? (
        <span className="df-field-error">{error}</span>
      ) : helperText ? (
        <span className="df-field-help">{helperText}</span>
      ) : null}
    </div>
  );
});

Select.displayName = 'Select';
