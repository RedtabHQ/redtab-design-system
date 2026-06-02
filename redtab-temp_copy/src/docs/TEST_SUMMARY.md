# API Services Test Suite Summary

## Overview
Comprehensive unit tests have been created for all API service files in the frontend application. These tests use Vitest and properly mock Axios to ensure isolated, fast, and reliable testing.

## Test Files Created

### 1. **authApi.test.ts**
Tests authentication-related API calls including:
- Login (with/without 2FA)
- Registration
- Account activation
- Logout
- Token refresh (localStorage and sessionStorage)
- Current user retrieval
- Passwordless authentication (request & callback)
- Password reset (forgot & reset)
- Two-factor authentication (enable & verify)
- OAuth redirects (Google & Facebook)

**Coverage:** 17 test cases covering all authentication flows

### 2. **dashboardApi.test.ts**
Tests dashboard and portfolio metrics:
- Portfolio overview
- Tier distribution
- Risk metrics (PAR30, PAR60, PAR90, delinquency, default rates)
- Payment flow metrics
- Top merchants and suppliers (with custom limits)
- Trend data (with date ranges and intervals: day/week/month)
- Legacy dashboard endpoint

**Coverage:** 15 test cases covering all dashboard endpoints

### 3. **paymentApi.test.ts**
Tests payment operations:
- Payment creation (all types: DISBURSEMENT, REPAYMENT, FEE_COLLECTION)
- Fetch payment by ID
- Fetch all payments with filters (pagination, status, type)
- Fetch payments by contract, merchant, and supplier
- Process payments (with/without rail ID)
- Retry failed payments
- Cancel payments
- Payment statistics

**Coverage:** 18 test cases covering complete payment lifecycle

### 4. **userApi.test.ts**
Tests user management:
- Get current user
- Get all users with filters (pagination, role, status)
- Get user by ID
- Create user
- Update user (username, email, role, status)
- Update user settings (notifications, preferences, security)
- Delete user
- Upload avatar (with FormData)

**Coverage:** 19 test cases covering all user operations

### 5. **adminApi.test.ts**
Tests administrative operations:
- Get all credit lines, contracts, and decisions
- Freeze/unfreeze credit lines
- Override credit limits
- Toggle kill switch
- Admin request management (create, get all, get by ID, approve, reject)
- Request filtering and pagination

**Coverage:** 15 test cases covering admin workflows

### 6. **creditApi.test.ts**
Tests credit operations:
- Get credit line status
- Drawdown (with all optional fields)
- Post repayment (with payment method and transaction reference)
- Evaluate merchant eligibility (with/without requested amount)
- Error handling for insufficient credit, frozen lines, invalid amounts

**Coverage:** 11 test cases covering credit lifecycle

### 7. **roleApi.test.ts**
Tests role and permission management:
- Get all roles
- Get role by ID
- Create role (with/without description)
- Update role (name and description)
- Delete role
- Get and update role permissions
- Get users assigned to role
- Error handling for system roles and duplicates

**Coverage:** 14 test cases covering RBAC operations

### 8. **systemApi.test.ts**
Tests system configuration:
- Get system configuration
- Update system configuration
- Toggle kill switch (enable/disable)
- Set maintenance mode (enable/disable)
- Update individual feature flags
- Update individual settings (string, number, boolean values)
- Get system status
- Health check
- Ping endpoint

**Coverage:** 16 test cases covering system management

### 9. **apiKeyApi.test.ts**
Tests API key management:
- Create API key (with all fields and minimal fields)
- Get all API keys (with pagination and filters: merchantId, isActive)
- Revoke API keys
- Error handling for invalid scopes and non-existent keys

**Coverage:** 10 test cases covering API key lifecycle

### 10. **settlementApi.test.ts**
Tests settlement rail operations:
- Get all rails and active rails
- Get rail by ID
- Create settlement rail
- Update rail (status and configuration)
- Select best rail for transaction (with merchant/supplier context)
- Get transaction details
- Get transactions by payment
- Get rail statistics
- Initialize default rails

**Coverage:** 12 test cases covering settlement operations

