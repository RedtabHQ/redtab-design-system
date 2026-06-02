# Scoring Configuration API - Quick Reference

## Files Overview

```
src/
├── services/
│   ├── scoringConfigApi.ts         # API service with scoring config endpoints
│   ├── mocks/
│   │   └── scoringConfigMock.ts    # Mock API for development
│   └── index.ts                     # Export scoringConfigService
├── hooks/
│   └── useScoringConfig.ts          # React Query hooks for scoring config
└── features/admin/components/ScoringEngine/
    └── ScoringEngineConfigView.tsx  # Component using new API
```

## Quick Start

### 1. Import Hook
```typescript
import { useActiveScoringConfig } from '@/hooks/useScoringConfig';
```

### 2. Use in Component
```typescript
const { data: config, isLoading, error } = useActiveScoringConfig();
```

### 3. Handle States
```typescript
if (isLoading) return <Spinner />;
if (error) return <ErrorMessage error={error} />;
if (!config) return null;

// Use config
console.log(config.categories.purchaseHistory.weight);
```

## All Available Hooks

### Query Hooks (Fetch Data)

#### `useActiveScoringConfig(options?)`
Fetches the currently active scoring configuration.

```typescript
const { data, isLoading, error } = useActiveScoringConfig();
```

#### `useScoringConfigs(params?, options?)`
Fetches paginated list of all configurations.

```typescript
const { data: result, isLoading } = useScoringConfigs({
  page: 1,
  pageSize: 30,
  sortBy: 'createdAt',
  sortOrder: 'desc'
});

console.log(result?.data);      // ScoringConfig[]
console.log(result?.total);     // number
console.log(result?.totalPages); // number
```

#### `useScoringConfig(id, options?)`
Fetches a single configuration by ID.

```typescript
const { data: config } = useScoringConfig('config-id-123');
```

### Mutation Hooks (Create/Update Data)

#### `useCreateScoringConfig(options?)`
Creates a new scoring configuration.

```typescript
const createConfig = useCreateScoringConfig();

createConfig.mutate({
  configName: 'New Config',
  categories: { /* ... */ },
  isActive: false
}, {
  onSuccess: (data) => console.log('Created:', data),
  onError: (error) => console.error('Failed:', error)
});
```

#### `useUpdateScoringConfig(options?)`
Updates an existing configuration.

```typescript
const updateConfig = useUpdateScoringConfig();

updateConfig.mutate({
  id: 'config-id-123',
  data: {
    configName: 'Updated Name',
    categories: { /* ... */ }
  }
}, {
  onSuccess: (data) => console.log('Updated:', data)
});
```

#### `useDeployScoringConfig(options?)`
Deploys/activates a configuration.

```typescript
const deployConfig = useDeployScoringConfig();

deployConfig.mutate({
  configName: 'Production Config',
  categories: { /* ... */ },
  isActive: true
}, {
  onSuccess: (config) => {
    console.log('Deployed config:', config.configName);
  }
});
```

#### `useRestoreScoringConfigDefaults(options?)`
Restores the active configuration to default values.

```typescript
const restoreDefaults = useRestoreScoringConfigDefaults();

restoreDefaults.mutate(undefined, {
  onSuccess: (data) => console.log('Restored to defaults'),
  onError: (error) => console.error('Restore failed:', error)
});
```

## Query Keys for Cache Management

```typescript
import { scoringConfigKeys } from '@/hooks/useScoringConfig';

// All queries
scoringConfigKeys.all              // ['scoringConfig']

// All list queries
scoringConfigKeys.lists()          // ['scoringConfig', 'list']

// Specific list with filters
scoringConfigKeys.list(filters)    // ['scoringConfig', 'list', filters]

// All detail queries
scoringConfigKeys.details()        // ['scoringConfig', 'detail']

// Specific detail
scoringConfigKeys.detail(id)       // ['scoringConfig', 'detail', id]

// Active config
scoringConfigKeys.active()         // ['scoringConfig', 'active']
```

### Manual Cache Invalidation

```typescript
import { useQueryClient } from '@tanstack/react-query';
import { scoringConfigKeys } from '@/hooks/useScoringConfig';

const queryClient = useQueryClient();

// Invalidate active config
queryClient.invalidateQueries({
  queryKey: scoringConfigKeys.active()
});

// Invalidate all config queries
queryClient.invalidateQueries({
  queryKey: scoringConfigKeys.all
});
```

## Data Types

### ScoringConfig
```typescript
interface ScoringConfig {
  id: string;
  configName: string;
  categories: {
    purchaseHistory: {
      weight: number;                              // 0-1
      subMetrics: {
        repaymentConsistency: { weight: number; max: number };
        utilizationEfficiency: { weight: number; max: number };
        earlySettlementBonus: { weight: number; max: number };
      };
    };
    posData: {
      weight: number;
      subMetrics: {
        avgTicketSize: { weight: number; max: number };
        monthlyGrowthVelocity: { weight: number; max: number };
        chargebackRatio: { weight: number; max: number };
      };
    };
    cashFlow: {
      weight: number;
      subMetrics: {
        dailyBalanceStability: { weight: number; max: number };
        debtServiceCoverage: { weight: number; max: number };
        operatingMargin: { weight: number; max: number };
      };
    };
    socialMedia: {
      weight: number;
      subMetrics: {
        customerSentimentScore: { weight: number; max: number };
        followerGrowth: { weight: number; max: number };
        engagementRate: { weight: number; max: number };
      };
    };
    businessInfo: {
      weight: number;
      subMetrics: {
        yearsInOperation: { weight: number; max: number };
        licenseValidity: { weight: number; max: number };
        taxComplianceStatus: { weight: number; max: number };
      };
    };
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## Error Handling

```typescript
const { data, error } = useActiveScoringConfig();

