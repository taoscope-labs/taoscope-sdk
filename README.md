# @taoscope/sdk

Official SDK for [TaoScope](https://taoscope.com) - the Bittensor Network Explorer API.

## Features

- 🚀 **Simple API** - Easy-to-use client for TaoScope endpoints
- 📦 **TypeScript** - Full type definitions included
- 🔄 **Auto-retry** - Built-in retry logic with exponential backoff
- 🛠️ **Utilities** - Formatting and validation helpers
- 📊 **Complete** - Access to all TaoScope data

## Installation

```bash
npm install @taoscope/sdk
```

```bash
yarn add @taoscope/sdk
```

```bash
pnpm add @taoscope/sdk
```

## Quick Start

```typescript
import { TaoScope, formatTao, isValidAddress } from '@taoscope/sdk';

// Create client
const client = new TaoScope();

// Get TAO price
const price = await client.getPrice();
console.log(`TAO: $${price.usd}`);

// Get network stats
const stats = await client.getNetworkStats();
console.log(`Total validators: ${stats.totalValidators}`);

// Get validators
const validators = await client.getValidators({ 
  status: 'active',
  sort: 'stake',
  limit: 10 
});

// Format TAO values
console.log(formatTao(1000000000)); // "1.00"

// Validate addresses
console.log(isValidAddress("5Grwva...")); // true
```

## API Reference

### Client

#### `new TaoScope(config?)`

Create a new TaoScope client.

```typescript
const client = new TaoScope({
  baseUrl: 'https://taoscope.com', // Default
  timeout: 30000, // 30 seconds
  retry: {
    attempts: 3,
    delay: 1000,
  },
});
```

### Price

#### `client.getPrice()`

Get current TAO price from CoinGecko.

```typescript
const price = await client.getPrice();
// { usd: 450.00, usd_market_cap: 3000000000, usd_24h_change: 5.5, timestamp: "..." }
```

### Network

#### `client.getNetworkStats()`

Get network statistics.

```typescript
const stats = await client.getNetworkStats();
// { totalSubnets: 64, totalValidators: 1024, totalStake: ..., ... }
```

#### `client.getHealth()`

Check API health status.

```typescript
const health = await client.getHealth();
// { status: "healthy", timestamp: "..." }
```

### Subnets

#### `client.getSubnets(params?)`

Get list of subnets.

```typescript
const subnets = await client.getSubnets({
  status: 'active',    // 'active' | 'inactive' | 'all'
  sort: 'emission',    // 'emission' | 'validators' | 'miners' | 'id'
  order: 'desc',       // 'asc' | 'desc'
  limit: 20,
});
```

#### `client.getSubnet(id)`

Get a specific subnet by ID.

```typescript
const subnet = await client.getSubnet(1);
// { id: 1, name: "Root", emission: 18.5, ... }
```

### Validators

#### `client.getValidators(params?)`

Get list of validators.

```typescript
const validators = await client.getValidators({
  status: 'active',    // 'active' | 'inactive' | 'all'
  permit: true,        // Filter by permit status
  subnet: 1,           // Filter by subnet ID
  search: '5Grwva',    // Search by hotkey or name
  sort: 'stake',       // 'stake' | 'apy' | 'nominators' | 'rank'
  order: 'desc',
  limit: 20,
});
```

#### `client.getValidator(hotkey)`

Get a specific validator by hotkey.

```typescript
const validator = await client.getValidator("5Grwva...");
// { rank: 1, hotkey: "5Grwva...", stake: 1000000000, apy: 0.15, ... }
```

#### `client.searchValidators(query, limit?)`

Search validators by hotkey or name.

```typescript
const results = await client.searchValidators("5Grwva", 10);
```

### Miners

#### `client.getMiners(params?)`

Get list of miners.

```typescript
const miners = await client.getMiners({
  subnet: 1,           // Filter by subnet ID
  status: 'active',    // 'active' | 'inactive' | 'all'
  search: '5Grwva',    // Search by hotkey
  sort: 'incentive',   // 'incentive' | 'trust' | 'emission'
  order: 'desc',
  limit: 50,
});
```

#### `client.getMinersBySubnet(subnetId, limit?)`

Get miners for a specific subnet.

```typescript
const miners = await client.getMinersBySubnet(1, 100);
```

### Address

#### `client.getAddress(address)`

Get information about an address.

```typescript
const info = await client.getAddress("5Grwva...");
// { address: "5Grwva...", balance: { free: ..., staked: ... }, delegations: [...] }
```

### Leaderboard

#### `client.getLeaderboard(params?)`

Get leaderboard data.

```typescript
const leaderboard = await client.getLeaderboard({
  type: 'validators',  // 'validators' | 'subnets'
  limit: 10,
});
```

#### `client.getTopValidators(limit?)`

Get top validators by stake.

```typescript
const topValidators = await client.getTopValidators(10);
```

#### `client.getTopSubnets(limit?)`

Get top subnets by emission.

```typescript
const topSubnets = await client.getTopSubnets(10);
```

### Historical Data

#### `client.getEmissionHistory(params?)`

Get historical emission data.

```typescript
const emissions = await client.getEmissionHistory({ days: 30 });
// [{ date: "2024-01-01", emission: 7200, cumulative: ... }, ...]
```

### Convenience Methods

#### `client.getNetworkSummary()`

Get combined network stats and price.

```typescript
const { stats, price } = await client.getNetworkSummary();
```

#### `client.getSubnetDetails(id)`

Get comprehensive subnet data including validators and miners.

```typescript
const { subnet, validators, miners } = await client.getSubnetDetails(1);
```

## Utilities

### Formatting

```typescript
import {
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
} from '@taoscope/sdk';

// TAO formatting
formatTao(1000000000);           // "1.00"
formatTaoWithSymbol(1000000000); // "τ1.00"
formatTaoCompact(1500000000000); // "1.50K"
toRawTao(1.5);                   // 1500000000

// Address formatting
shortenAddress("5Grwva...");     // "5Grwva...utQY"
formatHotkey("5Grwva...");       // "5GrwvaEF...utQY"

// Number formatting
formatNumber(1234567);           // "1,234,567"
formatCompact(1500000);          // "1.5M"
formatPercentage(0.156);         // "15.60%"
formatApy(0.15);                 // "15.0%"

// Currency formatting
formatUsd(1234.56);              // "$1,234.56"
formatMarketCap(1500000000);     // "$1.50B"

// Time formatting
formatRelativeTime(new Date());  // "just now"
formatBlocksToTime(7200);        // "~1 day"
```

### Validation

```typescript
import {
  isValidAddress,
  isValidHotkey,
  isSubnetId,
  parseSubnetId,
  isValidTaoAmount,
  detectQueryType,
  sanitizeAddress,
} from '@taoscope/sdk';

// Address validation
isValidAddress("5Grwva...");     // true
isValidHotkey("5Grwva...");      // true

// Subnet validation
isSubnetId("1");                 // true
isSubnetId("999");               // true
parseSubnetId("1");              // 1
parseSubnetId("abc");            // null

// TAO validation
isValidTaoAmount(1.5);           // true
isValidTaoAmount(-1);            // false

// Query detection
detectQueryType("5Grwva...");    // "address"
detectQueryType("1");            // "subnet"
detectQueryType("search term");  // "search"

// Sanitization
sanitizeAddress("  5Grwva...  "); // "5Grwva..."
```

## Constants

```typescript
import {
  NETWORK,
  RPC_ENDPOINTS,
  CACHE_TTL,
  TAO_FORMAT,
} from '@taoscope/sdk';

// Network info
console.log(NETWORK.symbol);      // "TAO"
console.log(NETWORK.decimals);    // 9
console.log(NETWORK.dailyEmission); // 7200

// RPC endpoints
console.log(RPC_ENDPOINTS[0]);    // "wss://entrypoint-finney.opentensor.ai:443"

// Cache TTLs (for reference)
console.log(CACHE_TTL.PRICE);     // 60 seconds
```

## Error Handling

```typescript
import { TaoScope, TaoScopeError } from '@taoscope/sdk';

const client = new TaoScope();

try {
  const subnet = await client.getSubnet(999);
} catch (error) {
  if (error instanceof TaoScopeError) {
    console.log(`Error: ${error.message}`);
    console.log(`Status: ${error.status}`);
    console.log(`Code: ${error.code}`);
  }
}
```

## TypeScript

Full TypeScript support with exported types:

```typescript
import type {
  PriceData,
  NetworkStats,
  Subnet,
  Validator,
  Miner,
  AddressInfo,
  LeaderboardEntry,
  TaoScopeConfig,
} from '@taoscope/sdk';
```

## Browser Support

The SDK works in both Node.js and browser environments. For browsers, ensure you have a `fetch` polyfill if targeting older browsers.

## License

MIT © [TaoScope Team](https://taoscope.com)

## Links

- [Website](https://taoscope.com)
- [GitHub](https://github.com/taoscope-labs/taoscope-sdk)
- [Discord](https://discord.gg/PB5yqxZD7d)
- [Telegram](https://t.me/TaoScopeCommunity)
