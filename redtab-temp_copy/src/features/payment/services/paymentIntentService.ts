import axios from 'axios';
import {
  PaymentIntent,
  ProcessPaymentRequest,
} from '@/types/payment-intent';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const paymentIntentService = {
  async getByPaymentIntentId(paymentIntentId: string): Promise<PaymentIntent> {
    const response = await axios.get(
      `${API_BASE_URL}/v1/payment-intents/payment-intent-id/${paymentIntentId}`,
    );
    return response.data;
  },

  async processPayment(
    paymentIntentId: string,
    data: ProcessPaymentRequest,
  ): Promise<PaymentIntent> {
    const response = await axios.post(
      `${API_BASE_URL}/v1/payment-intents/process/${paymentIntentId}`,
      data,
    );
    return response.data;
  },
};
