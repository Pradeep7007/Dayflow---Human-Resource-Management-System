import React, { useState } from 'react';
import { cn } from '../../utils/cn';

export const Tooltip = ({ children, content, position = 'top', className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  if (!content) return children;

  return (
    <div
      className="df-tooltip-wrapper"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={cn('df-tooltip', `df-tooltip--${position}`, className)} role="tooltip">
          {content}
        </div>
      )}
    </div>
  );
};
