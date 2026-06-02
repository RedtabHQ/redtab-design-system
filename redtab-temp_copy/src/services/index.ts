// src/services/index.ts
// Infrastructure re-exports (thin barrel — kept for any remaining cross-feature callers)
export { apiClient } from '@/lib/api';
export { ApiService } from '@/lib/apiService';
export {
  merchantService,
  contractService,
  supplierService,
  transactionService,
  auditLogService,
  policyService,
  creditScoreService,
  categoryService,
  supplierCategoryService, // Alias for backward compatibility
  settlementRailService,
} from '@/lib/apiService';
export type { PaginationParams, FilterParams } from '@/lib/apiService';

// Auth
export { authApi } from '@/features/auth/services/authApi';
export type {
  LoginCredentials,
  LoginResponse,
  RefreshTokenResponse,
  RegisterData,
  RegisterResponse,
  PasswordlessRequestResponse,
  PasswordlessCallbackResponse,
  ForgotPasswordResponse,
  ResetPasswordData,
  ResetPasswordResponse,
  Enable2FAResponse,
  Verify2FAResponse,
  ActivateAccountResponse,
} from '@/features/auth/services/authApi';

// Payment
export { paymentApi } from '@/features/payment/services/paymentApi';
export type { CreatePaymentData, ProcessPaymentData } from '@/features/payment/services/paymentApi';

// Settlement
export { settlementApi } from '@/features/settlement/services/settlementApi';
export type {
  CreateRailData,
  UpdateRailData,
  SelectBestRailParams,
  SettlementRailsFilterParams,
} from '@/features/settlement/services/settlementApi';

// Communication
export { communicationApi, communicationService } from '@/features/communication/services/communicationApi';
export type { SendCommunicationData } from '@/features/communication/services/communicationApi';

// Users
export { userApi } from '@/features/users/services/userApi';
export type {
  CreateUserData,
  UpdateUserData,
  UpdateUserSettingsData,
} from '@/features/users/services/userApi';

// Roles
export { roleApi } from '@/features/users/services/roleApi';
export type {
  CreateRoleData,
  UpdateRoleData,
  UpdatePermissionsData,
} from '@/features/users/services/roleApi';

// Dashboard
export { dashboardApi } from '@/features/dashboard/services/dashboardApi';
export type { GetTrendsParams } from '@/features/dashboard/services/dashboardApi';

// Credit
export { creditApi } from '@/features/credit/services/creditApi';
export type {
  DrawdownData,
  PostRepaymentData,
  EligibilityParams,
} from '@/features/credit/services/creditApi';

// Admin / System
export { systemApi } from '@/features/admin/services/systemApi';
export type {
  UpdateConfigData,
  UpdateFeatureFlagData,
  UpdateSettingData,
} from '@/features/admin/services/systemApi';

// Developer
export { apiKeyApi } from '@/features/developer/services/apiKeyApi';

// Legacy inline services (no feature home — kept here)
import { apiClient } from '@/lib/api';
import type { CreditScore, PortfolioMetrics } from '@types';

export const scoringService = {
  async getScore(merchantId: string) {
    return apiClient.get<CreditScore>(`/credit-decisions/score/${merchantId}`);
  },
};

export const portfolioService = {
  async getMetrics() {
    return apiClient.get<PortfolioMetrics>(`/dashboard/metrics`);
  },
};

export const contractKpiService = {
  async getKpis(params?: Record<string, unknown>) {
    return apiClient.get<{
      totalContracts: number;
      totalDisbursed: number;
      segmentRecovery?: number;
      overdueContracts: number;
      defaultedContracts: number;
    }>(`/contracts/kpi`, { params });
  },
};
