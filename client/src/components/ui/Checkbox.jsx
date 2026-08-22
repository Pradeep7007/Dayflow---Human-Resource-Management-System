import React from 'react';
import { cn } from '../../utils/cn';

export const Checkbox = React.forwardRef(({
  label,
  sublabel,
  checked,
  disabled = false,
  onChange,
  className = '',
  id,
  ...props
}, ref) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <label htmlFor={checkboxId} className={cn('df-checkbox-wrapper', disabled && 'opacity-60 cursor-not-allowed', className)}>
      <input
        ref={ref}
        type="checkbox"
        id={checkboxId}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="df-checkbox-input"
        {...props}
      />
      {label && (
        <div className="flex flex-col">
          <span className="font-medium text-slate-800">{label}</span>
          {sublabel && <span className="text-xs text-slate-500">{sublabel}</span>}
        </div>
      )}
    </label>
  );
});

Checkbox.displayName = 'Checkbox';
