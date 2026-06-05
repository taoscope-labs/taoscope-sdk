/**
 * TaoScope SDK
 * 
 * Official SDK for TaoScope - Bittensor Network Explorer API
 * 
 * @packageDocumentation
 * @module @taoscope/sdk
 * 
 * @example
 * ```ts
 * import { TaoScope, formatTao, isValidAddress } from '@taoscope/sdk';
 * 
 * // Create client
 * const client = new TaoScope();
 * 
 * // Get TAO price
 * const price = await client.getPrice();
 * console.log(`TAO: $${price.usd}`);
 * 
 * // Get validators
 * const validators = await client.getValidators({ limit: 10 });
 * 
 * // Format values
 * console.log(formatTao(1000000000)); // "1.00"
 * 
 * // Validate addresses
 * console.log(isValidAddress("5Grwva...")); // true
 * ```
 */

// =============================================================================
// Client
// =============================================================================

export { TaoScope, TaoScopeError } from "./client";

// =============================================================================
// Types
// =============================================================================

export type {
  // Price types
  PriceData,
  PricePoint,
  
  // Network types
  NetworkStats,
  
  // Subnet types
  SubnetStatus,
  Subnet,
  SubnetQueryParams,
  
  // Validator types
  ValidatorStatus,
  Validator,
  ValidatorQueryParams,
  
  // Miner types
  MinerStatus,
  Miner,
  MinerQueryParams,
  
  // Address types
  AddressBalance,
  AddressInfo,
  AddressDelegation,
  
  // Leaderboard types
  LeaderboardType,
  LeaderboardEntry,
  LeaderboardQueryParams,
  
  // Emission types
  EmissionDataPoint,
  EmissionQueryParams,
  
  // API types
  ApiResponse,
  PaginatedResponse,
  ApiError,
  
  // Config types
  TaoScopeConfig,
} from "./types";

// =============================================================================
// Constants
// =============================================================================

export {
  // API configuration
  DEFAULT_BASE_URL,
  DEFAULT_TIMEOUT,
  DEFAULT_RETRY,
  ENDPOINTS,
  
  // Network configuration
  NETWORK,
  RPC_ENDPOINTS,
  
  // Cache TTLs
  CACHE_TTL,
  
  // Validation patterns
  PATTERNS,
  
  // Display constants
  PAGINATION,
  TAO_FORMAT,
} from "./constants";

// =============================================================================
// Utilities
// =============================================================================

export {
  // Format utilities
  formatTao,
  formatTaoWithSymbol,
  formatTaoCompact,
  toRawTao,
  shortenAddress,
  formatHotkey,
  formatNumber,
  formatCompact,
  formatPercentage,
  formatApy,
  formatUsd,
  formatMarketCap,
  formatRelativeTime,
  formatBlocksToTime,
  
  // Validation utilities
  isValidAddress,
  isValidHotkey,
  isValidColdkey,
  isSubnetId,
  parseSubnetId,
  isValidTaoAmount,
  isValidRawTaoAmount,
  isValidPercentage,
  isValidScore,
  isValidUrl,
  detectQueryType,
  sanitizeAddress,
  sanitizeSearchQuery,
  sanitizeNumber,
} from "./utils";

// =============================================================================
// Default Export
// =============================================================================

export { TaoScope as default } from "./client";
