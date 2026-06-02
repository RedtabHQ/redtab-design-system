import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { DollarSign, TrendingUp, Users, Building } from 'lucide-react';
import { useMarketSegment } from '@/contexts/MarketSegmentContext';
import { explainScoringLogic } from '@/lib/geminiService';
import { ConfirmationModal } from '@/components/common/ConfirmationModal';
import { useActiveScoringConfig, useDeployScoringConfig, useRestoreScoringConfigDefaults } from '@/features/admin/hooks/useScoringConfig';
import type { ScoringConfig } from '@/features/admin/services/scoringConfigApi';
import { Header } from './Header';
import { DistributionCharts } from './DistributionCharts';
import { ScoringAudit } from './ScoringAudit';
import { CategoryWeightSection } from './CategoryWeightSection';
import { SafeguardsSection } from './SafeguardsSection';
import { useToastContext } from '@/components/common/ToastContainer';

const AUTO_SAVE_DELAY_MS = 1200;

const normalizeCategoryKey = (key: string) =>
  key
    ? key
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .replace(/[\s-]+/g, '_')
        .toUpperCase()
    : key;

const formatCategoryLabel = (key: string) => {
  const humanized = key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .trim();
  if (!humanized) return '';
  return humanized.replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatSubMetricLabel = (key: string) =>
  key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .toUpperCase()
    .trim();

const isConfigBalanced = (config: ScoringConfig) => {
  const totalWeight = Object.values(config.categories).reduce(
    (sum, category) => sum + (category.weight ?? 0),
    0
  );
  return Math.abs(totalWeight - 1) < 0.001;
};

// Category color mapping - defined outside component to prevent re-creation
const categoryColors: Record<string, string> = {
  CAPACITY: '#E61E2A',
  INTENTION: '#4F46E5',
  DYNAMIC_FACTORS: '#10B981',
};

// Category metadata for icons and descriptions - defined outside component
const categoryMetadata: Record<
  string,
  {
    icon: React.ComponentType<{ size: number }>;
    subtitle: string;
    colors: string[];
  }
> = {
  CAPACITY: {
    icon: DollarSign,
    subtitle: 'Financial Capacity & Cash Flow Strength',
    colors: ['#E61E2A', '#FCA5A5', '#F87171', '#EF4444', '#DC2626', '#B91C1C', '#991B1B', '#7F1D1D', '#450A0A'],
  },
  INTENTION: {
    icon: Users,
    subtitle: 'Repayment Intent & Behavioral Signals',
    colors: ['#4F46E5', '#818CF8', '#6366F1', '#4338CA', '#3730A3', '#312E81', '#1E1B4B'],
  },
  DYNAMIC_FACTORS: {
    icon: TrendingUp,
    subtitle: 'Macro & Seasonal Adjustments',
    colors: ['#10B981', '#6EE7B7', '#34D399', '#059669', '#047857', '#065F46', '#064E3B'],
  },
};

const ScoringEngineConfigView: React.FC = () => {
  const { selectedSegment, isGlobalView } = useMarketSegment();
  const { data: config, isLoading } = useActiveScoringConfig();
  const { show: showToast } = useToastContext();
  const deployConfig = useDeployScoringConfig({
    onSuccess: () => {
      showToast({
        type: 'SUCCESS',
        title: 'Scoring Config Updated',
        message: 'Changes synced successfully.',
      });
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Failed to save scoring configuration';
      showToast({
        type: 'DANGER',
        title: 'Save Failed',
        message,
      });
    },
  });
  const restoreDefaults = useRestoreScoringConfigDefaults();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(() =>
    isGlobalView ? new Set() : new Set(['CAPACITY', 'INTENTION'])
  );
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [localConfig, setLocalConfig] = useState<ScoringConfig | null>(null);

  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingConfigRef = useRef<ScoringConfig | null>(null);

  useEffect(() => {
    if (isGlobalView) {
      setExpandedCategories(new Set());
    } else {
      setExpandedCategories(new Set(['CAPACITY', 'INTENTION']));
    }
  }, [isGlobalView]);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  // Use local config if available, otherwise use fetched config
  const currentConfig = localConfig || config;

  const scheduleConfigSave = useCallback(
    (nextConfig: ScoringConfig) => {
      if (!isConfigBalanced(nextConfig)) {
        pendingConfigRef.current = null;
        return;
      }

      pendingConfigRef.current = nextConfig;
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }

      saveTimerRef.current = setTimeout(() => {
        if (pendingConfigRef.current) {
          deployConfig.mutate(pendingConfigRef.current);
          pendingConfigRef.current = null;
        }
      }, AUTO_SAVE_DELAY_MS);
    },
    [deployConfig]
  );

  // Transform backend categories structure to component structure
  const categories = useMemo(() => {
    if (!currentConfig) return [];
    return Object.entries(currentConfig.categories).map(([key, category]) => {
      const subMetrics = category.subMetrics ?? category.factors ?? {};
      return [
        key,
        {
          ...category,
          subMetrics,
        },
      ];
    }) as [string, any][];
  }, [currentConfig]);

  const totalWeight = useMemo(() => {
    return categories.reduce((sum, [_, cat]) => sum + cat.weight, 0);
  }, [categories]);

  const isValidGlobal = Math.abs(totalWeight - 1) < 0.001;

  // Chart Data Constructions
  const globalChartData = useMemo(() => {
    return categories.map(([key, cat]) => {
      const normalizedKey = normalizeCategoryKey(key);
      return {
        name: formatCategoryLabel(key),
        value: cat.weight ?? 0,
        color: categoryColors[normalizedKey] || '#6B7280',
      };
    });
  }, [categories]);

  // Generate category breakdowns dynamically
  const categoryBreakdowns = useMemo(() => {
    if (!currentConfig) return [];

    return categories
      .filter(([_, cat]) => cat.subMetrics && Object.keys(cat.subMetrics).length > 0)
      .map(([key, cat]) => {
        const normalizedKey = normalizeCategoryKey(key);
        const metadata = categoryMetadata[normalizedKey];
        const colors = metadata?.colors || ['#6B7280', '#9CA3AF', '#D1D5DB'];

        return {
          title: formatCategoryLabel(key),
          subtitle: metadata?.subtitle || 'Sub-Metrics Breakdown',
          icon: metadata?.icon || Building,
          data: Object.entries(cat.subMetrics).map(([subKey, meta]: [string, any], index) => ({
            name: formatSubMetricLabel(subKey),
            value: meta.weight ?? 0,
            color: colors[index % colors.length],
          })),
        };
      });
  }, [currentConfig, categories]);

  // Handle weight changes in local config
  const handleCategoryWeightChange = (categoryKey: string, weight: number) => {
    if (!currentConfig) return;
    const updated = JSON.parse(JSON.stringify(currentConfig));
    if (updated.categories[categoryKey]) {
      updated.categories[categoryKey].weight = weight;
      setLocalConfig(updated);
      scheduleConfigSave(updated);
    }
  };

  const handleSubMetricWeightChange = (categoryKey: string, subKey: string, weight: number) => {
    if (!currentConfig) return;
    const updated = JSON.parse(JSON.stringify(currentConfig));
    const category = updated.categories[categoryKey];
    if (!category) return;
    const metrics = category.subMetrics ?? category.factors;
    if (metrics?.[subKey]) {
      metrics[subKey].weight = weight;
      setLocalConfig(updated);
      scheduleConfigSave(updated);
    }
  };

  const handleSubMetricTargetValueChange = (categoryKey: string, subKey: string, value: number) => {
    if (!currentConfig) return;
    const updated = JSON.parse(JSON.stringify(currentConfig));
    const category = updated.categories[categoryKey];
    if (!category) return;
    const metrics = category.subMetrics ?? category.factors;
    if (metrics?.[subKey]) {
      metrics[subKey].targetValue = value;
      setLocalConfig(updated);
      scheduleConfigSave(updated);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const result = await explainScoringLogic({
      weights: currentConfig?.categories,
      region: isGlobalView ? 'GLOBAL' : selectedSegment?.name,
    });
    setAnalysis(result.content);
    setIsAnalyzing(false);
  };

  const toggleCategory = (key: string) => {
    const canonical = normalizeCategoryKey(key);
    const next = new Set(expandedCategories);
    if (next.has(canonical)) next.delete(canonical);
    else next.add(canonical);
    setExpandedCategories(next);
  };

  const handleRestore = () => {
    setShowRestoreConfirm(true);
  };

  const handleConfirmRestore = async () => {
    restoreDefaults.mutate(undefined, {
      onSuccess: () => {
        setLocalConfig(null);
        setShowRestoreConfirm(false);
        showToast({
          type: 'SUCCESS',
          title: 'Configuration Restored',
          message: 'Default scoring configuration restored successfully.',
        });
        // Config will be refetched automatically by React Query
      },
      onError: (error) => {
        console.error('Failed to restore defaults:', error);
        const message = error instanceof Error ? error.message : 'Failed to restore defaults';
        showToast({
          type: 'DANGER',
          title: 'Restore Failed',
          message,
        });
      },
    });
  };

  const handleCancelRestore = () => {
    setShowRestoreConfirm(false);
  };

  const handleCommit = () => {
    if (isValidGlobal && currentConfig) {
      deployConfig.mutate(currentConfig);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-500">Loading scoring configuration...</div>
        </div>
      </div>
    );
  }

  if (!currentConfig) {
    return (
      <div className="mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
        <div className="flex items-center justify-center h-96">
          <div className="text-red-500">Failed to load scoring configuration</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      <Header
        isValidGlobal={isValidGlobal}
        onCommit={handleCommit}
        onRestore={handleRestore}
      />

      <DistributionCharts
        globalData={globalChartData}
        categoryBreakdowns={categoryBreakdowns}
      />

      <div className="relative">
        {isGlobalView && (
          <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-[1px] rounded-xl flex items-center justify-center">
            <div className="text-center px-6 py-4 bg-white rounded-lg shadow-lg border border-gray-200 max-w-md">
              <p className="text-gray-700 font-medium text-base">
                Scoring engine configuration is only available per market segment.
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Please select a specific market segment to configure scoring weights.
              </p>
            </div>
          </div>
        )}

        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 ${isGlobalView ? 'pointer-events-none select-none' : ''}`}>
          <div className="lg:col-span-4 space-y-8">
            <ScoringAudit isAnalyzing={isAnalyzing} analysis={analysis} onAnalyze={handleAnalyze} />
          </div>

          <div className="lg:col-span-8 space-y-6">
            {categories.map(([catKey, cat]) => {
              const canonical = normalizeCategoryKey(catKey);
              return (
                <CategoryWeightSection
                  key={catKey}
                  categoryKey={catKey}
                  category={cat}
                  isExpanded={expandedCategories.has(canonical)}
                  onToggle={() => toggleCategory(catKey)}
                  onWeightChange={(value) => handleCategoryWeightChange(catKey, value)}
                  onSubMetricWeightChange={(subKey, value) => handleSubMetricWeightChange(catKey, subKey, value)}
                  onSubMetricTargetValueChange={(subKey, value) =>
                    handleSubMetricTargetValueChange(catKey, subKey, value)
                  }
                />
              );
            })}

            <SafeguardsSection />
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showRestoreConfirm}
        title="Restore Default Configuration"
        message="Are you sure you want to restore the default scoring configuration? This action cannot be undone."
        confirmText="Restore"
        cancelText="Cancel"
        isDangerous={true}
        onConfirm={handleConfirmRestore}
        onCancel={handleCancelRestore}
      />
    </div>
  );
};

export default ScoringEngineConfigView;
