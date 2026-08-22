/**
 * Format date string into human readable format
 */
export function formatDate(dateString, options = {}) {
  if (!dateString) return 'N/A';
  const defaultOptions = { year: 'numeric', month: 'short', day: 'numeric', ...options };
  return new Date(dateString).toLocaleDateString('en-US', defaultOptions);
}

/**
 * Format currency amount
 */
export function formatCurrency(amount, currency = 'USD') {
  if (amount === undefined || amount === null) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Get initials from full name
 */
export function getInitials(name) {
  if (!name) return 'DF';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Format status slug to human title (e.g. 'on_leave' -> 'On Leave')
 */
export function formatStatusText(status) {
  if (!status) return '';
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
