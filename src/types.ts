/**
 * TaoScope SDK Type Definitions
 * @packageDocumentation
 */

// =============================================================================
// Price Types
// =============================================================================

/**
 * TAO price data from CoinGecko
 */
export interface PriceData {
  /** Price in USD */
  usd: number;
  /** Market capitalization in USD */
  usd_market_cap: number;
  /** 24-hour price change percentage */
  usd_24h_change: number;
  /** Timestamp of the price data */
  timestamp: string;
}

/**
 * Historical price point
 */
export interface PricePoint {
  /** Timestamp */
  timestamp: string;
  /** Price in USD */
  price: number;
}

// =============================================================================
// Network Types
// =============================================================================

/**
 * Network statistics
 */
export interface NetworkStats {
  /** Total number of subnets */
  totalSubnets: number;
  /** Number of active subnets */
  activeSubnets: number;
  /** Total number of validators */
  totalValidators: number;
  /** Total number of miners */
  totalMiners: number;
  /** Total stake in TAO (raw) */
  totalStake: number;
  /** Total stake in TAO (formatted) */
  totalStakeFormatted: string;
  /** Daily emission in TAO */
  dailyEmission: number;
  /** Current block height */
  blockHeight: number;
  /** Current difficulty */
  difficulty: number;
  /** Timestamp */
  timestamp: string;
}

// =============================================================================
// Subnet Types
// =============================================================================

/**
 * Subnet status
 */
export type SubnetStatus = "active" | "inactive" | "registered";

/**
 * Subnet information
 */
export interface Subnet {
  /** Subnet ID (netuid) */
  id: number;
  /** Subnet name */
  name: string;
  /** Subnet description */
  description: string;
  /** Owner address */
  owner: string;
  /** Subnet status */
  status: SubnetStatus;
  /** Emission percentage (0-100) */
  emission: number;
  /** Tempo (blocks per epoch) */
  tempo: number;
  /** Registration cost in TAO */
  registrationCost: number;
  /** Number of validators */
  validatorCount: number;
  /** Number of miners */
  minerCount: number;
  /** Maximum number of neurons */
  maxNeurons: number;
  /** Minimum stake required */
  minStake: number;
  /** Trust score (0-1) */
  trust: number;
  /** Consensus score (0-1) */
  consensus: number;
  /** Incentive score (0-1) */
  incentive: number;
  /** Creation timestamp */
  createdAt: string;
  /** Last update timestamp */
  updatedAt: string;
}

/**
 * Subnet list query parameters
 */
export interface SubnetQueryParams {
  /** Filter by status */
  status?: SubnetStatus | "all";
  /** Sort field */
  sort?: "emission" | "validators" | "miners" | "id";
  /** Sort order */
  order?: "asc" | "desc";
  /** Maximum number of results */
  limit?: number;
}

// =============================================================================
// Validator Types
// =============================================================================

/**
 * Validator status
 */
export type ValidatorStatus = "active" | "inactive";

/**
 * Validator information
 */
export interface Validator {
  /** Unique ID */
  id: string;
  /** Rank by stake */
  rank: number;
  /** Hotkey address */
  hotkey: string;
  /** Coldkey address */
  coldkey: string;
  /** Validator name (if available) */
  name?: string;
  /** Status */
  status: ValidatorStatus;
  /** Total stake in TAO (raw) */
  stake: number;
  /** Total stake formatted */
  stakeFormatted: string;
  /** Number of nominators */
  nominators: number;
  /** Annual percentage yield */
  apy: number;
  /** Delegation fee percentage */
  delegationFee: number;
  /** Has permit for registration */
  permit: boolean;
  /** Trust score (0-1) */
  trust: number;
  /** Consensus score (0-1) */
  consensus: number;
  /** Incentive score (0-1) */
  incentive: number;
  /** Dividends score (0-1) */
  dividends: number;
  /** Last update timestamp */
  lastUpdate: string;
  /** Subnet IDs this validator is in */
  subnets: number[];
}

/**
 * Validator list query parameters
 */
export interface ValidatorQueryParams {
  /** Filter by status */
  status?: ValidatorStatus | "all";
  /** Filter by permit status */
  permit?: boolean;
  /** Filter by subnet ID */
  subnet?: number;
  /** Search by hotkey or name */
  search?: string;
  /** Sort field */
  sort?: "stake" | "apy" | "nominators" | "rank";
  /** Sort order */
  order?: "asc" | "desc";
  /** Maximum number of results */
  limit?: number;
}

