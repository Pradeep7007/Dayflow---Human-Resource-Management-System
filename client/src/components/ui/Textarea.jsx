import React from 'react';
import { cn } from '../../utils/cn';

export const Textarea = React.forwardRef(({
  label,
  helperText,
  error,
  required = false,
  disabled = false,
  rows = 3,
  className = '',
  id,
  maxLength,
  value,
  ...props
}, ref) => {
  const textareaId = id || (label ? `textarea-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);
  const currentLength = typeof value === 'string' ? value.length : 0;

  return (
    <div className="df-form-field">
      {label && (
        <label htmlFor={textareaId} className="df-label">
          <span>
            {label}
            {required && <span className="df-label__required">*</span>}
          </span>
          {maxLength && (
            <span className="df-field-help">
              {currentLength}/{maxLength}
            </span>
          )}
        </label>
      )}

      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        disabled={disabled}
        required={required}
        maxLength={maxLength}
        value={value}
        className={cn('df-textarea', error && 'df-textarea--error', className)}
        aria-invalid={Boolean(error)}
        {...props}
      />

      {error ? (
        <span className="df-field-error">{error}</span>
      ) : helperText ? (
        <span className="df-field-help">{helperText}</span>
      ) : null}
    </div>
  );
});

Textarea.displayName = 'Textarea';
