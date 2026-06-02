
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  MessageSquare,
  Send,
  Sparkles,
  X,
  RotateCcw
} from 'lucide-react';
import { getCollectionDraft } from '@/lib/geminiService';
import { useSendCommunication } from '@/features/communication/hooks/useCommunication';
import { useToast } from '@/hooks/useToast';
import {
  RecoveryBreakdownSection,
  PartiesInvolvedSection,
  ManualRepaymentSection,
  LifecycleEventsSection,
  CommAttemptsSection,
  NextRepaymentCard,
  PaymentScheduleList,
} from '../../components/detail';
import { ToneSelector } from '@/components/ToneSelector';
import { useContract } from '../../hooks/useContracts';
import { useSchedules, useNextDueSchedule, useScheduleSummary } from '../../hooks/useSchedules';
import { usePostRepayment } from '@/features/credit/hooks/useCredit';
import type { Contract, Merchant, Supplier } from '@/types';
import { Goback } from '@/components/common/Goback';
import AIDraftTone from './AIDraftTone';
import { Button } from '@/components';

type ContractDetail = Contract & {
  merchant?: Merchant;
  supplier?: Supplier;
};

const ContractDetailView: React.FC = () => {
  const { contractId } = useParams<{ contractId: string }>();
  const navigate = useNavigate();
  const { mutate: postRepayment, isPending: isPostingRepayment } = usePostRepayment({
    onSuccess: () => {
      setRepaymentAmount('');
    },
    onError: (error) => {
      console.error('Repayment failed:', error);
    },
  });
  const { data: contract } = useContract(contractId || '') as { data?: ContractDetail };
  const merchant = contract?.merchant;
  const supplier = contract?.supplier;
  const contractCurrency = contract?.currency?.code || contract?.marketSegment?.currency || 'USD';

  // Load schedules from dedicated APIs (not from contract response)
  const { data: schedules, isLoading: isLoadingSchedules } = useSchedules(contractId || '');
  const { data: nextDue, isLoading: isLoadingNextDue } = useNextDueSchedule(contractId || '');
  const { data: scheduleSummary } = useScheduleSummary(contractId || '');

  const [repaymentAmount, setRepaymentAmount] = useState('');

  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const [draftTone, setDraftTone] = useState<'SUPPORTIVE' | 'FORMAL' | 'URGENT'>('SUPPORTIVE');

  useEffect(() => {
    if (contract && merchant) {
      if (contract.status === 'DELINQUENT') setDraftTone('URGENT');
    }
  }, [contractId, contract, merchant]);

  if (!contract || !merchant || !supplier) {
    return (
      <div className="p-20 text-center">
        <AlertTriangle size={48} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-900">Contract Not Found</h2>
        <button onClick={() => navigate('/contracts')} className="mt-4 text-redtab font-bold hover:underline">Return to Ledger</button>
      </div>
    );
  }

  const handleManualRepayment = () => {
    const amt = parseFloat(repaymentAmount);
    if (!isNaN(amt) && amt > 0) {
      postRepayment({
        contractId: contract.id,
        amount: amt
      });
      setRepaymentAmount('');
    }
  };



  return (
    <div className="mx-auto space-y-8 pb-20 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Goback link='/contracts' />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-gray-900">{contract.id}</h1>
              <span className={`px-2.5 py-1 rounded-lg text-2xs font-black uppercase border ${contract.status === 'PAID' ? 'bg-green-50 text-green-700 border-green-100' :
                contract.status === 'DELINQUENT' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                }`}>
                {contract.status}
              </span>
            </div>
            <p className="text-gray-500 text-sm font-medium">Agreement context: {contract.currency?.code || contract.marketSegment?.currency || 'NPR'} Market</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="primary" className="uppercase" onClick={() => setIsCollectionsOpen(true)}
          >
            <MessageSquare size={16} /> Collections Assistant
          </Button>

          {/* <Button className="uppercase" variant="secondary" >
            Audit Trace
          </Button> */}
        </div>
      </div>

      <RecoveryBreakdownSection contract={contract} />

      <div className="grid gap-8 grid-cols-1 lg:grid-cols-2 col-span-12">
        <PartiesInvolvedSection
          contract={contract}
          merchant={merchant}
          supplier={supplier}
          onMerchantClick={(merchantId) => navigate(`/merchants/${merchantId}`)}
          onSupplierClick={(supplierId) => navigate(`/suppliers/${supplierId}`)}
        />

        <ManualRepaymentSection
          contract={contract}
          repaymentAmount={repaymentAmount}
          onAmountChange={setRepaymentAmount}
          onSubmit={handleManualRepayment}
          isLoading={isPostingRepayment}
        />
      </div>

      <NextRepaymentCard installment={nextDue} currency={contractCurrency} isLoading={isLoadingNextDue} />
      <PaymentScheduleList schedule={schedules} summary={scheduleSummary} currency={contractCurrency} isLoading={isLoadingSchedules} />

      <div className="grid grid-cols-1 gap-8">
        <CommAttemptsSection merchantId={merchant.id} merchantName={merchant.name} />
      </div>

      <LifecycleEventsSection contract={contract} />

      {/* AI Collections Assistant Modal */}
      <AIDraftTone contract={contract} isOpen={isCollectionsOpen} setIsOpen={setIsCollectionsOpen} />

    </div>
  );
};

export default ContractDetailView;
