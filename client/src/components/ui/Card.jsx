import React from 'react';
import { cn } from '../../utils/cn';

export const Card = ({
  children,
  className = '',
  hoverable = false,
  onClick,
  ...props
}) => {
  return (
    <div
      className={cn('df-card', hoverable && 'df-card--hoverable', className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ title, subtitle, action, className = '' }) => (
  <div className={cn('df-card__header', className)}>
    <div>
      {title && <h3 className="df-card__title">{title}</h3>}
      {subtitle && <p className="df-card__subtitle">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={cn('df-card__body', className)}>{children}</div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={cn('df-card__footer', className)}>{children}</div>
);
