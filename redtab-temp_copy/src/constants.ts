
import { CreditTier } from './types';

export const POLICY_CONFIG = {
  TIERS: {
    [CreditTier.T1]: {
      label: 'T1: Elite (Low Risk)',
      maxLimit: 200000,
      startingLimit: 50000,
      feeRate: 0.02,
      maxTenure: 30,
      gracePeriod: 5,
      penaltyRate: 0.005,
      minScore: 85,
      maxScore: 100
    },
    [CreditTier.T2]: {
      label: 'T2: Standard (Medium Risk)',
      maxLimit: 100000,
      startingLimit: 30000,
      feeRate: 0.035,
      maxTenure: 30,
      gracePeriod: 2,
      penaltyRate: 0.01,
      minScore: 70,
      maxScore: 84
    },
    [CreditTier.T3]: {
      label: 'T3: New/Small (High Risk)',
      maxLimit: 50000,
      startingLimit: 20000,
      feeRate: 0.05,
      maxTenure: 30,
      gracePeriod: 0,
      penaltyRate: 0.02,
      minScore: 50,
      maxScore: 69
    },
    [CreditTier.NONE]: {
      label: 'Ineligible',
      maxLimit: 0,
      startingLimit: 0,
      feeRate: 0,
      maxTenure: 0,
      gracePeriod: 0,
      penaltyRate: 0,
      minScore: 0,
      maxScore: 49
    }
  },
  DELINQUENCY: {
    BUCKETS: {
      SOFT: [1, 7],
      HARD: [8, 15],
      DEFAULT: [16, 30],
      WRITE_OFF: [31, 999]
    }
  },
  KILL_SWITCHES: {
    MAX_PORTFOLIO_EXPOSURE: 10000000,
    DELINQUENCY_15_PLUS_THRESHOLD: 0.08,
    MONTHLY_LOSS_BUDGET: 500000
  },
  RISK_CONTROLS: {
    maxUtilizationPercent: 0.8,
    delinquencySuspendThreshold: 0.08,
    maxConcurrentContracts: 5,
    minDaysBetweenDrawdowns: 7,
    maxDailyDrawdownAmount: 10000000,
    requireManualApprovalAbove: 30000000
  },
  LIFECYCLE_MULTIPLIERS: {
    NEW: 0.85,
    EARLY_STABLE: 0.90,
    STABLE: 1.00,
    PROVEN: 1.05
  }
};

