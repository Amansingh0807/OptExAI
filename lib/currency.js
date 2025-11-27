// Currency conversion utilities
export const SUPPORTED_CURRENCIES = {
  USD: { symbol: '$', name: 'US Dollar', flag: 'US' },
  EUR: { symbol: '€', name: 'Euro', flag: 'EU' },
  GBP: { symbol: '£', name: 'British Pound', flag: 'GB' },
  JPY: { symbol: '¥', name: 'Japanese Yen', flag: 'JP' },
  CNY: { symbol: '¥', name: 'Chinese Yuan', flag: 'CN' },
  INR: { symbol: '₹', name: 'Indian Rupee', flag: 'IN' },
  CAD: { symbol: 'C$', name: 'Canadian Dollar', flag: 'CA' },
  AUD: { symbol: 'A$', name: 'Australian Dollar', flag: 'AU' },
  CHF: { symbol: 'Fr', name: 'Swiss Franc', flag: 'CH' },
  SEK: { symbol: 'kr', name: 'Swedish Krona', flag: 'SE' },
  NZD: { symbol: 'NZ$', name: 'New Zealand Dollar', flag: 'NZ' },
  MXN: { symbol: '$', name: 'Mexican Peso', flag: 'MX' },
  SGD: { symbol: 'S$', name: 'Singapore Dollar', flag: 'SG' },
  HKD: { symbol: 'HK$', name: 'Hong Kong Dollar', flag: 'HK' },
  NOK: { symbol: 'kr', name: 'Norwegian Krone', flag: 'NO' },
  ZAR: { symbol: 'R', name: 'South African Rand', flag: 'ZA' },
  BRL: { symbol: 'R$', name: 'Brazilian Real', flag: 'BR' },
  RUB: { symbol: '₽', name: 'Russian Ruble', flag: 'RU' },
  KRW: { symbol: '₩', name: 'South Korean Won', flag: 'KR' },
  THB: { symbol: '฿', name: 'Thai Baht', flag: 'TH' },
};

let exchangeRates = {};
let lastFetched = 0;
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

// Fetch exchange rates from a free API
export async function fetchExchangeRates() {
  const now = Date.now();
  
  // Return cached rates if they're still fresh
  if (exchangeRates.USD && (now - lastFetched) < CACHE_DURATION) {
    return exchangeRates;
  }

  try {
    // Using Exchange Rates API (free tier)
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await response.json();
    
    exchangeRates = {
      USD: 1, // Base currency
      ...data.rates
    };
    lastFetched = now;
    
    return exchangeRates;
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error);
    
    // Fallback to basic rates if API fails
    return {
      USD: 1,
      EUR: 0.85,
      GBP: 0.73,
      JPY: 110,
      CNY: 6.45,
      INR: 74.5,
      CAD: 1.25,
      AUD: 1.35,
      CHF: 0.92,
      SEK: 8.5,
      NZD: 1.42,
      MXN: 20.1,
      SGD: 1.35,
      HKD: 7.8,
      NOK: 8.8,
      ZAR: 14.5,
      BRL: 5.2,
      RUB: 74.0,
      KRW: 1180,
      THB: 31.5,
    };
  }
}

// Convert amount from one currency to another
export async function convertCurrency(amount, fromCurrency, toCurrency) {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  const rates = await fetchExchangeRates();
  
  // Convert to USD first, then to target currency
  const amountInUSD = amount / rates[fromCurrency];
  const convertedAmount = amountInUSD * rates[toCurrency];
  
  return convertedAmount;
}

// Format amount with currency symbol
export function formatCurrency(amount, currency = 'USD') {
  const currencyInfo = SUPPORTED_CURRENCIES[currency];
  if (!currencyInfo) return `${amount}`;

  const formattedAmount = Number(amount).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${currencyInfo.symbol}${formattedAmount}`;
}

// Get currency symbol
export function getCurrencySymbol(currency = 'USD') {
  return SUPPORTED_CURRENCIES[currency]?.symbol || '$';
}

// Get currency info
export function getCurrencyInfo(currency = 'USD') {
  return SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.USD;
}
