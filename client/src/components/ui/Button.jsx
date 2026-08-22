import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Production-ready DayFlow Button component
 */
export const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon = null,
  rightIcon = null,
  className = '',
  type = 'button',
  onClick,
  ...props
}, ref) => {
  const isDisabled = disabled || isLoading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={cn(
        'df-btn',
        `df-btn--${variant}`,
        `df-btn--${size}`,
        isDisabled && 'df-btn--disabled',
        className
      )}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="df-btn__spinner" />
      ) : (
        leftIcon && <span className="df-btn__left-icon">{leftIcon}</span>
      )}
      <span className="df-btn__label">{children}</span>
      {!isLoading && rightIcon && <span className="df-btn__right-icon">{rightIcon}</span>}
    </button>
  );
});

Button.displayName = 'Button';
