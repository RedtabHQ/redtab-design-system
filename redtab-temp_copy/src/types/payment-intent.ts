export enum PaymentIntentStatus {
  PENDING = 'PENDING',
  TOKEN_GENERATED = 'TOKEN_GENERATED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

export interface PaymentIntent {
  id: string;
  paymentIntentId: string;
  merchantId?: string;
  supplierId?: string;
  contractId?: string;
  amount: number;
  currency: string;
  orderData?: any;
  metadata?: any;
  status: PaymentIntentStatus;
  description?: string;
  tokenExpiryMinutes: number;
  completedAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface GenerateTokenResponse {
  token: string;
  paymentIntentId: string;
  expiresAt: Date;
  ttl: number;
}

export interface ProcessPaymentRequest {
  token: string;
  paymentData?: any;
}
