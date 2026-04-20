import type { Meta, StoryObj } from '@storybook/react-vite';
import { Table } from './Table';
import { StatusBadge } from '../StatusBadge/StatusBadge';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  amount: number;
}

const sampleData: User[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active', amount: 12500 },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'Pending', amount: 8200 },
  { id: '3', name: 'Carol White', email: 'carol@example.com', role: 'Viewer', status: 'Inactive', amount: 4300 },
  { id: '4', name: 'Dave Brown', email: 'dave@example.com', role: 'Editor', status: 'Active', amount: 19800 },
  { id: '5', name: 'Eve Davis', email: 'eve@example.com', role: 'Admin', status: 'Active', amount: 31000 },
];

const statusVariant: Record<string, 'success' | 'warning' | 'neutral'> = {
  Active: 'success',
  Pending: 'warning',
  Inactive: 'neutral',
};

const columns = [
  { key: 'name' as const, label: 'Name' },
  { key: 'email' as const, label: 'Email' },
  { key: 'role' as const, label: 'Role' },
  {
    key: 'status' as const,
    label: 'Status',
    render: (_: unknown, row: User) => (
      <StatusBadge variant={statusVariant[row.status] ?? 'neutral'}>{row.status}</StatusBadge>
    ),
  },
  {
    key: 'amount' as const,
    label: 'Amount',
    align: 'right' as const,
    render: (value: unknown) => `$${(value as number).toLocaleString()}`,
  },
];

const meta: Meta<typeof Table<User>> = {
  title: 'Components/Display/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof Table<User>>;

export const Default: Story = {
  render: () => (
    <Table
      columns={columns}
      data={sampleData}
      keyExtractor={(row) => row.id}
    />
  ),
};

export const Loading: Story = {
  render: () => (
    <Table
      columns={columns}
      data={[]}
      keyExtractor={(row) => row.id}
      loading
    />
  ),
};

export const Empty: Story = {
  render: () => (
    <Table
      columns={columns}
      data={[]}
      keyExtractor={(row) => row.id}
      emptyMessage="No users found. Try adjusting your filters."
    />
  ),
};

export const Clickable: Story = {
  render: () => (
    <Table
      columns={columns}
      data={sampleData}
      keyExtractor={(row) => row.id}
      onRowClick={(row) => alert(`Clicked: ${row.name}`)}
    />
  ),
};

export const NonResponsive: Story = {
  render: () => (
    <Table
      columns={columns}
      data={sampleData}
      keyExtractor={(row) => row.id}
      responsive={false}
    />
  ),
};
