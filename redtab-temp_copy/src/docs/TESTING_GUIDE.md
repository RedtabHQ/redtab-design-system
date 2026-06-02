# React Hooks Testing Guide

## Quick Start

### Run All Tests
```bash
cd /Users/vuquangthinh/Documents/redtab/RPL/frontend
npm test
```

### Run Specific Test Files
```bash
# Auth hooks
npm test -- useAuth

# Dashboard hooks
npm test -- useDashboard

# Merchant hooks
npm test -- useMerchants

# Payment hooks
npm test -- usePayments

# All hooks matching pattern
npm test -- use
```

### Watch Mode (Auto-rerun on file changes)
```bash
npm test
# Press 'a' to run all tests
# Press 'f' to run only failed tests
# Press 'p' to filter by filename pattern
```

### Coverage Report
```bash
npm test:coverage

# View HTML coverage report
open coverage/index.html
```

### Interactive UI
```bash
npm test:ui
# Opens browser-based test UI
```

## Test File Locations

All test files are located next to their corresponding hook files:
```
src/hooks/
├── useAuth.ts
├── useAuth.test.ts          ✓ 38 tests
├── useDashboard.ts
├── useDashboard.test.ts     ✓ 28 tests
├── useMerchants.ts
├── useMerchants.test.ts     ✓ 21 tests
├── usePayments.ts
├── usePayments.test.ts      ✓ 24 tests
├── useContracts.ts
├── useContracts.test.ts     ✓ 18 tests
├── useCredit.ts
├── useCredit.test.ts        ✓ 22 tests
├── useUsers.ts
├── useUsers.test.ts         ✓ 24 tests
├── useSuppliers.ts
├── useSuppliers.test.ts     ✓ 12 tests
├── useTransactions.ts
├── useTransactions.test.ts  ✓ 8 tests
├── useRoles.ts
├── useRoles.test.ts         ✓ 14 tests
├── useApiKeys.ts
└── useApiKeys.test.ts       ✓ 12 tests
```

## Common Testing Scenarios

### Testing Query Hooks
```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { createTestQueryClient } from '@/test/test-utils';
import { QueryClientProvider } from '@tanstack/react-query';

it('should fetch data', async () => {
  const queryClient = createTestQueryClient();
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  vi.mocked(api.getData).mockResolvedValueOnce(mockData);

  const { result } = renderHook(() => useMyHook(), { wrapper });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));

  expect(result.current.data).toEqual(mockData);
});
```

### Testing Mutation Hooks
```typescript
it('should mutate and invalidate cache', async () => {
  const queryClient = createTestQueryClient();
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  vi.mocked(api.create).mockResolvedValueOnce(mockResult);

  const { result } = renderHook(() => useCreateHook(), { wrapper });

  result.current.mutate(inputData);

  await waitFor(() => expect(result.current.isSuccess).toBe(true));

  expect(api.create).toHaveBeenCalledWith(inputData);
});
```

### Testing Error Cases
```typescript
it('should handle errors', async () => {
  const error = new Error('API Error');
  vi.mocked(api.getData).mockRejectedValueOnce(error);

  const { result } = renderHook(() => useMyHook(), { wrapper });

  await waitFor(() => expect(result.current.isError).toBe(true));

  expect(result.current.error).toEqual(error);
});
```

### Testing Loading States
```typescript
it('should show loading state', async () => {
  let resolvePromise;
  vi.mocked(api.getData).mockReturnValueOnce(
    new Promise((resolve) => { resolvePromise = resolve; })
  );

  const { result } = renderHook(() => useMyHook(), { wrapper });

  expect(result.current.isLoading).toBe(true);

  resolvePromise(mockData);

  await waitFor(() => expect(result.current.isLoading).toBe(false));
});
```

## Debugging Tests

### Enable Verbose Output
```bash
npm test -- --reporter=verbose
```

### Debug Single Test
```bash
npm test -- --reporter=verbose -t "should fetch data"
```

### Debug with Browser DevTools
Add `debugger` statement in test and run:
```bash
node --inspect-brk ./node_modules/vitest/vitest.mjs run
```

### View React Query Cache State
```typescript
it('should cache data', async () => {
  const { result } = renderHook(() => useMyHook(), { wrapper });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));

  // Inspect cache
  const cacheData = queryClient.getQueryData(['my-key']);
  console.log('Cache:', cacheData);
});
```

## Common Issues & Solutions

### Issue: Tests hang on async operations
**Solution:** Ensure all async operations use `await waitFor()`
```typescript
// Bad
result.current.mutate(data);
expect(result.current.isSuccess).toBe(true); // Fails

// Good
result.current.mutate(data);
await waitFor(() => expect(result.current.isSuccess).toBe(true));
```

### Issue: Mock not being called
**Solution:** Verify mock is set up before hook renders
```typescript
// Bad
const { result } = renderHook(() => useMyHook(), { wrapper });
vi.mocked(api.getData).mockResolvedValueOnce(mockData); // Too late!

// Good
vi.mocked(api.getData).mockResolvedValueOnce(mockData);
const { result } = renderHook(() => useMyHook(), { wrapper });
```

### Issue: Cache pollution between tests
**Solution:** Use `beforeEach` to create fresh QueryClient
```typescript
beforeEach(() => {
  queryClient = createTestQueryClient();
  vi.clearAllMocks();
});
```

### Issue: TypeScript errors with mocks
**Solution:** Use `vi.mocked()` for type inference
```typescript
// Bad
(api.getData as any).mockResolvedValueOnce(mockData);

// Good
vi.mocked(api.getData).mockResolvedValueOnce(mockData);
```

## Test Maintenance

### Adding Tests for New Hooks

1. Create test file next to hook: `useMyHook.test.ts`
2. Follow existing pattern from similar hooks
3. Include these test cases:
   - ✓ Successful data fetch/mutation
   - ✓ Error handling
   - ✓ Loading states
   - ✓ Cache invalidation
   - ✓ Edge cases (empty IDs, conditional fetching)

### Updating Tests When Hooks Change

1. Update mock responses to match new API structure
2. Add tests for new functionality
3. Update cache invalidation tests if keys changed
4. Run coverage to ensure no gaps: `npm test:coverage`

### Best Practices

1. **Keep tests isolated** - Use `beforeEach` for setup
2. **Test behavior, not implementation** - Focus on what hooks do, not how
3. **Use meaningful test names** - Describe expected behavior
4. **Mock external dependencies** - Keep tests fast and reliable
5. **Test error cases** - Don't just test happy paths
6. **Verify cache updates** - Ensure mutations invalidate correctly

## Performance Tips

### Speed Up Test Execution
```typescript
// Disable retries in test QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});
```

### Run Tests in Parallel
```bash
# Vitest runs in parallel by default
npm test

# Adjust worker threads
npm test -- --maxWorkers=4
```

### Skip Slow Tests During Development
```typescript
it.skip('slow integration test', async () => {
  // This test will be skipped
});
```

## CI/CD Integration

### GitHub Actions Example
```yaml
- name: Run tests
  run: npm test:run

- name: Generate coverage
  run: npm test:coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/lcov.info
```

### Pre-commit Hook
```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm test:run"
    }
  }
}
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [React Query Testing](https://tanstack.com/query/latest/docs/react/guides/testing)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Getting Help

If tests are failing:
1. Check the error message carefully
2. Verify mocks are properly set up
3. Ensure async operations use `waitFor`
4. Check query keys match expected format
5. Review similar working tests for patterns

For questions or issues, consult the TEST_SUMMARY.md file or reach out to the development team.
