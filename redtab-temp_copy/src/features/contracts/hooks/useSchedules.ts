import { useQuery } from '@tanstack/react-query';
import { contractService } from '@/lib/apiService';

export const scheduleKeys = {
  all: (contractId: string) => ['contracts', contractId, 'schedules'] as const,
  nextDue: (contractId: string) => ['contracts', contractId, 'schedules', 'next-due'] as const,
  summary: (contractId: string) => ['contracts', contractId, 'schedules', 'summary'] as const,
};

/**
 * Hook to fetch all installment schedules for a contract
 */
export const useSchedules = (contractId: string) =>
  useQuery({
    queryKey: scheduleKeys.all(contractId),
    queryFn: () => contractService.getSchedules(contractId),
    enabled: !!contractId,
  });

/**
 * Hook to fetch the next due installment for a contract
 */
export const useNextDueSchedule = (contractId: string) =>
  useQuery({
    queryKey: scheduleKeys.nextDue(contractId),
    queryFn: () => contractService.getNextDueSchedule(contractId),
    enabled: !!contractId,
  });

/**
 * Hook to fetch schedule summary (progress stats)
 */
export const useScheduleSummary = (contractId: string) =>
  useQuery({
    queryKey: scheduleKeys.summary(contractId),
    queryFn: () => contractService.getScheduleSummary(contractId),
    enabled: !!contractId,
  });
