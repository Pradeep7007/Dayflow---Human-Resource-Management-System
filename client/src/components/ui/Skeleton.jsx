import React from 'react';
import { cn } from '../../utils/cn';

export const Skeleton = ({
  variant = 'line',
  width,
  height,
  className = '',
  count = 1,
}) => {
  const items = Array.from({ length: count });

  const getStyle = () => {
    const style = {};
    if (width) style.width = width;
    if (height) style.height = height;
    return style;
  };

  return (
    <>
      {items.map((_, idx) => (
        <div
          key={idx}
          style={getStyle()}
          className={cn(
            'skeleton-pulse rounded',
            variant === 'circle' && 'rounded-full w-10 h-10',
            variant === 'line' && 'h-4 w-full mb-2',
            variant === 'card' && 'h-32 w-full rounded-lg mb-4',
            className
          )}
          aria-hidden="true"
        />
      ))}
    </>
  );
};
