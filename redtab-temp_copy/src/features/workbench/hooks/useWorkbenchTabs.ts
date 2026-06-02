import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { WorkbenchTab } from '@/features/contracts/components/TabButton';

export const useWorkbenchTabs = (merchantId: string | undefined) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = useCallback((): WorkbenchTab => {
    if (location.pathname.includes('/entity-profile')) return 'profile';
    if (location.pathname.includes('/trust-signals')) return 'scoring';
    if (location.pathname.includes('/supply-health')) return 'suppliers';
    if (location.pathname.includes('/policy-vault')) return 'kyc';
    return 'profile';
  }, [location.pathname]);

  const handleTabClick = useCallback(
    (tab: WorkbenchTab) => {
      const tabRoutes: Record<WorkbenchTab, string> = {
        profile: `/decisioning-workbench/${merchantId}/entity-profile`,
        scoring: `/decisioning-workbench/${merchantId}/trust-signals`,
        suppliers: `/decisioning-workbench/${merchantId}/supply-health`,
        kyc: `/decisioning-workbench/${merchantId}/policy-vault`
      };
      navigate(tabRoutes[tab]);
    },
    [merchantId, navigate]
  );

  return { getActiveTab, handleTabClick };
};