// =============================================================================
// Miner Types
// =============================================================================

/**
 * Miner status
 */
export type MinerStatus = "active" | "inactive";

/**
 * Miner information
 */
export interface Miner {
  /** Unique ID */
  id: string;
  /** Hotkey address */
  hotkey: string;
  /** Coldkey address */
  coldkey: string;
  /** Subnet ID */
  subnetId: number;
  /** UID in subnet */
  uid: number;
  /** Status */
  status: MinerStatus;
  /** Trust score (0-1) */
  trust: number;
  /** Consensus score (0-1) */
  consensus: number;
  /** Incentive score (0-1) */
  incentive: number;
  /** Dividends score (0-1) */
  dividends: number;
  /** Emission received */
  emission: number;
  /** Last update timestamp */
  lastUpdate: string;
}

/**
 * Miner list query parameters
 */
export interface MinerQueryParams {
  /** Filter by subnet ID */
  subnet?: number;
  /** Filter by status */
  status?: MinerStatus | "all";
  /** Search by hotkey */
  search?: string;
  /** Sort field */
  sort?: "incentive" | "trust" | "emission";
  /** Sort order */
  order?: "asc" | "desc";
  /** Maximum number of results */
  limit?: number;
}

// =============================================================================
// Address Types
// =============================================================================

/**
 * Address balance information
 */
export interface AddressBalance {
  /** Free balance (raw) */
  free: number;
  /** Reserved balance (raw) */
  reserved: number;
  /** Total balance (raw) */
  total: number;
  /** Staked balance (raw) */
  staked: number;
}

/**
 * Address information
 */
export interface AddressInfo {
  /** SS58 address */
  address: string;
  /** Balance information */
  balance: AddressBalance;
  /** Is validator */
  isValidator: boolean;
  /** Is nominator */
  isNominator: boolean;
  /** Staking delegations */
  delegations: AddressDelegation[];
}

/**
 * Address delegation
 */
export interface AddressDelegation {
  /** Validator hotkey */
  validatorHotkey: string;
  /** Validator name (if available) */
  validatorName?: string;
  /** Amount delegated (raw) */
  amount: number;
}

// =============================================================================
// Leaderboard Types
// =============================================================================

/**
 * Leaderboard entry type
 */
export type LeaderboardType = "validators" | "subnets";

/**
 * Leaderboard entry
 */
export interface LeaderboardEntry {
  /** Rank */
  rank: number;
  /** ID (hotkey for validators, netuid for subnets) */
  id: string;
  /** Name */
  name: string;
  /** Primary value (stake for validators, emission for subnets) */
  value: number;
  /** Formatted value */
  valueFormatted: string;
  /** Secondary value (APY for validators, validator count for subnets) */
  secondaryValue?: number;
  /** Change from previous period */
  change?: number;
}

/**
 * Leaderboard query parameters
 */
export interface LeaderboardQueryParams {
  /** Leaderboard type */
  type?: LeaderboardType;
  /** Sort field */
  sort?: string;
  /** Maximum number of results */
  limit?: number;
}

// =============================================================================
// Emission Types
// =============================================================================

/**
 * Historical emission data point
 */
export interface EmissionDataPoint {
  /** Date string (YYYY-MM-DD) */
  date: string;
  /** Total emission for the day */
  emission: number;
  /** Cumulative emission */
  cumulative: number;
}

/**
 * Emission history query parameters
 */
export interface EmissionQueryParams {
  /** Number of days of history */
  days?: number;
}

// =============================================================================
// API Response Types
// =============================================================================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  /** Response data */
  data: T;
  /** Cache status */
  cache?: "HIT" | "MISS";
  /** Timestamp */
  timestamp: string;
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> {
  /** Response data */
  data: T[];
  /** Total count */
  total: number;
  /** Current page */
  page: number;
  /** Items per page */
  limit: number;
  /** Has more pages */
  hasMore: boolean;
}

/**
 * API error response
 */
export interface ApiError {
  /** Error message */
  error: string;
  /** Error code */
  code?: string;
  /** HTTP status */
  status: number;
}

// =============================================================================
// Client Configuration Types
// =============================================================================

/**
 * TaoScope client configuration
 */
export interface TaoScopeConfig {
  /** Base URL for API requests */
  baseUrl?: string;
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Custom headers */
  headers?: Record<string, string>;
  /** Retry configuration */
  retry?: {
    /** Number of retries */
    attempts?: number;
    /** Delay between retries in ms */
    delay?: number;
  };
}
