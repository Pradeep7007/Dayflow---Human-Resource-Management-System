import React from 'react';
import { cn } from '../../utils/cn';

export const Badge = ({
  children,
  variant = 'neutral',
  size = 'md',
  showDot = false,
  className = '',
  ...props
}) => {
  return (
    <span
      className={cn(
        'df-badge',
        `df-badge--${variant}`,
        `df-badge--${size}`,
        className
      )}
      {...props}
    >
      {showDot && <span className="df-badge__dot" />}
      {children}
    </span>
  );
};
