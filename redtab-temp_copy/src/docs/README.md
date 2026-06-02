# Frontend API Services

This directory contains the comprehensive API client services for the RPL frontend application.

## Overview

The API services are built with:
- **Axios** for HTTP requests
- **TypeScript** for type safety
- **Zustand** for state management
- **Automatic token refresh** on 401 errors
- **Request/Response interceptors** for authentication
- **Generic CRUD operations** with pagination support

## Architecture

```
services/
├── api.ts           # Core Axios client with interceptors
├── authApi.ts       # Authentication endpoints
├── apiService.ts    # Generic CRUD service with pagination
└── index.ts         # Barrel exports
```

## Configuration

### Environment Variables

Set the API base URL in your `.env` file:

```env
VITE_API_URL=http://localhost:3000
```

The API client will automatically append `/api/v1` to the base URL.

## Core Components

### 1. API Client (`api.ts`)

The core Axios instance with automatic token management and refresh logic.

**Features:**
- Base URL: `{VITE_API_URL}/api/v1` (default: `http://localhost:3000/api/v1`)
- Request interceptor: Adds Bearer token from localStorage/sessionStorage
- Response interceptor: Handles 401 errors with automatic token refresh
- Token storage: `accessToken` and `refreshToken` in localStorage/sessionStorage (camelCase)
- Failed request queuing during token refresh
- Dual storage support: localStorage (persistent) or sessionStorage (session-only) based on "Remember Me"

**Usage:**

```typescript
import { apiClient } from '@services';

// GET request
const data = await apiClient.get('/merchants');

// POST request
const merchant = await apiClient.post('/merchants', { name: 'New Merchant' });

// PUT request
const updated = await apiClient.put('/merchants/123', { name: 'Updated' });

// DELETE request
await apiClient.delete('/merchants/123');
```

### 2. Auth API (`authApi.ts`)

Authentication-specific endpoints.

**Methods:**

- `login(email, password)` - Login and get tokens
- `logout()` - Logout current user
- `refresh()` - Refresh access token
- `me()` - Get current user info

**Usage:**

```typescript
import { authApi } from '@services';

// Login
const { accessToken, refreshToken, user } = await authApi.login(
  'user@example.com',
  'password123'
);

// Get current user
const user = await authApi.me();

// Refresh token
const { accessToken, refreshToken, user } = await authApi.refresh();

// Logout
await authApi.logout();
```

### 3. Auth Store (`stores/authStore.ts`)

Zustand store for authentication state management.

**State:**
- `user: User | null`
- `accessToken: string | null`
- `refreshToken: string | null`
- `isAuthenticated: boolean`
- `isLoading: boolean`
- `error: string | null`

**Actions:**
- `login(email, password)` - Login and update state
- `logout()` - Logout and clear state
- `refreshToken()` - Refresh token
- `setUser(user)` - Update user info
- `setTokens(accessToken, refreshToken)` - Update tokens
- `clearError()` - Clear error state

**Usage:**

```typescript
import { useAuthStore } from '@stores';

function LoginForm() {
  const { login, isLoading, error, isAuthenticated } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      // Redirect to dashboard
    } catch (err) {
      // Error is already in store
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
```

### 4. Generic API Service (`apiService.ts`)

Type-safe generic CRUD service with pagination support.

**Generic Methods:**

- `getAll(params)` - Get all resources with pagination
- `getById(id)` - Get single resource
- `create(data)` - Create new resource
- `update(id, data)` - Update entire resource
- `patch(id, data)` - Partially update resource
- `delete(id)` - Delete resource
- `bulkDelete(ids)` - Delete multiple resources
- `count(filters)` - Get resource count
- `exists(id)` - Check if resource exists
- `query(endpoint, params)` - Custom GET endpoint
- `mutate(endpoint, data)` - Custom POST endpoint

**Pre-configured Services:**

- `merchantService`
- `contractService`
- `supplierService`
- `transactionService`
- `auditLogService`
- `policyService`
- `creditScoreService`

**Usage:**

```typescript
import { merchantService, ApiService } from '@services';
import type { Merchant } from '@types';

// Using pre-configured service
const response = await merchantService.getAll({
  page: 1,
  pageSize: 10,
  sortBy: 'createdAt',
  sortOrder: 'desc',
  search: 'Restaurant',
});

console.log(response.data); // Merchant[]
console.log(response.total); // Total count
console.log(response.page); // Current page
console.log(response.totalPages); // Total pages

// Get single merchant
const merchant = await merchantService.getById('M123');

// Create merchant
const newMerchant = await merchantService.create({
  name: 'New Restaurant',
  email: 'restaurant@example.com',
  phone: '+977 1234567890',
});

// Update merchant
const updated = await merchantService.update('M123', {
  status: 'VERIFIED',
});

// Delete merchant
await merchantService.delete('M123');

// Custom endpoint
const metrics = await merchantService.query('metrics', {
  startDate: '2024-01-01',
  endDate: '2024-12-31',
});

// Creating custom service
interface Product {
  id: string;
  name: string;
  price: number;
}

const productService = new ApiService<Product>('/products');
const products = await productService.getAll({ page: 1, pageSize: 20 });
```

## Pagination

All `getAll()` methods support pagination with the following parameters:

```typescript
interface PaginationParams {
  page?: number;           // Page number (default: 1)
  pageSize?: number;       // Items per page (default: 10)
  sortBy?: string;         // Field to sort by
  sortOrder?: 'asc' | 'desc'; // Sort order
  search?: string;         // Search query
}
```

