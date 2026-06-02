
import React, { useState } from 'react';
import { ShoppingCart, ArrowRight, CheckCircle, Clock, ShieldCheck } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { useMerchantProfile, useMerchantCreditLine, useMerchantActiveContracts, merchantPortalKeys } from '../hooks/useMerchantPortal';
import { useSuppliers } from '@/features/suppliers/hooks/useSuppliers';
import { useDrawdown, usePostRepayment } from '@/features/credit/hooks/useCredit';
import { usePolicyConfig } from '@/features/merchants/hooks';
import type { Contract, Supplier } from '@/types';
import SupplierSelection from '@/components/SupplierSelection';
import { DEFAULT_CURRENCY_LOCALE, getCurrencySymbol } from '@/constants/currency';

const MerchantPortal: React.FC = () => {
  // 0. Query client for cache invalidation
  const queryClient = useQueryClient();

  // 1. Authentication
  const { user, isAuthenticated } = useAuthStore();
  const merchantId = user?.id;

  // 2. Data fetching
  const { data: merchant, isLoading: isLoadingMerchant, error: merchantError } = useMerchantProfile({
    enabled: isAuthenticated
  });

  const { data: creditLine, isLoading: isLoadingCredit } = useMerchantCreditLine({
    enabled: isAuthenticated
  });

  const { data: suppliersData, isLoading: isLoadingSuppliers } = useSuppliers(
    { pageSize: 1000 },
    { enabled: isAuthenticated }
  );
  const suppliers = suppliersData?.items || [];

  const { data: contractsData, isLoading: isLoadingContracts } = useMerchantActiveContracts({
    enabled: isAuthenticated
  });
  const activeContracts = contractsData?.items || [];

  // 3. Mutations
  const drawdownMutation = useDrawdown();
  const repaymentMutation = usePostRepayment();

  const { data: policyConfig } = usePolicyConfig();

  // 5. Local state
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  // Authentication check
  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <div className="bg-amber-50 p-8 rounded-3xl border border-amber-200">
          <h2 className="text-lg font-bold text-amber-900">Authentication Required</h2>
          <p className="text-amber-700 mt-2">Please log in to access the merchant portal.</p>
        </div>
      </div>
    );
  }

  // Loading state
  const isLoading = isLoadingMerchant || isLoadingCredit || isLoadingSuppliers || isLoadingContracts;

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="animate-pulse space-y-4">
          <div className="h-16 bg-gray-200 rounded-xl"></div>
          <div className="h-96 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (merchantError || !merchant || !creditLine) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <div className="bg-red-50 p-8 rounded-3xl border border-red-200">
          <h2 className="text-lg font-bold text-red-900">Error Loading Portal</h2>
          <p className="text-red-700 mt-2">
            {merchantError instanceof Error ? merchantError.message : 'Failed to load merchant data'}
          </p>
        </div>
      </div>
    );
  }

  const handleCheckout = () => {
    const amt = parseFloat(purchaseAmount);

    if (isNaN(amt) || amt <= 0) {
      setMessage({ text: 'Please enter a valid amount.', type: 'error' });
      return;
    }
    if (!selectedSupplierId) {
      setMessage({ text: 'Please select a supplier.', type: 'error' });
      return;
    }

    const availableCredit = creditLine.maxLimit - creditLine.currentUtilization;
    if (amt > availableCredit) {
      setMessage({ text: 'Insufficient credit limit.', type: 'error' });
      return;
    }

    drawdownMutation.mutate(
      {
        merchantId: merchantId!,
        data: {
          amount: amt,
          supplierId: selectedSupplierId,
          purpose: 'Purchase financing'
        }
      },
      {
        onSuccess: () => {
          // Invalidate relevant query caches
          queryClient.invalidateQueries({ queryKey: merchantPortalKeys.creditLine() });
          queryClient.invalidateQueries({ queryKey: merchantPortalKeys.activeContracts() });

          setMessage({ text: 'Financing approved! Funds disbursed to supplier.', type: 'success' });
          setPurchaseAmount('');
          setSelectedSupplierId('');
        },
        onError: (error) => {
          setMessage({
            text: error instanceof Error ? error.message : 'Financing rejected.',
            type: 'error'
          });
        }
      }
    );
  };

  const handleRepayment = (contractId: string, amount: number) => {
    repaymentMutation.mutate(
      {
        contractId,
        amount,
        paymentMethod: 'MANUAL'
      },
      {
        onSuccess: () => {
          // Invalidate relevant query caches
          queryClient.invalidateQueries({ queryKey: merchantPortalKeys.creditLine() });
          queryClient.invalidateQueries({ queryKey: merchantPortalKeys.activeContracts() });

          setMessage({ text: 'Payment processed successfully!', type: 'success' });
        },
        onError: (error) => {
          setMessage({
            text: error instanceof Error ? error.message : 'Payment failed.',
            type: 'error'
          });
        }
      }
    );
  };

  const tierPolicy =
    merchant.tier && policyConfig
      ? policyConfig.TIERS[merchant.tier as keyof typeof policyConfig.TIERS]
      : undefined;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {merchant.name}</h1>
          <p className="text-gray-500">Manage your working capital financing in {merchant.currency?.code}.</p>
        </div>
        <div className="px-4 py-2 bg-indigo-50 rounded-full border border-indigo-100 flex items-center gap-2 text-indigo-700 text-sm font-bold">
          <ShieldCheck size={16} /> Tier: {merchant.tier}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-gradient-to-br from-red-600 to-red-800 p-8 rounded-3xl text-white shadow-xl">
          <p className="text-red-100 text-sm mb-1 uppercase font-bold tracking-wider">Available Credit</p>
          <h2 className="text-4xl font-bold mb-6">{merchant.currency?.code} {(creditLine.maxLimit - creditLine.currentUtilization).toLocaleString(DEFAULT_CURRENCY_LOCALE)}</h2>
          <div className="space-y-4">
            <div className="bg-white/10 p-4 rounded-2xl">
              <div className="flex justify-between text-xs mb-1">
                <span className="opacity-70">Utilization</span>
                <span>{((creditLine.currentUtilization / creditLine.maxLimit) * 100).toLocaleString(DEFAULT_CURRENCY_LOCALE, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%</span>
              </div>
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="bg-white h-full" style={{ width: `${(creditLine.currentUtilization / creditLine.maxLimit) * 100}%` }} />
              </div>
            </div>
            <p className="text-xs opacity-70">Limit: {merchant.currency?.code} {creditLine.maxLimit.toLocaleString(DEFAULT_CURRENCY_LOCALE)}</p>
          </div>
        </div>

        <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <ShoppingCart className="text-redtab" /> New Purchase Financing
          </h3>
          <div className="flex-1 flex flex-col justify-center">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Authorized Supplier</label>
                  <SupplierSelection
                    value={selectedSupplierId}
                    onChange={setSelectedSupplierId}
                    suppliers={suppliers}
                    merchantCurrency={merchant.currency?.code}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Invoice Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-xs">{merchant.currency?.code}</span>
                    <input
                      type="number"
                      placeholder="Enter amount..."
                      className="w-full pl-16 pr-4 py-4 bg-gray-50 border border-gray-100 rounded text-sm font-bold outline-none focus:ring-2 focus:ring-redtab shadow-inner"
                      value={purchaseAmount}
                      onChange={(e) => setPurchaseAmount(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl text-xs+ text-gray-600 font-medium">
                <p>Terms: <strong>{tierPolicy?.maxTenure} Days</strong> at <strong>{(tierPolicy?.feeRate ?? 0) * 100}% flat fee</strong>.</p>
              </div>
              <button
                onClick={handleCheckout}
                disabled={drawdownMutation.isPending}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-lg hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {drawdownMutation.isPending ? 'Processing...' : 'Checkout Pay Later'} <ArrowRight size={20} />
              </button>
              {message && (
                <p className={`text-center font-bold text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  {message.text}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
        <div className="p-6 border-b border-gray-50 bg-gray-50/20 flex justify-between items-center">
          <h3 className="font-black text-xs uppercase tracking-widest text-gray-400">Regional Purchase Ledger</h3>
          <span className="text-2xs font-black text-gray-400 uppercase">Contract Currencies Displayed</span>
        </div>
        <div className="p-6">
          {activeContracts.length === 0 ? (
            <div className="py-20 text-center text-gray-400 font-medium">No active contracts. Start a regional purchase above.</div>
          ) : (
            <div className="space-y-4">
              {activeContracts.map((contract: Contract) => {
                const supplier = suppliers.find((s: Supplier) => s.id === contract.supplierId);
                return (
                  <div key={contract.id} className="p-6 border border-gray-100 rounded flex flex-col md:flex-row items-center justify-between hover:bg-gray-50 transition-colors gap-6 shadow-sm">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <div className="w-12 h-12 bg-red-50 text-redtab rounded flex items-center justify-center shadow-inner">
                        <Clock size={24} />
                      </div>
                      <div>
                        <p className="font-black text-lg text-gray-900">{getCurrencySymbol(contract.currency?.code || contract.marketSegment?.currency)} {contract.drawdownAmount.toLocaleString(DEFAULT_CURRENCY_LOCALE)}</p>
                        <p className="text-xs+ font-bold text-gray-500 uppercase">Vendor: {supplier?.name || 'Unknown'}</p>
                        <p className="text-2xs text-gray-400 font-medium">Matures {contract.dueDate}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                      <div className="text-left md:text-right">
                        <p className="text-3xs text-gray-400 uppercase font-black tracking-widest mb-1">Total Outstanding</p>
                        <p className="text-sm font-black text-gray-900">{getCurrencySymbol(contract.currency?.code || contract.marketSegment?.currency)} {(contract.principalDue ?? 0).toLocaleString(DEFAULT_CURRENCY_LOCALE)}</p>
                      </div>
                      <button
                        onClick={() => handleRepayment(contract.id, contract.principalDue ?? 0)}
                        disabled={repaymentMutation.isPending}
                        className="px-8 py-2.5 bg-white border-2 border-redtab text-redtab font-black text-xs uppercase rounded-xl hover:bg-redtab hover:text-white transition-all shadow-sm disabled:opacity-50"
                      >
                        {repaymentMutation.isPending ? 'Processing...' : 'Settle Now'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MerchantPortal;
