import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatsCard } from './StatsCard';

function UsersIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function TrendingIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

const meta: Meta<typeof StatsCard> = {
  title: 'Components/Display/StatsCard',
  component: StatsCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    variant: { control: 'select', options: ['default', 'compact', 'kpi'] },
    color: { control: 'select', options: ['primary', 'success', 'error', 'warning', 'info', 'neutral'] },
    label: { control: 'text' },
    value: { control: 'text' },
    secondaryValue: { control: 'text' },
    progress: { control: { type: 'range', min: 0, max: 100 } },
  },
  args: {
    label: 'Total Revenue',
    value: '$84,234',
    variant: 'default',
    color: 'neutral',
  },
};

export default meta;
type Story = StoryObj<typeof StatsCard>;

export const Default: Story = {
  args: {
    label: 'Total Revenue',
    value: '$84,234',
    secondaryValue: 'vs last month',
    trend: { direction: 'up', value: '+12.5%' },
    icon: <TrendingIcon />,
    color: 'success',
  },
};

export const Compact: Story = {
  args: {
    label: 'Active Users',
    value: '1,284',
    variant: 'compact',
    color: 'info',
  },
};

export const KPI: Story = {
  args: {
    label: 'Monthly Active Users',
    value: '24,521',
    variant: 'kpi',
    icon: <UsersIcon />,
    secondaryValue: 'Updated 2 hours ago',
    color: 'primary',
  },
};

export const WithProgress: Story = {
  args: {
    label: 'Credit Utilization',
    value: '67%',
    progress: 67,
    color: 'warning',
    secondaryValue: 'of $50,000 limit',
  },
};

export const WithTrendDown: Story = {
  args: {
    label: 'Churn Rate',
    value: '3.2%',
    trend: { direction: 'down', value: '-0.8%' },
    color: 'error',
    icon: <TrendingIcon />,
  },
};

export const DashboardGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard label="Total Revenue" value="$84,234" color="success" trend={{ direction: 'up', value: '+12.5%' }} icon={<TrendingIcon />} />
      <StatsCard label="Active Users" value="1,284" color="info" trend={{ direction: 'up', value: '+3.2%' }} icon={<UsersIcon />} />
      <StatsCard label="Churn Rate" value="3.2%" color="error" trend={{ direction: 'down', value: '-0.8%' }} />
      <StatsCard label="Credit Used" value="67%" color="warning" progress={67} secondaryValue="of $50,000" />
    </div>
  ),
};
