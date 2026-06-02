export { useLocalStorage } from './useLocalStorage';
export { safeStorage } from './storage';
export { formatDate, formatDateTime, formatTime, formatLocalized } from './dateFormatter';
export { formatCurrency, formatCurrencyAbbreviated, formatCurrencyCompact, formatCurrencyForCSV, formatAmountsInText } from './currencyFormatter';
export { exportToCSV } from './csvExport';
export {
  createMemoComponent,
  useMemoized,
  useCallbackMemoized,
  withMemo,
  shallowEqual,
  deepEqual,
  debounce,
  throttle,
} from './componentOptimization';
export {
  optimizeImage,
  optimizeAvatar,
  optimizeThumbnail,
  getImageDimensions,
  formatFileSize,
} from './imageOptimizer';
export type { ImageOptimizeOptions } from './imageOptimizer';
export {
  calculatePrincipalDue,
  calculateTotalFees,
  calculateFeesDue,
  calculatePenaltiesDue,
  calculateTotalDue,
  calculateTotalPaid,
  calculatePaymentProgress,
  isContractOverdue,
  isContractPaid,
  calculateDaysRemaining,
  getContractLifecycle,
  getContractSummary,
} from './contractHelpers';
export { getStatusStyles } from './statusStyles';
// export { validateEmail, validatePhone, validateRequired } from './validators';
// export { formatCurrency, formatNumber, formatPercentage } from './userHelpers';
// export { migrateStorage } from './storage-migration';
