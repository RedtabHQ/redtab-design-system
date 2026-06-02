import {
  DEFAULT_CURRENCY_LOCALE,
  DEFAULT_GLOBAL_CURRENCY,
  DEFAULT_GLOBAL_CURRENCY_SYMBOL,
} from '@/constants/currency';

export const formatUsdApprox = (value?: number | null) => {
  if (value === null || value === undefined) {
    return null;
  }

  return `≈ ${DEFAULT_GLOBAL_CURRENCY_SYMBOL} ${value.toLocaleString(DEFAULT_CURRENCY_LOCALE, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${DEFAULT_GLOBAL_CURRENCY}`;
};
