import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatusBadge } from './StatusBadge';

const meta: Meta<typeof StatusBadge> = {
  title: 'Components/Display/StatusBadge',
  component: StatusBadge,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'error', 'warning', 'info', 'neutral', 'primary'],
    },
    size: { control: 'select', options: ['sm', 'md'] },
    dot: { control: 'boolean' },
    uppercase: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: {
    children: 'Active',
    variant: 'success',
    size: 'md',
    dot: false,
    uppercase: false,
  },
};

export default meta;
type Story = StoryObj<typeof StatusBadge>;

export const Success: Story = { args: { variant: 'success', children: 'Active' } };
export const Error: Story = { args: { variant: 'error', children: 'Failed' } };
export const Warning: Story = { args: { variant: 'warning', children: 'Pending' } };
export const Info: Story = { args: { variant: 'info', children: 'Processing' } };
export const Neutral: Story = { args: { variant: 'neutral', children: 'Inactive' } };
export const Primary: Story = { args: { variant: 'primary', children: 'New' } };

export const WithDot: Story = {
  args: { variant: 'success', children: 'Online', dot: true },
};

export const Small: Story = {
  args: { variant: 'info', children: 'Draft', size: 'sm' },
};

export const Uppercase: Story = {
  args: { variant: 'warning', children: 'Pending Review', uppercase: true },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2 items-center">
      <StatusBadge variant="success">Active</StatusBadge>
      <StatusBadge variant="error">Failed</StatusBadge>
      <StatusBadge variant="warning">Pending</StatusBadge>
      <StatusBadge variant="info">Processing</StatusBadge>
      <StatusBadge variant="neutral">Inactive</StatusBadge>
      <StatusBadge variant="primary">New</StatusBadge>
    </div>
  ),
};

export const WithDots: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2 items-center">
      <StatusBadge variant="success" dot>Online</StatusBadge>
      <StatusBadge variant="error" dot>Offline</StatusBadge>
      <StatusBadge variant="warning" dot>Away</StatusBadge>
      <StatusBadge variant="neutral" dot>Unknown</StatusBadge>
    </div>
  ),
};