**Response format:**

```typescript
interface PaginatedResponse<T> {
  data: T[];              // Array of items
  total: number;          // Total count
  page: number;           // Current page
  pageSize: number;       // Items per page
  totalPages: number;     // Total pages
}
```

## Error Handling

The API client automatically handles common errors:

### 401 Unauthorized

When a 401 error occurs:
1. The client attempts to refresh the token using the refresh_token
2. If successful, the original request is retried with the new access token
3. If refresh fails, tokens are cleared and user is redirected to `/login`

### Custom Error Handling

```typescript
import { merchantService } from '@services';

try {
  const merchant = await merchantService.getById('M123');
} catch (error) {
  if (error.response?.status === 404) {
    console.error('Merchant not found');
  } else if (error.response?.status === 403) {
    console.error('Permission denied');
  } else {
    console.error('Unknown error:', error);
  }
}
```

## Token Management

Tokens are automatically managed by the auth store and API client:

### Storage

The app uses **dual storage strategy** based on "Remember Me" preference:

- **localStorage** - When "Remember Me" is checked (persistent across browser sessions)
- **sessionStorage** - When "Remember Me" is unchecked (clears when tab closes)

**Storage Keys (all camelCase):**
- `accessToken` - JWT access token for API requests
- `refreshToken` - Refresh token used to obtain new access tokens
- `user` - User profile object (JSON)
- `rememberMe` - Boolean flag indicating which storage was used

### Refresh Flow

```
1. Request fails with 401
2. Check if refresh is already in progress
   - If yes: Queue the request
   - If no: Start refresh process
3. Call /api/v1/auth/refresh with refreshToken
4. Store new accessToken and refreshToken
5. Retry original request
6. Process all queued requests
```

## Best Practices

### 1. Use the Auth Store for Authentication

```typescript
// Good
import { useAuthStore } from '@stores';
const { login, logout, isAuthenticated } = useAuthStore();

// Avoid direct API calls for auth (unless you have a specific reason)
import { authApi } from '@services';
const response = await authApi.login(email, password);
```

### 2. Use Pre-configured Services

```typescript
// Good
import { merchantService } from '@services';
const merchants = await merchantService.getAll();

// Avoid creating new instances
import { ApiService } from '@services';
const service = new ApiService('/merchants');
```

### 3. Handle Loading States

```typescript
function MerchantList() {
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMerchants = async () => {
      try {
        setLoading(true);
        const response = await merchantService.getAll({ page: 1, pageSize: 10 });
        setMerchants(response.data);
      } catch (error) {
        console.error('Failed to fetch merchants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMerchants();
  }, []);

  if (loading) return <div>Loading...</div>;
  return <div>{/* render merchants */}</div>;
}
```

### 4. Type Safety

```typescript
import type { Merchant } from '@types';
import { merchantService } from '@services';

// TypeScript will enforce types
const merchant: Merchant = await merchantService.getById('M123');

// Type-safe updates
await merchantService.update('M123', {
  name: 'Updated Name', // OK
  invalidField: 'value', // TypeScript error
});
```

## Migration Guide

If you have existing code using the old API pattern, here's how to migrate:

### Old Pattern

```typescript
import { apiClient } from '@services';

const merchants = await apiClient.get('/merchants?page=1&pageSize=10');
const merchant = await apiClient.get('/merchants/M123');
```

### New Pattern

```typescript
import { merchantService } from '@services';

const response = await merchantService.getAll({ page: 1, pageSize: 10 });
const merchant = await merchantService.getById('M123');
```

## Examples

### Complete Login Flow

```typescript
import { useAuthStore } from '@stores';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error, isAuthenticated } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      // User will be redirected by useEffect above
    } catch (err) {
      // Error is already in the store
      console.error('Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### Paginated List with Filters

```typescript
import { useState, useEffect } from 'react';
import { merchantService } from '@services';
import type { Merchant, PaginatedResponse } from '@types';

function MerchantList() {
  const [data, setData] = useState<PaginatedResponse<Merchant> | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await merchantService.getAll({
          page,
          pageSize: 10,
          search,
          sortBy: 'createdAt',
          sortOrder: 'desc',
        });
        setData(response);
      } catch (error) {
        console.error('Failed to fetch merchants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, search]);

  if (loading && !data) return <div>Loading...</div>;

  return (
    <div>
      <input
        type="search"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1); // Reset to first page on search
        }}
        placeholder="Search merchants..."
      />

      {data?.data.map((merchant) => (
        <div key={merchant.id}>{merchant.name}</div>
      ))}

      <div>
        Page {data?.page} of {data?.totalPages}
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Previous
        </button>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === data?.totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

## Troubleshooting

### Token refresh loop

If you're experiencing infinite refresh loops, check:
1. The refresh endpoint is not protected by the auth interceptor
2. The refresh token is valid and not expired
3. The server returns a new accessToken and refreshToken in the correct format (camelCase)

### CORS errors

Ensure your backend allows:
- Origin: Your frontend URL
- Methods: GET, POST, PUT, DELETE, PATCH
- Headers: Authorization, Content-Type

### 401 errors after login

Check that:
1. Tokens are being stored in localStorage
2. The request interceptor is adding the Authorization header
3. The token format is `Bearer {token}`

## Support

For issues or questions, please contact the development team or create an issue in the project repository.
