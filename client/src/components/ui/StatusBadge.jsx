import React from 'react';
import { Badge } from './Badge';
import { formatStatusText } from '../../utils/formatters';

const STATUS_VARIANT_MAP = {
  // Positive / Active
  active: 'success',
  approved: 'success',
  present: 'success',
  paid: 'success',
  completed: 'success',

  // Warning / Pending
  pending: 'warning',
  draft: 'warning',
  late: 'warning',
  in_review: 'warning',

  // Negative / Destructive
  inactive: 'danger',
  rejected: 'danger',
  absent: 'danger',
  unpaid: 'danger',
  terminated: 'danger',

  // Informational / Neutral
  on_leave: 'info',
  half_day: 'info',
  probation: 'secondary',
};

export const StatusBadge = ({ status = '', size = 'md', className = '' }) => {
  const normalized = String(status).toLowerCase();
  const variant = STATUS_VARIANT_MAP[normalized] || 'neutral';
  const labelText = formatStatusText(status);

  return (
    <Badge variant={variant} size={size} showDot className={className}>
      {labelText}
    </Badge>
  );
};
