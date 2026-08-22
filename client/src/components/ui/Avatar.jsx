import React, { useState } from 'react';
import { cn } from '../../utils/cn';
import { getInitials } from '../../utils/formatters';

export const Avatar = ({
  src,
  name = '',
  size = 'md',
  status, // 'online' | 'offline'
  className = '',
  ...props
}) => {
  const [imageError, setImageError] = useState(false);
  const initials = getInitials(name);

  return (
    <div
      className={cn('df-avatar', `df-avatar--${size}`, className)}
      title={name}
      {...props}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={name}
          className="df-avatar__img"
          onError={() => setImageError(true)}
        />
      ) : (
        <span>{initials}</span>
      )}

      {status && (
        <span
          className={cn(
            'df-avatar__status',
            `df-avatar__status--${status}`
          )}
        />
      )}
    </div>
  );
};