### 11. **communicationApi.test.ts**
Tests communication operations:
- Send communications (EMAIL, SMS, WHATSAPP)
- Send payment reminders
- Send collection notices
- Send approval notifications
- Get communication by ID
- Get communications by recipient
- Get all communications with filters
- Communication statistics

**Coverage:** 14 test cases covering all communication channels

### 12. **apiService.test.ts**
Tests generic CRUD API service:
- getAll with pagination, sorting, search, and filters
- getById (string and number IDs)
- create resources
- update (PUT) resources
- patch resources
- delete resources
- bulk delete
- count with filters
- exists check
- Custom query endpoint
- Custom mutation endpoint

**Coverage:** 19 test cases covering generic service operations

## Testing Patterns Used

### 1. **Mocking Strategy**
- All tests use `vi.mock('./api')` to mock the apiClient
- Clean mocks before each test with `vi.clearAllMocks()`
- Mock localStorage and sessionStorage for auth tests

### 2. **Test Structure**
```typescript
describe('ServiceName', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('methodName', () => {
    it('should perform action successfully', async () => {
      // Arrange
      const mockData = { ... };
      vi.mocked(apiClient.method).mockResolvedValue(mockData);

      // Act
      const result = await service.method(params);

      // Assert
      expect(apiClient.method).toHaveBeenCalledWith(expectedUrl, expectedData);
      expect(result).toEqual(mockData);
    });

    it('should handle error cases', async () => {
      // Arrange
      const mockError = new Error('Error message');
      vi.mocked(apiClient.method).mockRejectedValue(mockError);

      // Act & Assert
      await expect(service.method(params)).rejects.toThrow('Error message');
    });
  });
});
```

### 3. **Coverage Areas**
Each test suite covers:
- **Happy path**: Successful API calls with expected responses
- **Variations**: Different parameter combinations and optional fields
- **Error handling**: Rejected promises and error responses
- **Edge cases**: Empty responses, invalid inputs, missing data
- **HTTP methods**: GET, POST, PUT, PATCH, DELETE
- **Query parameters**: Pagination, filtering, sorting
- **Request bodies**: JSON payloads and FormData

## Key Features

1. **Complete HTTP Method Coverage**
   - GET requests with query parameters
   - POST requests with body data
   - PUT requests for full updates
   - PATCH requests for partial updates
   - DELETE requests

2. **Parameter Handling**
   - Pagination (page, limit, pageSize)
   - Filtering (status, type, role, etc.)
   - Sorting (sortBy, sortOrder)
   - Search queries
   - Optional parameters

3. **Error Scenarios**
   - Not found errors
   - Validation errors
   - Authentication errors
   - Business logic errors
   - Network errors

4. **Response Formats**
   - Single objects
   - Arrays
   - Paginated responses
   - Statistics and metrics
   - Empty responses

## Running the Tests

```bash
# Run all service tests
npm test src/services/

# Run specific service test
npm test src/services/authApi.test.ts

# Run with coverage
npm test -- --coverage src/services/

# Run in watch mode
npm test -- --watch src/services/

# Run with UI
npm test -- --ui src/services/
```

## Test Statistics

- **Total Test Files:** 12
- **Total Test Cases:** ~180+
- **Lines of Test Code:** ~3,500+
- **Coverage Target:** All public API methods

## Best Practices Followed

1. **Isolation**: Each test is independent and doesn't affect others
2. **Clarity**: Test names clearly describe what is being tested
3. **AAA Pattern**: Arrange, Act, Assert structure
4. **Mock Cleanup**: BeforeEach hooks ensure clean state
5. **Type Safety**: Full TypeScript typing throughout tests
6. **Realistic Data**: Mock data mirrors actual API responses
7. **Error Testing**: Both success and failure paths tested
8. **Documentation**: Each test suite has descriptive test names

## Integration with CI/CD

These tests are designed to:
- Run quickly (no real network calls)
- Run reliably (no external dependencies)
- Fail fast (clear error messages)
- Support continuous integration
- Generate coverage reports

## Maintenance Notes

When adding new API methods:
1. Add the method to the service file
2. Create corresponding test cases
3. Test both success and error scenarios
4. Update this summary document

When API endpoints change:
1. Update the service implementation
2. Update the test expectations
3. Run tests to verify changes
4. Check coverage hasn't decreased
