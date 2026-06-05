/**
 * Formatting utilities for TaoScope SDK
 * @packageDocumentation
 */

import { NETWORK, TAO_FORMAT } from "../constants";

// =============================================================================
// TAO Value Formatting
// =============================================================================

/**
 * Convert raw TAO value (with decimals) to human-readable format
 * @param rawValue - Raw TAO value (e.g., 1000000000 = 1 TAO)
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted TAO value
 * @example
 * ```ts
 * formatTao(1000000000) // "1.00"
 * formatTao(1500000000, 4) // "1.5000"
 * ```
 */
export function formatTao(rawValue: number, decimals = TAO_FORMAT.DECIMALS): string {
  const value = rawValue / Math.pow(10, NETWORK.decimals);
  return value.toFixed(decimals);
}

/**
 * Convert raw TAO value to human-readable format with symbol
 * @param rawValue - Raw TAO value
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted TAO value with τ symbol
 * @example
 * ```ts
 * formatTaoWithSymbol(1000000000) // "τ1.00"
 * formatTaoWithSymbol(1500000000, 4) // "τ1.5000"
 * ```
 */
export function formatTaoWithSymbol(rawValue: number, decimals = TAO_FORMAT.DECIMALS): string {
  return `${TAO_FORMAT.SYMBOL}${formatTao(rawValue, decimals)}`;
}

/**
 * Convert human-readable TAO value to raw format
 * @param value - Human-readable TAO value (e.g., 1.5)
 * @returns Raw TAO value
 * @example
 * ```ts
 * toRawTao(1) // 1000000000
 * toRawTao(1.5) // 1500000000
 * ```
 */
export function toRawTao(value: number): number {
  return Math.floor(value * Math.pow(10, NETWORK.decimals));
}

/**
 * Format TAO value with compact notation (K, M, B)
 * @param rawValue - Raw TAO value
 * @returns Compact formatted value
 * @example
 * ```ts
 * formatTaoCompact(1000000000000) // "1.00K"
 * formatTaoCompact(1500000000000000) // "1.50M"
 * ```
 */
export function formatTaoCompact(rawValue: number): string {
  const value = rawValue / Math.pow(10, NETWORK.decimals);
  
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(2)}K`;
  }
  return value.toFixed(2);
}

// =============================================================================
// Address Formatting
// =============================================================================

/**
 * Shorten an address for display
 * @param address - Full address string
 * @param startChars - Number of characters to show at start (default: 6)
 * @param endChars - Number of characters to show at end (default: 4)
 * @returns Shortened address
 * @example
 * ```ts
 * shortenAddress("5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY")
 * // "5Grwva...utQY"
 * ```
 */
export function shortenAddress(address: string, startChars = 6, endChars = 4): string {
  if (!address || address.length <= startChars + endChars) {
    return address;
  }
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Format hotkey for display (same as shortenAddress but with hotkey naming)
 * @param hotkey - Full hotkey address
 * @returns Shortened hotkey
 */
export function formatHotkey(hotkey: string): string {
  return shortenAddress(hotkey, 8, 6);
}

// =============================================================================
// Number Formatting
// =============================================================================

/**
 * Format a number with thousand separators
 * @param value - Number to format
 * @param decimals - Decimal places (default: 0)
 * @returns Formatted number string
 * @example
 * ```ts
 * formatNumber(1234567) // "1,234,567"
 * formatNumber(1234.567, 2) // "1,234.57"
 * ```
 */
export function formatNumber(value: number, decimals = 0): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format a number as compact (K, M, B)
 * @param value - Number to format
 * @returns Compact formatted string
 * @example
 * ```ts
 * formatCompact(1500) // "1.5K"
 * formatCompact(1500000) // "1.5M"
 * ```
 */
export function formatCompact(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toString();
}

/**
 * Format a percentage value
 * @param value - Percentage value (e.g., 0.156 for 15.6%)
 * @param decimals - Decimal places (default: 2)
 * @param includeSign - Include + sign for positive values
 * @returns Formatted percentage string
 * @example
 * ```ts
 * formatPercentage(0.156) // "15.60%"
 * formatPercentage(0.156, 1, true) // "+15.6%"
 * formatPercentage(-0.05, 2, true) // "-5.00%"
 * ```
 */
export function formatPercentage(value: number, decimals = 2, includeSign = false): string {
  const percent = value * 100;
  const formatted = percent.toFixed(decimals);
  const sign = includeSign && percent > 0 ? "+" : "";
  return `${sign}${formatted}%`;
}

/**
 * Format APY value
 * @param apy - APY as decimal (e.g., 0.15 for 15%)
 * @param decimals - Decimal places (default: 1)
 * @returns Formatted APY string
 * @example
 * ```ts
 * formatApy(0.15) // "15.0%"
 * formatApy(0.2567, 2) // "25.67%"
 * ```
 */
export function formatApy(apy: number, decimals = 1): string {
  return `${(apy * 100).toFixed(decimals)}%`;
}

// =============================================================================
// Currency Formatting
// =============================================================================

/**
 * Format a USD value
 * @param value - USD value
 * @param decimals - Decimal places (default: 2)
 * @returns Formatted USD string
 * @example
 * ```ts
 * formatUsd(1234.56) // "$1,234.56"
 * formatUsd(0.005, 4) // "$0.0050"
 * ```
 */
export function formatUsd(value: number, decimals = 2): string {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format market cap value
 * @param value - Market cap in USD
 * @returns Formatted market cap string
 * @example
 * ```ts
 * formatMarketCap(1500000000) // "$1.50B"
 * ```
 */
export function formatMarketCap(value: number): string {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  return formatUsd(value);
}

// =============================================================================
// Time Formatting
// =============================================================================

/**
 * Format a timestamp as relative time
 * @param timestamp - ISO timestamp or Date
 * @returns Relative time string
 * @example
 * ```ts
 * formatRelativeTime(new Date(Date.now() - 60000)) // "1 minute ago"
 * ```
 */
export function formatRelativeTime(timestamp: string | Date): string {
  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) {
    return "just now";
  }
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  }
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }
  if (seconds < 2592000) {
    const days = Math.floor(seconds / 86400);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }
  
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format blocks to estimated time
 * @param blocks - Number of blocks
 * @returns Estimated time string
 * @example
 * ```ts
 * formatBlocksToTime(300) // "~1 hour"
 * formatBlocksToTime(7200) // "~1 day"
 * ```
 */
export function formatBlocksToTime(blocks: number): string {
  const seconds = blocks * NETWORK.blockTime;
  
  if (seconds < 60) {
    return `~${seconds} seconds`;
  }
  if (seconds < 3600) {
    const minutes = Math.round(seconds / 60);
    return `~${minutes} minute${minutes > 1 ? "s" : ""}`;
  }
  if (seconds < 86400) {
    const hours = Math.round(seconds / 3600);
    return `~${hours} hour${hours > 1 ? "s" : ""}`;
  }
  const days = Math.round(seconds / 86400);
  return `~${days} day${days > 1 ? "s" : ""}`;
}
