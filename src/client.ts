/**
 * TaoScope API Client
 * @packageDocumentation
 */

import {
  DEFAULT_BASE_URL,
  DEFAULT_TIMEOUT,
  DEFAULT_RETRY,
  ENDPOINTS,
} from "./constants";

import type {
  TaoScopeConfig,
  PriceData,
  NetworkStats,
  Subnet,
  SubnetQueryParams,
  Validator,
  ValidatorQueryParams,
  Miner,
  MinerQueryParams,
  AddressInfo,
  LeaderboardEntry,
  LeaderboardQueryParams,
  EmissionDataPoint,
  EmissionQueryParams,
  ApiResponse,
  ApiError,
} from "./types";

/**
 * TaoScope API Error
 */
export class TaoScopeError extends Error {
  public readonly status: number;
  public readonly code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "TaoScopeError";
    this.status = status;
    this.code = code;
  }
}

/**
 * TaoScope API Client
 * 
 * @example
 * ```ts
 * const client = new TaoScope();
 * 
 * // Get TAO price
 * const price = await client.getPrice();
 * console.log(`TAO: $${price.usd}`);
 * 
 * // Get validators
 * const validators = await client.getValidators({ limit: 10 });
 * ```
 */
export class TaoScope {
  private readonly baseUrl: string;
  private readonly timeout: number;
  private readonly headers: Record<string, string>;
  private readonly retryAttempts: number;
  private readonly retryDelay: number;

  /**
   * Create a new TaoScope client
   * @param config - Client configuration
   */
  constructor(config: TaoScopeConfig = {}) {
    this.baseUrl = config.baseUrl || DEFAULT_BASE_URL;
    this.timeout = config.timeout || DEFAULT_TIMEOUT;
    this.headers = {
      "Content-Type": "application/json",
      ...config.headers,
    };
    this.retryAttempts = config.retry?.attempts || DEFAULT_RETRY.attempts;
    this.retryDelay = config.retry?.delay || DEFAULT_RETRY.delay;
  }

  // ===========================================================================
  // Private Methods
  // ===========================================================================

  /**
   * Make an HTTP request with retry logic
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.retryAttempts; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(url, {
          ...options,
          headers: {
            ...this.headers,
            ...options.headers,
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const error = await response.json().catch(() => ({ error: "Unknown error" })) as ApiError;
          throw new TaoScopeError(
            error.error || `HTTP ${response.status}`,
            response.status,
            error.code
          );
        }

        return await response.json() as T;
      } catch (error) {
        lastError = error as Error;

        // Don't retry on client errors (4xx)
        if (error instanceof TaoScopeError && error.status >= 400 && error.status < 500) {
          throw error;
        }

        // Wait before retrying
        if (attempt < this.retryAttempts - 1) {
          await this.sleep(this.retryDelay * (attempt + 1));
        }
      }
    }

    throw lastError || new Error("Request failed");
  }

  /**
   * Build query string from params
   */
  private buildQuery<T extends object>(params: T): string {
    const entries = Object.entries(params) as [string, unknown][];
    const filtered = entries
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    
    return filtered.length > 0 ? `?${filtered.join("&")}` : "";
  }

  /**
   * Sleep for a given number of milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // ===========================================================================
  // Price API
  // ===========================================================================

  /**
   * Get current TAO price
   * @returns Price data
   * @example
   * ```ts
   * const price = await client.getPrice();
   * console.log(`TAO: $${price.usd} (${price.usd_24h_change.toFixed(2)}%)`);
   * ```
   */
  async getPrice(): Promise<PriceData> {
    const response = await this.request<ApiResponse<PriceData>>(ENDPOINTS.PRICE);
    return response.data;
  }

  // ===========================================================================
  // Network API
  // ===========================================================================

  /**
   * Get network statistics
   * @returns Network stats
   * @example
   * ```ts
   * const stats = await client.getNetworkStats();
   * console.log(`Total validators: ${stats.totalValidators}`);
   * ```
   */
  async getNetworkStats(): Promise<NetworkStats> {
    const response = await this.request<ApiResponse<NetworkStats>>(ENDPOINTS.STATS);
    return response.data;
  }

  /**
   * Check API health
   * @returns Health status
   */
  async getHealth(): Promise<{ status: string; timestamp: string }> {
    return this.request(ENDPOINTS.HEALTH);
  }

  // ===========================================================================
  // Subnet API
  // ===========================================================================

  /**
   * Get list of subnets
   * @param params - Query parameters
   * @returns Array of subnets
   * @example
   * ```ts
   * const subnets = await client.getSubnets({ status: "active", limit: 10 });
   * ```
   */
  async getSubnets(params: SubnetQueryParams = {}): Promise<Subnet[]> {
    const query = this.buildQuery(params);
    const response = await this.request<{ data: Subnet[] }>(`${ENDPOINTS.SUBNETS}${query}`);
    return response.data;
  }

  /**
   * Get a specific subnet by ID
   * @param id - Subnet ID (netuid)
   * @returns Subnet details
   * @example
   * ```ts
   * const subnet = await client.getSubnet(1);
   * console.log(`Subnet 1: ${subnet.name}`);
   * ```
   */
  async getSubnet(id: number): Promise<Subnet> {
    const response = await this.request<{ data: Subnet }>(ENDPOINTS.SUBNET(id));
    return response.data;
  }

