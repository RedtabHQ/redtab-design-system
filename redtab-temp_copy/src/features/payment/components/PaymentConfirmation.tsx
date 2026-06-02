import { useState } from 'react';
import { CloseIcon, CheckIcon, ErrorCircleIcon } from '@/components/icons';
import { Spinner, InlineSpinner } from '@/components/common';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { paymentIntentService } from '@/features/payment/services/paymentIntentService';
import { PaymentIntent, PaymentIntentStatus } from '@/types/payment-intent';
import { DEFAULT_CURRENCY_LOCALE } from '@/constants/currency';
import { formatDateTime } from '@/utils/dateFormatter';

export default function PaymentConfirmation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const paymentIntentId = searchParams.get('payment_id');
  const token = searchParams.get('token');

  const [processingError, setProcessingError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: paymentIntent,
    isLoading,
    error: queryError,
  } = useQuery<PaymentIntent>({
    queryKey: ['payment-intent', paymentIntentId],
    queryFn: () => paymentIntentService.getByPaymentIntentId(paymentIntentId as string),
    enabled: !!paymentIntentId && !!token,
  });

  const status = paymentIntent?.status as PaymentIntentStatus | undefined;

  const processPaymentMutation = useMutation({
    mutationFn: ({ intentId, tokenValue }: { intentId: string; tokenValue: string }) =>
      paymentIntentService.processPayment(intentId, { token: tokenValue }),
    onSuccess: () => {
      setSuccess(true);
      if (paymentIntentId) {
        queryClient.invalidateQueries({ queryKey: ['payment-intent', paymentIntentId] });
      }
    },
    onError: (err: Error) => {
      const axiosError = err as Error & { response?: { data?: { message?: string } } };
      setProcessingError(axiosError.response?.data?.message || err.message || 'Failed to process payment');
    },
  });

  const missingParams = !paymentIntentId || !token;
  const errorMessage = missingParams
    ? 'Missing payment intent ID or token'
    : processingError ||
      (queryError instanceof Error ? queryError.message : queryError ? 'Failed to load payment intent' : null);

  const handleConfirmPayment = async () => {
    if (!paymentIntentId || !token) return;

    try {
      setProcessingError(null);
      await processPaymentMutation.mutateAsync({ intentId: paymentIntentId, tokenValue: token });
    } catch {
      // Errors are handled in mutation onError
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spinner size="lg" variant="primary" className="mx-auto" />
          <p className="mt-4 text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (errorMessage && !paymentIntent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <CloseIcon className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Error</h3>
            <p className="mt-2 text-sm text-gray-500">{errorMessage}</p>
            <button
              onClick={() => navigate('/')}
              className="mt-6 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (success || paymentIntent?.status === PaymentIntentStatus.COMPLETED) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <CheckIcon className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Payment Successful</h3>
            <p className="mt-2 text-sm text-gray-500">
              Your payment has been processed successfully.
            </p>
            <div className="mt-6 border-t border-gray-200 pt-4">
              <dl className="space-y-2">
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-600">Payment ID:</dt>
                  <dd className="font-medium text-gray-900">{paymentIntent?.paymentIntentId}</dd>
                </div>
                <div className="flex justify-between text-sm">
                  <dt className="text-gray-600">Amount:</dt>
                  <dd className="font-medium text-gray-900">
                    {paymentIntent?.currency} {paymentIntent?.amount.toLocaleString(DEFAULT_CURRENCY_LOCALE)}
                  </dd>
                </div>
                {paymentIntent?.contractId && (
                  <div className="flex justify-between text-sm">
                    <dt className="text-gray-600">Contract ID:</dt>
                    <dd className="font-medium text-gray-900">{paymentIntent.contractId}</dd>
                  </div>
                )}
              </dl>
            </div>
            <button
              onClick={() => navigate('/')}
              className="mt-6 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Confirm Payment</h2>
          <p className="mt-2 text-sm text-gray-600">
            Please review the payment details below
          </p>
        </div>

        <div className="mt-8 border-t border-b border-gray-200 py-6">
          <dl className="space-y-4">
            <div className="flex justify-between">
              <dt className="text-sm font-medium text-gray-600">Payment ID:</dt>
              <dd className="text-sm text-gray-900">{paymentIntent?.paymentIntentId}</dd>
            </div>

            <div className="flex justify-between">
              <dt className="text-sm font-medium text-gray-600">Amount:</dt>
              <dd className="text-lg font-bold text-gray-900">
                {paymentIntent?.currency} {paymentIntent?.amount.toLocaleString(DEFAULT_CURRENCY_LOCALE)}
              </dd>
            </div>

            {paymentIntent?.description && (
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-600">Description:</dt>
                <dd className="text-sm text-gray-900">{paymentIntent.description}</dd>
              </div>
            )}

            {paymentIntent?.contractId && (
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-600">Contract ID:</dt>
                <dd className="text-sm text-gray-900">{paymentIntent.contractId}</dd>
              </div>
            )}

            {paymentIntent?.orderData && (
              <div>
                <dt className="text-sm font-medium text-gray-600 mb-2">Order Details:</dt>
                <dd className="text-sm text-gray-900 bg-gray-50 rounded p-3">
                  <pre className="whitespace-pre-wrap text-xs">
                    {JSON.stringify(paymentIntent.orderData, null, 2)}
                  </pre>
                </dd>
              </div>
            )}

            <div className="flex justify-between">
              <dt className="text-sm font-medium text-gray-600">Status:</dt>
              <dd>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  status === PaymentIntentStatus.TOKEN_GENERATED
                    ? 'bg-yellow-100 text-yellow-800'
                    : status === PaymentIntentStatus.COMPLETED
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {status}
                </span>
              </dd>
            </div>

            {paymentIntent?.expiresAt && (
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-600">Expires At:</dt>
                <dd className="text-sm text-gray-900">
                  {formatDateTime(paymentIntent.expiresAt)}
                </dd>
              </div>
            )}
          </dl>
        </div>

        {errorMessage && (
          <div className="mt-4 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ErrorCircleIcon className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="mt-1 text-sm text-red-700">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6">
          <button
            onClick={handleConfirmPayment}
            disabled={processPaymentMutation.isPending || paymentIntent?.status === PaymentIntentStatus.PROCESSING}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              processPaymentMutation.isPending || paymentIntent?.status === PaymentIntentStatus.PROCESSING
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
          >
            {processPaymentMutation.isPending || paymentIntent?.status === PaymentIntentStatus.PROCESSING ? (
              <>
                <InlineSpinner size="sm" variant="white" />
                Processing...
              </>
            ) : (
              'Confirm Payment'
            )}
          </button>

          <button
            onClick={() => navigate('/')}
            className="mt-3 w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