// V2 Hierarchical Scoring Model (Design Version)
export const SCORING_HIERARCHY = {
  CAPACITY: {
    weight: 0.60,
    subMetrics: {
      bank_flows: {
        weight: 0.20,
        logic: "Linear: (Inflow / Target * 100)",
        targetValue: 1000000,
        unit: "NPR Inflow",
        description: "Admin can adjust target monthly cash inflow for full score."
      },
      pos_sales_consistency: {
        weight: 0.15,
        logic: "Linear: (Avg Sales / Target * 100)",
        targetValue: 500000,
        unit: "NPR Avg Sales",
        description: "Target adjustable based on merchant type/sector."
      },
      inventory_turnover: {
        weight: 0.10,
        logic: "Linear: (Actual / Target * 100)",
        targetValue: 12,
        unit: "Cycles / Year",
        description: "Target cycles per year; can be adjusted for seasonal volatility."
      },
      operational_tenure: {
        weight: 0.08,
        logic: "Linear: (Months / Target * 100)",
        targetValue: 32,
        unit: "Months",
        description: "Target tenure to tune sensitivity of new vs old merchants."
      },
      refunds_returns: {
        weight: 0.05,
        logic: "Inverse Linear: (1 - Refund% / MaxRefund%) * 100",
        targetValue: 10,
        unit: "% Max Refund",
        description: "Higher refund percentages proportionally reduce the score."
      },
      order_fulfillment: {
        weight: 0.05,
        logic: "Linear: (% On-time / Target * 100)",
        targetValue: 95,
        unit: "% On-time",
        description: "Adjustable per delivery category/logistics partner."
      },
      supplier_employee_obs: {
        weight: 0.08,
        logic: "Inverse Linear: (Target / Actual * 100)",
        targetValue: 50000,
        unit: "NPR Arrears Cap",
        description: "Includes salaries and vendor dues; higher arrears reduce score."
      },
      household_obs: {
        weight: 0.05,
        logic: "Inverse Linear: (Target / Actual * 100)",
        targetValue: 20000,
        unit: "NPR Personal Debt",
        description: "Captures family commitments and household financial strain."
      },
      other_loans: {
        weight: 0.08,
        logic: "Inverse Linear: (Target / Actual * 100)",
        targetValue: 100000,
        unit: "NPR Outside Debt",
        description: "Considers bank and microfinance debt service coverage."
      },
      rental_lease_obs: {
        weight: 0.05,
        logic: "Inverse Linear: (Target / Actual * 100)",
        targetValue: 30000,
        unit: "NPR Rent/Lease",
        description: "Includes shop or equipment rental overheads."
      },
      utilities_ops: {
        weight: 0.05,
        logic: "Inverse Linear: (Target / Actual * 100)",
        targetValue: 10000,
        unit: "NPR Ops Expense",
        description: "Electricity, water, internet; late payments penalized."
      },
      insurance_premiums: {
        weight: 0.03,
        logic: "Inverse Linear: (Target / Actual * 100)",
        targetValue: 5000,
        unit: "NPR Premium",
        description: "Optional; adjustable based on risk mitigation artifacts."
      },
      taxes_govt: {
        weight: 0.03,
        logic: "Inverse Linear: (Target / Actual * 100)",
        targetValue: 15000,
        unit: "NPR Tax Obligation",
        description: "Penalized for late or unpaid government tax dues."
      },
      profitability_margins: {
        weight: 0.08,
        logic: "Linear: (Margin / Target * 100)",
        targetValue: 20,
        unit: "% Margin",
        description: "Adjust target based on specific sector benchmarks."
      },
      liquid_assets: {
        weight: 0.05,
        logic: "Linear: (Assets / Target * 100)",
        targetValue: 200000,
        unit: "NPR Receivables",
        description: "Higher liquid assets or receivables increase the score."
      },
      growth_trend: {
        weight: 0.07,
        logic: "Linear: (Growth / Target * 100)",
        targetValue: 10,
        unit: "% Growth",
        description: "Target MoM or YoY growth percentage."
      }
    }
  },
  INTENTION: {
    weight: 0.40,
    subMetrics: {
      payment_history: {
        weight: 0.30,
        logic: "Linear: (Timely / Target * 100)",
        targetValue: 100,
        unit: "% On-time",
        description: "Partial payments scaled: ≥75% → 80, 50–74% → 60, <50% → 40."
      },
      payment_ratio: {
        weight: 0.25,
        logic: "Linear: (Paid / Due * 100)",
        targetValue: 100,
        unit: "% Settled",
        description: "Direct percentage of dollar repayment effort."
      },
      dpd_delays: {
        weight: 0.15,
        logic: "Inverse Linear: (Target / Actual * 100)",
        targetValue: 0,
        unit: "Days Delay",
        description: "Penalty reduction proportional to partial payments."
      },
      dispute_history: {
        weight: 0.10,
        logic: "Inverse Linear: (Target / Actual * 100)",
        targetValue: 0,
        unit: "Disputes",
        description: "Higher disputes proportionally reduce the score."
      },
      fraud_signals: {
        weight: 0.10,
        logic: "Binary: 0 if detected",
        targetValue: 0,
        unit: "Detected Flags",
        description: "Fraud detection results in immediate Tier D (Non-adjustable)."
      },
      comm_responsiveness: {
        weight: 0.05,
        logic: "Linear: (Response / Target * 100)",
        targetValue: 90,
        unit: "% Response",
        description: "Responsiveness to platform outreach/support."
      },
      social_reputation: {
        weight: 0.03,
        logic: "Linear: (Positives / Total * 100)",
        targetValue: 90,
        unit: "% Positive",
        description: "Sentiment analysis from public reviews/social data."
      },
      behavioral_anomalies: {
        weight: 0.02,
        logic: "Binary: Event-based",
        targetValue: 0,
        unit: "Anomalies",
        description: "Suspicious app usage patterns reduce score."
      }
    }
  },
  DYNAMIC_FACTORS: {
    normalization: { logic: "Normalization: Actual / Sector Avg * 100", label: "Industry Benchmark Adjustment" },
    seasonal: { logic: "Seasonal factor multiplier (0.8–1.2)", label: "Seasonal Revenue Adjustments" },
    external: { logic: "Ad-hoc score adjustment (Event-specific)", label: "External Shock Factors" }
  }
};
