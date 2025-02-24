// utils/format.ts
import { formatUnits, parseUnits } from "viem";

/**
 * Format number to a readable currency value
 * e.g., 1234567.89 -> $1,234,567.89
 */
export const formatCurrency = (value: number | string): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return '$0.00';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numValue);
};

/**
 * Format number to a readable value with specified decimals
 * e.g., 1234567.89123 -> 1,234,567.89 (with 2 decimals)
 */
export const formatNumber = (value: number | string, decimals: number = 2): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return '0';

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals
  }).format(numValue);
};

/**
 * Format blockchain balance considering decimals
 * e.g., "1234567890000000000" with 18 decimals -> "1.23"
 */
export const formatBalance = (balance: string, decimals: number = 18): string => {
  try {
    const formatted = formatUnits(BigInt(balance), decimals);
    return formatNumber(formatted);
  } catch (error) {
    console.error('Error formatting balance:', error);
    return '0';
  }
};

/**
 * Parse input amount string to a number considering decimals
 */
export const parseInputAmount = (input: string, decimals: number = 18): string => {
  try {
    // Remove commas and validate format
    const cleanInput = input.replace(/,/g, '');
    if (!cleanInput || cleanInput === '.' || !/^\d*\.?\d*$/.test(cleanInput)) return '0';
    
    // Convert to BigInt with proper decimals
    return parseUnits(cleanInput, decimals).toString();
  } catch (error) {
    console.error('Error parsing input amount:', error);
    return '0';
  }
};

/**
 * Shorten address or long string
 * e.g., "0x1234567890123456789012345678901234567890" -> "0x1234...7890"
 */
export const shortenString = (str: string, startLength: number = 6, endLength: number = 4): string => {
  if (!str) return '';
  if (str.length <= startLength + endLength) return str;
  return `${str.slice(0, startLength)}...${str.slice(-endLength)}`;
};