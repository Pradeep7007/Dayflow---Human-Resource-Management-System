import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

export const ErrorState = ({
  title = 'Something went wrong',
  description = 'Failed to load data. Please check your connection and try again.',
  onRetry,
  className = '',
}) => {
  return (
    <div className={`df-error-state ${className}`}>
      <div className="df-error-state__icon">
        <AlertCircle size={28} />
      </div>
      <h3 className="df-error-state__title">{title}</h3>
      <p className="df-error-state__description">{description}</p>
      {onRetry && (
        <Button variant="secondary" leftIcon={<RefreshCw size={16} />} onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};
