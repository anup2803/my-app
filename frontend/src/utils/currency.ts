// Nepali currency utilities
export const NEPALI_CURRENCY = {
  symbol: 'रू',
  code: 'NPR',
  name: 'Nepalese Rupee',
  exchangeRate: 1, // Base rate for NPR
};

export const formatNepaliCurrency = (amount: number): string => {
  return `${NEPALI_CURRENCY.symbol} ${amount.toLocaleString('en-IN')}`;
};

export const formatNepaliCurrencyWithCode = (amount: number): string => {
  return `${NEPALI_CURRENCY.symbol} ${amount.toLocaleString('en-IN')} (${NEPALI_CURRENCY.code})`;
};

export const convertToNepaliRupees = (amount: number, fromCurrency: string = 'USD'): number => {
  const rates = {
    USD: 133.50, // 1 USD = 133.50 NPR (approximate)
    EUR: 145.20,
    GBP: 170.30,
    INR: 1.60,
  };
  
  if (fromCurrency === 'NPR') return amount;
  return amount * (rates[fromCurrency as keyof typeof rates] || 1);
};

export const formatPrice = (amount: number): string => {
  return formatNepaliCurrency(amount);
}; 