  // ===========================================================================
  // Validator API
  // ===========================================================================

  /**
   * Get list of validators
   * @param params - Query parameters
   * @returns Array of validators
   * @example
   * ```ts
   * const validators = await client.getValidators({
   *   status: "active",
   *   sort: "stake",
   *   order: "desc",
   *   limit: 20
   * });
   * ```
   */
  async getValidators(params: ValidatorQueryParams = {}): Promise<Validator[]> {
    const query = this.buildQuery(params);
    const response = await this.request<{ data: Validator[] }>(`${ENDPOINTS.VALIDATORS}${query}`);
    return response.data;
  }

  /**
   * Get a specific validator by hotkey
   * @param hotkey - Validator hotkey
   * @returns Validator details
   * @example
   * ```ts
   * const validator = await client.getValidator("5Grwva...");
   * console.log(`Stake: ${validator.stakeFormatted}`);
   * ```
   */
  async getValidator(hotkey: string): Promise<Validator> {
    const response = await this.request<{ data: Validator }>(ENDPOINTS.VALIDATOR(hotkey));
    return response.data;
  }

  /**
   * Search validators by hotkey or name
   * @param query - Search query
   * @param limit - Maximum results (default: 10)
   * @returns Matching validators
   */
  async searchValidators(query: string, limit = 10): Promise<Validator[]> {
    return this.getValidators({ search: query, limit });
  }

  // ===========================================================================
  // Miner API
  // ===========================================================================

  /**
   * Get list of miners
   * @param params - Query parameters
   * @returns Array of miners
   * @example
   * ```ts
   * const miners = await client.getMiners({ subnet: 1, limit: 50 });
   * ```
   */
  async getMiners(params: MinerQueryParams = {}): Promise<Miner[]> {
    const query = this.buildQuery(params);
    const response = await this.request<{ data: Miner[] }>(`${ENDPOINTS.MINERS}${query}`);
    return response.data;
  }

  /**
   * Get miners for a specific subnet
   * @param subnetId - Subnet ID
   * @param limit - Maximum results
   * @returns Array of miners
   */
  async getMinersBySubnet(subnetId: number, limit = 100): Promise<Miner[]> {
    return this.getMiners({ subnet: subnetId, limit });
  }

  // ===========================================================================
  // Address API
  // ===========================================================================

  /**
   * Get information about an address
   * @param address - SS58 address
   * @returns Address information
   * @example
   * ```ts
   * const info = await client.getAddress("5Grwva...");
   * console.log(`Balance: ${info.balance.total}`);
   * ```
   */
  async getAddress(address: string): Promise<AddressInfo> {
    const response = await this.request<AddressInfo>(ENDPOINTS.ADDRESS(address));
    return response;
  }

  // ===========================================================================
  // Leaderboard API
  // ===========================================================================

  /**
   * Get leaderboard data
   * @param params - Query parameters
   * @returns Leaderboard entries
   * @example
   * ```ts
   * const topValidators = await client.getLeaderboard({ type: "validators", limit: 10 });
   * ```
   */
  async getLeaderboard(params: LeaderboardQueryParams = {}): Promise<LeaderboardEntry[]> {
    const query = this.buildQuery(params);
    const response = await this.request<{ data: LeaderboardEntry[] }>(`${ENDPOINTS.LEADERBOARD}${query}`);
    return response.data;
  }

  /**
   * Get top validators by stake
   * @param limit - Number of validators (default: 10)
   * @returns Top validators
   */
  async getTopValidators(limit = 10): Promise<LeaderboardEntry[]> {
    return this.getLeaderboard({ type: "validators", limit });
  }

  /**
   * Get top subnets by emission
   * @param limit - Number of subnets (default: 10)
   * @returns Top subnets
   */
  async getTopSubnets(limit = 10): Promise<LeaderboardEntry[]> {
    return this.getLeaderboard({ type: "subnets", limit });
  }

  // ===========================================================================
  // Historical Data API
  // ===========================================================================

  /**
   * Get historical emission data
   * @param params - Query parameters
   * @returns Emission history
   * @example
   * ```ts
   * const emissions = await client.getEmissionHistory({ days: 30 });
   * ```
   */
  async getEmissionHistory(params: EmissionQueryParams = {}): Promise<EmissionDataPoint[]> {
    const query = this.buildQuery(params);
    const response = await this.request<{ data: EmissionDataPoint[] }>(`${ENDPOINTS.TAOSTATS_EMISSIONS}${query}`);
    return response.data;
  }

  // ===========================================================================
  // Convenience Methods
  // ===========================================================================

  /**
   * Get a summary of the network
   * @returns Network summary with stats and price
   */
  async getNetworkSummary(): Promise<{
    stats: NetworkStats;
    price: PriceData;
  }> {
    const [stats, price] = await Promise.all([
      this.getNetworkStats(),
      this.getPrice(),
    ]);
    return { stats, price };
  }

  /**
   * Get all data for a subnet including validators and miners
   * @param id - Subnet ID
   * @returns Comprehensive subnet data
   */
  async getSubnetDetails(id: number): Promise<{
    subnet: Subnet;
    validators: Validator[];
    miners: Miner[];
  }> {
    const [subnet, validators, miners] = await Promise.all([
      this.getSubnet(id),
      this.getValidators({ subnet: id }),
      this.getMiners({ subnet: id }),
    ]);
    return { subnet, validators, miners };
  }
}
