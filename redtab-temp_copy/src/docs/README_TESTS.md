# API Service Tests - Quick Start Guide

## Test Files Overview

All API service files now have comprehensive unit tests with `.test.ts` extension:

```
src/services/
├── adminApi.test.ts           - Admin operations tests
├── apiKeyApi.test.ts          - API key management tests
├── apiService.test.ts         - Generic CRUD service tests
├── authApi.test.ts            - Authentication tests
├── communicationApi.test.ts   - Communication channel tests
├── creditApi.test.ts          - Credit operations tests
├── dashboardApi.test.ts       - Dashboard metrics tests
├── paymentApi.test.ts         - Payment operations tests
├── roleApi.test.ts            - Role & permissions tests
├── settlementApi.test.ts      - Settlement rail tests
├── systemApi.test.ts          - System configuration tests
└── userApi.test.ts            - User management tests
```

## Running Tests

### Run All Service Tests
```bash
npm test src/services/
```

### Run Specific Test File
```bash
npm test src/services/authApi.test.ts
npm test src/services/paymentApi.test.ts
```

### Run Tests in Watch Mode
```bash
npm test -- --watch src/services/
```

### Run Tests with Coverage
```bash
npm test -- --coverage src/services/
```

### Run Tests with UI
```bash
npm test -- --ui src/services/
```

## Test Structure

Each test file follows this pattern:

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { serviceApi } from './serviceApi';
import { apiClient } from './api';

// Mock the API client
vi.mock('./api', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('serviceApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('methodName', () => {
    it('should perform action successfully', async () => {
      // Arrange
      const mockResponse = { id: '1', data: 'test' };
      vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

      // Act
      const result = await serviceApi.methodName('param');

      // Assert
      expect(apiClient.get).toHaveBeenCalledWith('/expected/url', 'param');
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors', async () => {
      // Arrange
      const mockError = new Error('API Error');
      vi.mocked(apiClient.get).mockRejectedValue(mockError);

      // Act & Assert
      await expect(serviceApi.methodName('param')).rejects.toThrow('API Error');
    });
  });
});
```

## What's Tested

### For Each Service Method:
1. ✅ **Success scenarios** - Method calls with valid data
2. ✅ **Error handling** - Rejected promises and error responses
3. ✅ **Parameter variations** - Different combinations of optional parameters
4. ✅ **Request formatting** - Correct URL, headers, and body
5. ✅ **Response handling** - Correct return type and data structure

### HTTP Methods Covered:
- **GET** - Fetching resources, list endpoints
- **POST** - Creating resources, mutations
- **PUT** - Full resource updates
- **PATCH** - Partial resource updates
- **DELETE** - Resource deletion

### Common Test Scenarios:
- Pagination (page, limit, pageSize)
- Filtering (status, type, role, etc.)
- Sorting (sortBy, sortOrder)
- Search queries
- Optional parameters
- Empty responses
- Not found errors
- Validation errors

## Example Test Cases

### Testing GET with Query Parameters
```typescript
it('should fetch with pagination and filters', async () => {
  const params = { page: 1, limit: 10, status: 'active' };
  const mockResponse = { data: [...], total: 100 };
  
  vi.mocked(apiClient.get).mockResolvedValue(mockResponse);
  
  const result = await api.getAll(params);
  
  expect(apiClient.get).toHaveBeenCalledWith('/endpoint', { params });
  expect(result).toEqual(mockResponse);
});
```

### Testing POST with Body Data
```typescript
it('should create resource with data', async () => {
  const createData = { name: 'Test', value: 42 };
  const mockResponse = { id: '1', ...createData };
  
  vi.mocked(apiClient.post).mockResolvedValue(mockResponse);
  
  const result = await api.create(createData);
  
  expect(apiClient.post).toHaveBeenCalledWith('/endpoint', createData);
  expect(result).toEqual(mockResponse);
});
```

### Testing Error Handling
```typescript
it('should handle API errors', async () => {
  const mockError = new Error('Resource not found');
  vi.mocked(apiClient.get).mockRejectedValue(mockError);
  
  await expect(api.getById('invalid-id')).rejects.toThrow('Resource not found');
});
```

## Debugging Tests

### View Detailed Test Output
```bash
npm test -- --reporter=verbose src/services/
```

### Run Single Test
```typescript
it.only('should test specific scenario', async () => {
  // This test will run alone
});
```

### Skip Tests
```typescript
it.skip('should test later', async () => {
  // This test will be skipped
});
```

### Debug Mode
```bash
node --inspect-brk node_modules/.bin/vitest src/services/authApi.test.ts
```

## Coverage Reports

After running tests with coverage:
```bash
npm test -- --coverage src/services/
```

Coverage reports are generated in:
- `coverage/` directory (HTML report)
- Console output (text summary)

### Coverage Targets
- **Lines**: >90%
- **Functions**: >90%
- **Branches**: >85%
- **Statements**: >90%

## Common Issues & Solutions

### Issue: Tests hanging or timing out
**Solution**: Check for missing `await` keywords or unresolved promises

### Issue: Mock not being called
**Solution**: Ensure `vi.clearAllMocks()` is in `beforeEach()` and mock is set before the call

### Issue: Type errors in tests
**Solution**: Use `vi.mocked()` helper to properly type mocked functions

### Issue: Tests failing randomly
**Solution**: Check for shared state or missing cleanup in `beforeEach`/`afterEach`

## Mocking Best Practices

### Mock Setup
```typescript
vi.mock('./api', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));
```

### Mock Response
```typescript
vi.mocked(apiClient.get).mockResolvedValue({ data: 'test' });
```

### Mock Error
```typescript
vi.mocked(apiClient.post).mockRejectedValue(new Error('Failed'));
```

### Verify Calls
```typescript
expect(apiClient.get).toHaveBeenCalledTimes(1);
expect(apiClient.get).toHaveBeenCalledWith('/endpoint', { params: {...} });
```

## Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Best Practices](https://testing-library.com/docs/)
- [Test Summary](./TEST_SUMMARY.md) - Detailed coverage report

## Maintenance

When adding new API methods:
1. Add method to service file
2. Create test cases in corresponding `.test.ts` file
3. Test success path
4. Test error scenarios
5. Test parameter variations
6. Run tests and verify coverage

When modifying existing methods:
1. Update service implementation
2. Update test expectations
3. Add tests for new behavior
4. Ensure existing tests still pass
5. Check coverage hasn't decreased