if (error) {
  // error is an Error object
  console.log(error.message);

  // Handle specific error types
  if (error instanceof NotFoundException) {
    // Handle not found
  } else if (error instanceof BadRequestException) {
    // Handle validation error
  }
}
```

## Loading States

```typescript
const { isLoading, isPending, isFetching } = useActiveScoringConfig();

// isLoading: True on initial load
// isPending: True while mutation is in progress
// isFetching: True while any fetch (including background refetch) is happening
```

## Mutation Status

```typescript
const mutation = useDeployScoringConfig();

mutation.isPending    // True while request is in flight
mutation.isError      // True if request failed
mutation.isSuccess    // True if request succeeded
mutation.error        // Error object if failed
mutation.data         // Returned data if successful
```

## Development/Testing with Mock API

### Using Mock API

1. **Option 1: Mock Service Worker (MSW)**
   ```typescript
   // MSW setup (in test setup)
   import { setupServer } from 'msw/node';
   import { http, HttpResponse } from 'msw';
   import { scoringConfigMockApi } from '@/services/mocks/scoringConfigMock';

   const server = setupServer(
     http.get('/v1/scoring/configs/active', async () => {
       const data = await scoringConfigMockApi.getActiveConfig();
       return HttpResponse.json(data);
     })
   );
   ```

2. **Option 2: Replace Service in Tests**
   ```typescript
   import { scoringConfigMockApi } from '@/services/mocks/scoringConfigMock';

   // Mock the service
   jest.mock('@/services/scoringConfigApi', () => ({
     scoringConfigService: scoringConfigMockApi
   }));
   ```

### Mock API Methods

```typescript
import { scoringConfigMockApi } from '@/services/mocks/scoringConfigMock';

// Get active config
const config = await scoringConfigMockApi.getActiveConfig();

// Get all configs
const result = await scoringConfigMockApi.getAllConfigs(page, pageSize);

// Get config by ID
const config = await scoringConfigMockApi.getConfigById(id);

// Create config
const newConfig = await scoringConfigMockApi.createConfig({
  configName: 'Test Config',
  categories: { /* ... */ }
});

// Deploy config
const deployed = await scoringConfigMockApi.deployConfig({
  configName: 'Production',
  categories: { /* ... */ }
});

// Restore defaults
const restored = await scoringConfigMockApi.restoreDefaults();

// Reset mock storage (for testing)
scoringConfigMockApi.reset();
```

## Common Patterns

### Loading and Displaying Config

```typescript
const { data: config, isLoading } = useActiveScoringConfig();

return (
  <div>
    {isLoading && <p>Loading...</p>}
    {config && (
      <div>
        <h1>{config.configName}</h1>
        <p>Purchase History: {(config.categories.purchaseHistory.weight * 100).toFixed(0)}%</p>
      </div>
    )}
  </div>
);
```

### Form with Deploy

```typescript
const { data: config } = useActiveScoringConfig();
const deployConfig = useDeployScoringConfig();
const [localConfig, setLocalConfig] = useState(config);

const handleSave = () => {
  if (!localConfig) return;
  deployConfig.mutate(localConfig, {
    onSuccess: () => alert('Saved!')
  });
};

return (
  <div>
    {/* Form fields using localConfig */}
    <button onClick={handleSave} disabled={deployConfig.isPending}>
      {deployConfig.isPending ? 'Saving...' : 'Save Configuration'}
    </button>
  </div>
);
```

### List with Pagination

```typescript
const [page, setPage] = useState(1);
const { data: result, isLoading } = useScoringConfigs({ page, pageSize: 10 });

return (
  <div>
    {result?.data.map(config => (
      <div key={config.id}>{config.configName}</div>
    ))}

    <p>Page {page} of {result?.totalPages}</p>
    <button onClick={() => setPage(p => p + 1)}>Next</button>
  </div>
);
```

## Troubleshooting

### Config not updating after save
- Ensure you're using `deployConfig.mutate()` or `useUpdateScoringConfig()`
- Check that mutations are configured with proper `onSuccess` callbacks
- Verify React Query cache invalidation is happening

### "No active scoring configuration found"
- Check that a configuration exists in the database
- Verify `isActive: true` on at least one config
- Use `useRestoreScoringConfigDefaults()` to create a default config

### Type errors on categories
- Ensure all sub-metrics are included in the categories object
- Check that weight values are between 0 and 1
- Verify all required fields are present

## API Endpoints Reference

- `GET /v1/scoring/configs/active` - Get active configuration
- `GET /v1/scoring/configs` - List all configurations
- `GET /v1/scoring/configs/:id` - Get specific configuration
- `POST /v1/scoring/configs` - Create configuration
- `POST /v1/scoring/configs/:id` - Update configuration
- `POST /v1/scoring/configs/deploy` - Deploy configuration
- `POST /v1/scoring/configs/restore-defaults` - Restore defaults
