export enum WebhookEventType {
  ALL = '*',
  PAYMENT_INTENT_CREATED = 'payment_intent.created',
  PAYMENT_INTENT_TOKEN_GENERATED = 'payment_intent.token_generated',
  PAYMENT_INTENT_PROCESSING = 'payment_intent.processing',
  PAYMENT_INTENT_COMPLETED = 'payment_intent.completed',
  PAYMENT_INTENT_FAILED = 'payment_intent.failed',
  PAYMENT_INTENT_EXPIRED = 'payment_intent.expired',
  PAYMENT_INTENT_CANCELLED = 'payment_intent.cancelled',
  CONTRACT_CREATED = 'contract.created',
  CONTRACT_UPDATED = 'contract.updated',
  CONTRACT_PAID = 'contract.paid',
  CONTRACT_OVERDUE = 'contract.overdue',
  PAYMENT_COMPLETED = 'payment.completed',
  PAYMENT_FAILED = 'payment.failed',
  PAYMENT_REFUNDED = 'payment.refunded',
  CREDIT_LINE_FROZEN = 'credit_line.frozen',
  CREDIT_LINE_UNFROZEN = 'credit_line.unfrozen',
  CREDIT_LINE_UPDATED = 'credit_line.updated',
}

export enum WebhookLogStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  RETRYING = 'RETRYING',
}

export interface WebhookConfig {
  id: string;
  userId: string;
  url: string;
  eventType: WebhookEventType;
  description?: string;
  isActive: boolean;
  secret?: string;
  headers?: Record<string, string>;
  maxRetries: number;
  timeoutMs: number;
  successCount: string;
  failureCount: string;
  lastTriggeredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface WebhookLog {
  id: string;
  userId: string;
  webhookConfigId: string;
  eventType: WebhookEventType;
  url: string;
  requestPayload: any;
  requestHeaders?: Record<string, string>;
  responseData?: any;
  responseStatusCode?: number;
  responseHeaders?: Record<string, string>;
  status: WebhookLogStatus;
  errorMessage?: string;
  attemptNumber: number;
  durationMs?: number;
  completedAt?: Date;
  createdAt: Date;
  webhookConfig?: WebhookConfig;
}

export interface ApiKey {
  id: string;
  name: string;
  scopes: string[];
  environment: 'production' | 'development' | 'test';
  isActive: boolean;
  requestCount: string;
  lastUsedAt?: Date;
  createdAt: Date;
  keyPrefix: string;
}

export interface ApiKeyCreation extends ApiKey {
  key: string;
  warning: string;
}

export interface WebhookStats {
  totalConfigs: number;
  activeConfigs: number;
  totalSuccess: number;
  totalFailure: number;
  successRate: string;
  recentLogs: WebhookLog[];
}
