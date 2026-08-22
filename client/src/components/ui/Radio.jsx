import React from 'react';
import { cn } from '../../utils/cn';

export const Radio = React.forwardRef(({
  label,
  sublabel,
  value,
  name,
  checked,
  disabled = false,
  onChange,
  className = '',
  id,
  ...props
}, ref) => {
  const radioId = id || `radio-${name}-${value}`;

  return (
    <label htmlFor={radioId} className={cn('df-radio-wrapper', disabled && 'opacity-60 cursor-not-allowed', className)}>
      <input
        ref={ref}
        type="radio"
        id={radioId}
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="df-radio-input"
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

Radio.displayName = 'Radio';

export const RadioGroup = ({ label, children, className = '' }) => (
  <div className={cn('df-form-field', className)}>
    {label && <span className="df-label">{label}</span>}
    <div className="flex flex-col gap-sm mt-xs">{children}</div>
  </div>
);
