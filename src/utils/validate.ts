/**
 * Validation utilities for TaoScope SDK
 * @packageDocumentation
 */

import { PATTERNS, NETWORK } from "../constants";

// =============================================================================
// Address Validation
// =============================================================================

/**
 * Validate a Bittensor SS58 address
 * @param address - Address to validate
 * @returns True if valid SS58 address
 * @example
 * ```ts
 * isValidAddress("5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY") // true
 * isValidAddress("invalid") // false
 * ```
 */
export function isValidAddress(address: string): boolean {
  if (!address || typeof address !== "string") {
    return false;
  }
  return PATTERNS.SS58_ADDRESS.test(address);
}

/**
 * Validate a hotkey address
 * @param hotkey - Hotkey to validate
 * @returns True if valid hotkey
 */
export function isValidHotkey(hotkey: string): boolean {
  return isValidAddress(hotkey);
}

/**
 * Validate a coldkey address
 * @param coldkey - Coldkey to validate
 * @returns True if valid coldkey
 */
export function isValidColdkey(coldkey: string): boolean {
  return isValidAddress(coldkey);
}

// =============================================================================
// Subnet Validation
// =============================================================================

/**
 * Check if a value is a valid subnet ID
 * @param value - Value to check
 * @returns True if valid subnet ID
 * @example
 * ```ts
 * isSubnetId("1") // true
 * isSubnetId("999") // true
 * isSubnetId("abc") // false
 * isSubnetId("1000") // false (out of range)
 * ```
 */
export function isSubnetId(value: string | number): boolean {
  const strValue = String(value);
  if (!PATTERNS.SUBNET_ID.test(strValue)) {
    return false;
  }
  const num = parseInt(strValue, 10);
  return num >= 0 && num < 1000;
}

/**
 * Parse and validate a subnet ID
 * @param value - Value to parse
 * @returns Parsed subnet ID or null if invalid
 * @example
 * ```ts
 * parseSubnetId("1") // 1
 * parseSubnetId("abc") // null
 * ```
 */
export function parseSubnetId(value: string | number): number | null {
  if (!isSubnetId(value)) {
    return null;
  }
  return parseInt(String(value), 10);
}

// =============================================================================
// TAO Value Validation
// =============================================================================

/**
 * Check if a value is a valid TAO amount
 * @param value - Value to check
 * @returns True if valid TAO amount
 * @example
 * ```ts
 * isValidTaoAmount(1.5) // true
 * isValidTaoAmount(-1) // false
 * isValidTaoAmount(NaN) // false
 * ```
 */
export function isValidTaoAmount(value: number): boolean {
  return typeof value === "number" && !isNaN(value) && isFinite(value) && value >= 0;
}

/**
 * Check if a raw TAO value is within valid range
 * @param rawValue - Raw TAO value
 * @returns True if valid
 */
export function isValidRawTaoAmount(rawValue: number): boolean {
  if (!isValidTaoAmount(rawValue)) {
    return false;
  }
  // Check for maximum TAO supply (roughly 21 million * 10^9)
  const maxRaw = 21_000_000 * Math.pow(10, NETWORK.decimals);
  return rawValue <= maxRaw;
}

// =============================================================================
// General Validation
// =============================================================================

/**
 * Check if a value is a valid percentage (0-100)
 * @param value - Value to check
 * @returns True if valid percentage
 */
export function isValidPercentage(value: number): boolean {
  return typeof value === "number" && !isNaN(value) && value >= 0 && value <= 100;
}

/**
 * Check if a value is a valid score (0-1)
 * @param value - Value to check
 * @returns True if valid score
 */
export function isValidScore(value: number): boolean {
  return typeof value === "number" && !isNaN(value) && value >= 0 && value <= 1;
}

/**
 * Check if a string is a valid URL
 * @param url - URL to validate
 * @returns True if valid URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Detect the type of a query string
 * @param query - Query string to analyze
 * @returns Detected type
 * @example
 * ```ts
 * detectQueryType("5Grwva...") // "address"
 * detectQueryType("1") // "subnet"
 * detectQueryType("search term") // "search"
 * ```
 */
export function detectQueryType(query: string): "address" | "subnet" | "search" {
  const trimmed = query.trim();
  
  if (isValidAddress(trimmed)) {
    return "address";
  }
  
  if (isSubnetId(trimmed)) {
    return "subnet";
  }
  
  return "search";
}

// =============================================================================
// Input Sanitization
// =============================================================================

/**
 * Sanitize an address input (trim and validate)
 * @param input - Raw input string
 * @returns Sanitized address or null if invalid
 */
export function sanitizeAddress(input: string): string | null {
  const trimmed = input?.trim();
  return isValidAddress(trimmed) ? trimmed : null;
}

/**
 * Sanitize a search query
 * @param input - Raw input string
 * @param maxLength - Maximum length (default: 100)
 * @returns Sanitized search query
 */
export function sanitizeSearchQuery(input: string, maxLength = 100): string {
  return input?.trim().slice(0, maxLength) || "";
}

/**
 * Sanitize a number input
 * @param input - Raw input (string or number)
 * @param defaultValue - Default value if invalid
 * @returns Sanitized number
 */
export function sanitizeNumber(input: string | number, defaultValue = 0): number {
  const num = typeof input === "string" ? parseFloat(input) : input;
  return isValidTaoAmount(num) ? num : defaultValue;
}
