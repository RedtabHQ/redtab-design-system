import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmptyState } from './EmptyState';

const meta: Meta<typeof EmptyState> = {
  title: 'Components/Display/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['minimal', 'compact', 'with-icon'],
    },
    title: { control: 'text' },
    description: { control: 'text' },
  },
  args: {
    title: 'No results found',
    variant: 'minimal',
  },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Minimal: Story = {
  args: {
    title: 'No transactions',
    description: 'There are no transactions to display yet.',
    variant: 'minimal',
  },
};

export const Compact: Story = {
  args: {
    title: 'No suppliers matched',
    variant: 'compact',
  },
};

export const WithIcon: Story = {
  args: {
    title: 'No data available',
    variant: 'with-icon',
    icon: <span className="text-2xl">📊</span>,
  },
};

export const WithAction: Story = {
  args: {
    title: 'No invoices yet',
    description: 'Create your first invoice to get started.',
    variant: 'minimal',
    action: (
      <button
        type="button"
        className="px-4 py-2 bg-primary-500 text-white text-sm font-medium rounded-md hover:bg-primary-600"
      >
        Create Invoice
      </button>
    ),
  },
};

export const InTable: Story = {
  render: () => (
    <div className="border border-neutral-200 rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-neutral-50 border-b border-neutral-200">
          <tr>
            {['Name', 'Status', 'Amount', 'Date'].map((h) => (
              <th key={h} className="px-6 py-3 text-left font-semibold text-neutral-700">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={4}>
              <EmptyState title="No records found" description="Try adjusting your filters." variant="compact" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
};
