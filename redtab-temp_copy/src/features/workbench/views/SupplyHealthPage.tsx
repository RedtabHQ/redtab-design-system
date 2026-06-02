import React, { useState, useMemo } from 'react';
import { Search, Building2, RouteIcon, Scale, AlertCircle, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { SearchInput } from '@/components/SearchInput';
import { useSupplyHealth } from '@/features/suppliers/hooks/useSupplyHealth';
import type { Supplier, Merchant } from '@/types';
import { getCategoryName } from '@/features/merchants/utils/merchantHelpers';

interface OutletContext {
  merchant: Merchant;
  suppliers: Supplier[];
  isSuppliersLoading: boolean;
  suppliersError?: Error | null;
}

interface ConcentrationGaugeProps {
  percentage: number;
  className?: string;
}

const ConcentrationGauge: React.FC<ConcentrationGaugeProps> = ({ percentage, className }) => (
  <svg className={className} viewBox="0 0 100 100">
    <circle className="text-white/5" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
    <circle
      className="text-indigo-400"
      strokeWidth="8"
      strokeDasharray={`${251 * (percentage / 100)} 251`}
      strokeLinecap="round"
      stroke="currentColor"
      fill="transparent"
      r="40"
      cx="50"
      cy="50"
    />
  </svg>
);

// Get risk color based on level
const getRiskColor = (level: string) => {
  switch (level) {
    case 'CRITICAL':
      return 'text-red-500';
    case 'HIGH':
      return 'text-orange-500';
    case 'MEDIUM':
      return 'text-amber-500';
    default:
      return 'text-green-500';
  }
};

const SUPPLIERS_PER_PAGE = 6;

export const SupplyHealthPage: React.FC = () => {
  const context = useOutletContext<OutletContext>();
  const { suppliers = [], isSuppliersLoading = false } = context;
  const [internalSearch, setInternalSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  // Calculate supply health metrics using the custom hook
  const { networkData, metrics } = useSupplyHealth(suppliers);

  const handleSearchChange = (value: string) => {
    setInternalSearch(value);
    setCurrentPage(1);
  };

  const filteredSuppliers = useMemo(() => {
    if (!internalSearch.trim()) return suppliers;
    const searchLower = internalSearch.toLowerCase();
    return suppliers.filter(supplier => {
      const categoryName =
        typeof supplier.category === 'string'
          ? supplier.category
          : supplier.category?.name ?? '';
      return (
        supplier.name.toLowerCase().includes(searchLower) ||
        categoryName.toLowerCase().includes(searchLower)
      );
    });
  }, [suppliers, internalSearch]);

  const totalPages = Math.ceil(filteredSuppliers.length / SUPPLIERS_PER_PAGE);
  const paginatedSuppliers = useMemo(() => {
    const startIdx = (currentPage - 1) * SUPPLIERS_PER_PAGE;
    return filteredSuppliers.slice(startIdx, startIdx + SUPPLIERS_PER_PAGE);
  }, [filteredSuppliers, currentPage]);

  return (
    <div className="space-y-12 animate-in fade-in">
      <div className="mb-8">
        <SearchInput
          value={internalSearch}
          onChange={handleSearchChange}
          placeholder="Filter suppliers by name or category..."
          className="max-w-md"
        />
      </div>

      <h4 className="text-2xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><RouteIcon size={14} /> SUPPLY CHAIN RELATIONSHIP MAPPING</h4>

      {context.suppliersError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-4">
          <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-sm font-bold text-red-900">Failed to load suppliers</p>
            <p className="text-xs text-red-700 mt-1">{context.suppliersError.message || 'An error occurred while fetching supplier data.'}</p>
          </div>
        </div>
      )}

      {isSuppliersLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm space-y-6 animate-pulse">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-5 bg-green-100 rounded w-16" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="space-y-2">
                    <div className="h-3 bg-gray-100 rounded" />
                    <div className="h-4 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : filteredSuppliers.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedSuppliers.map((s: typeof paginatedSuppliers[0], idx: number) => {
              const healthScore = metrics.calculateHealthScore(s);
              const invoiceValidity = metrics.calculateInvoiceValidityRate(s);
              const buyVolume = metrics.formatBuyVolume();

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedSupplier(s)}
                  className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex flex-col gap-6 hover:border-red-100 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gray-50 text-gray-400 rounded-xl"><Building2 size={24} /></div>
                      <div>
                        <h5 className="font-black text-gray-900 leading-none">{s.name}</h5>
                        <p className="text-2xs font-bold text-gray-400 uppercase mt-1">{getCategoryName(s.category) || 'Uncategorized'}</p>
                      </div>
                    </div>
                    <span className={`text-3xs font-black px-2 py-0.5 rounded-lg border uppercase tracking-tighter ${
                      s.status === 'BLOCKED'
                        ? 'text-red-600 bg-red-50 border-red-100'
                        : 'text-green-600 bg-green-50 border-green-100'
                    }`}>
                      {s.status === 'BLOCKED' ? 'Blocked' : 'Active Link'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-3xs font-bold text-gray-400 uppercase leading-none">Buy Volume</p>
                      <p className="text-xs font-black text-gray-900 mt-1">{s.currency} {buyVolume}</p>
                    </div>
                    <div>
                      <p className="text-3xs font-bold text-gray-400 uppercase leading-none">Health Score</p>
                      <div className="flex gap-1 mt-1.5">
                        {[1, 2, 3, 4, 5].map(v => (
                          <div
                            key={v}
                            className={`w-1.5 h-1.5 rounded-full ${v <= Math.round(healthScore) ? 'bg-green-500' : 'bg-gray-200'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-3xs font-bold text-gray-400 uppercase leading-none">Invoice Validity</p>
                      <p className="text-xs font-black text-gray-900 mt-1">{Math.round(invoiceValidity)}% Match</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {(currentPage - 1) * SUPPLIERS_PER_PAGE + 1} to {Math.min(currentPage * SUPPLIERS_PER_PAGE, filteredSuppliers.length)} of {filteredSuppliers.length} suppliers
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={20} className="text-gray-600" />
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-redtab text-white'
                          : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Next page"
                >
                  <ChevronRight size={20} className="text-gray-600" />
                </button>
              </div>
            </div>
          )}

          <div className="bg-[#0A192F] p-8 rounded-xl flex items-center justify-between text-white shadow-xl">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl text-indigo-300"><Scale size={28} /></div>
              <div>
                <h5 className="text-lg font-black tracking-tight">Network Concentration Analysis</h5>
                <p className="text-2xs text-indigo-200/50 font-bold uppercase tracking-widest">Portfolio reliance on this merchant's fulfillment partners.</p>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-right">
                <p className="text-2xs font-black text-indigo-300 uppercase leading-none">Exposure Risk</p>
                <p className={`text-xl font-black mt-1 ${getRiskColor(networkData.exposureRiskLevel)}`}>
                  {networkData.exposureRiskLevel}
                </p>
                <p className="text-3xs text-indigo-200/60 mt-1">
                  {networkData.suppliersInNetwork} supplier{networkData.suppliersInNetwork !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-white/5 flex items-center justify-center relative">
                <ConcentrationGauge percentage={networkData.concentrationPercentage} className="absolute inset-0 transform -rotate-90" />
                <span className="text-2xs font-black">{networkData.concentrationPercentage}%</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="py-16 text-center space-y-4">
          {suppliers.length === 0 && !isSuppliersLoading ? (
            <>
              <AlertCircle size={32} className="mx-auto text-amber-300" />
              <div>
                <p className="text-sm font-bold text-gray-600">No suppliers connected</p>
                <p className="text-xs text-gray-400 mt-1">This merchant has no suppliers linked yet.</p>
              </div>
            </>
          ) : (
            <>
              <Search size={32} className="mx-auto mb-4 text-gray-300" />
              <p className="text-sm text-gray-400">No suppliers match "{internalSearch}"</p>
            </>
          )}
        </div>
      )}

      {/* Supplier Detail Modal */}
      {selectedSupplier && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in scale-in duration-200">
            {/* Modal Header */}
            <div className="sticky top-0 flex items-center justify-between p-8 border-b border-gray-100 bg-white">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-50 text-gray-400 rounded-xl"><Building2 size={28} /></div>
                <div>
                  <h2 className="text-xl font-black text-gray-900">{selectedSupplier.name}</h2>
                  <p className="text-2xs font-bold text-gray-400 uppercase mt-1">{getCategoryName(selectedSupplier.category) || 'Uncategorized'}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSupplier(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-8">
              {/* Status & Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-2xs font-bold text-gray-400 uppercase">Status</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-black px-3 py-1 rounded-lg border uppercase tracking-tighter ${
                      selectedSupplier.status === 'BLOCKED'
                        ? 'text-red-600 bg-red-50 border-red-100'
                        : 'text-green-600 bg-green-50 border-green-100'
                    }`}>
                      {selectedSupplier.status === 'BLOCKED' ? 'Blocked' : 'Active Link'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-2xs font-bold text-gray-400 uppercase">Category</p>
                  <p className="text-sm font-bold text-gray-900">{getCategoryName(selectedSupplier.category) || 'Uncategorized'}</p>
                </div>
              </div>

              {/* Supply Chain Metrics */}
              <div>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Supply Chain Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-3xs font-bold text-gray-400 uppercase leading-none">Buy Volume</p>
                    <p className="text-lg font-black text-gray-900 mt-2">{selectedSupplier.currency} {metrics.formatBuyVolume()}</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-3xs font-bold text-gray-400 uppercase leading-none">Health Score</p>
                    <div className="flex gap-1.5 mt-2">
                      {[1, 2, 3, 4, 5].map(v => (
                        <div
                          key={v}
                          className={`w-2.5 h-2.5 rounded-full ${v <= Math.round(metrics.calculateHealthScore(selectedSupplier)) ? 'bg-green-500' : 'bg-gray-200'}`}
                        />
                      ))}
                    </div>
                    <p className="text-sm font-black text-gray-900 mt-2">{Math.round(metrics.calculateHealthScore(selectedSupplier))}/5</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-3xs font-bold text-gray-400 uppercase leading-none">Invoice Validity</p>
                    <p className="text-lg font-black text-gray-900 mt-2">{Math.round(metrics.calculateInvoiceValidityRate(selectedSupplier))}%</p>
                    <p className="text-3xs text-gray-500 mt-1">Match Rate</p>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              {selectedSupplier.supplierFeeRate && (
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                  <p className="text-2xs font-bold text-blue-700 uppercase">Fee Rate</p>
                  <p className="text-xl font-black text-blue-900 mt-2">{(selectedSupplier.supplierFeeRate * 100).toFixed(2)}%</p>
                </div>
              )}

              {/* Description */}
              {selectedSupplier.description && (
                <div>
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Description</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{selectedSupplier.description}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setSelectedSupplier(null)}
                className="px-6 py-2.5 text-sm font-black text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors uppercase"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplyHealthPage;
