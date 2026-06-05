/**
 * TaoScope SDK Constants
 * @packageDocumentation
 */

// =============================================================================
// API Configuration
// =============================================================================

/**
 * Default TaoScope API base URL
 */
export const DEFAULT_BASE_URL = "https://taoscope.com";

/**
 * Default request timeout in milliseconds
 */
export const DEFAULT_TIMEOUT = 30000;

/**
 * Default retry configuration
 */
export const DEFAULT_RETRY = {
  attempts: 3,
  delay: 1000,
} as const;

// =============================================================================
// API Endpoints
// =============================================================================

/**
 * TaoScope API endpoints
 */
export const ENDPOINTS = {
  // Price
  PRICE: "/api/price",
  
  // Network
  STATS: "/api/stats",
  HEALTH: "/api/health",
  
  // Subnets
  SUBNETS: "/api/subnets",
  SUBNET: (id: number) => `/api/subnets/${id}`,
  
  // Validators
  VALIDATORS: "/api/validators",
  VALIDATOR: (id: string) => `/api/validators/${id}`,
  
  // Miners
  MINERS: "/api/miners",
  
  // Address
  ADDRESS: (address: string) => `/api/address/${address}`,
  
  // Leaderboard
  LEADERBOARD: "/api/leaderboard",
  
  // Taostats
  TAOSTATS_NETWORK: "/api/taostats/network",
  TAOSTATS_SUBNETS: "/api/taostats/subnets",
  TAOSTATS_EMISSIONS: "/api/taostats/emissions",
} as const;

// =============================================================================
// Network Configuration
// =============================================================================

/**
 * Bittensor network configuration
 */
export const NETWORK = {
  /** Network name */
  name: "Bittensor Finney",
  /** Short name */
  shortName: "Finney",
  /** Native token symbol */
  symbol: "TAO",
  /** Token decimals */
  decimals: 9,
  /** Average block time in seconds */
  blockTime: 12,
  /** Daily emission in TAO */
  dailyEmission: 7200,
  /** Blocks per day */
  blocksPerDay: 7200,
  /** SS58 address prefix */
  ss58Prefix: 42,
} as const;

/**
 * Public RPC endpoints for Bittensor
 */
export const RPC_ENDPOINTS = [
  "wss://entrypoint-finney.opentensor.ai:443",
  "wss://bittensor-finney.api.onfinality.io/public-ws",
] as const;

// =============================================================================
// Cache TTLs (for reference)
// =============================================================================

/**
 * Cache TTL values in seconds (for reference)
 */
export const CACHE_TTL = {
  /** Price data */
  PRICE: 60,
  /** Network statistics */
  NETWORK_STATS: 30,
  /** Validator data */
  VALIDATORS: 120,
  /** Subnet data */
  SUBNETS: 120,
  /** Miner data */
  MINERS: 300,
  /** Leaderboard */
  LEADERBOARD: 120,
  /** Emission history */
  EMISSIONS: 300,
} as const;

// =============================================================================
// Validation Patterns
// =============================================================================

/**
 * Validation patterns
 */
export const PATTERNS = {
  /** SS58 address pattern (starts with 5, 48 chars) */
  SS58_ADDRESS: /^5[A-HJ-NP-Za-km-z1-9]{47}$/,
  /** Hotkey pattern (same as SS58) */
  HOTKEY: /^5[A-HJ-NP-Za-km-z1-9]{47}$/,
  /** Subnet ID (0-999) */
  SUBNET_ID: /^[0-9]{1,3}$/,
} as const;

// =============================================================================
// Display Constants
// =============================================================================

/**
 * Default pagination
 */
export const PAGINATION = {
  /** Default page size */
  DEFAULT_LIMIT: 20,
  /** Maximum page size */
  MAX_LIMIT: 100,
} as const;

/**
 * TAO value formatting
 */
export const TAO_FORMAT = {
  /** Decimal places for display */
  DECIMALS: 2,
  /** Decimal places for precise display */
  PRECISE_DECIMALS: 9,
  /** Symbol */
  SYMBOL: "τ",
  /** Alternative symbol */
  ALT_SYMBOL: "TAO",
} as const;
