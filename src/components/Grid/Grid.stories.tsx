import type { Meta, StoryObj } from '@storybook/react-vite';
import { Grid } from './Grid';

const meta: Meta<typeof Grid> = {
  title: 'Components/Layout/Grid',
  component: Grid,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    cols: {
      control: 'select',
      options: [1, 2, 3, 4, 6, 12],
      description: 'Number of grid columns',
    },
    gap: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl'],
      description: 'Gap between grid cells',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Grid>;

const colors = [
  'bg-blue-200 border-blue-400 text-blue-800',
  'bg-emerald-200 border-emerald-400 text-emerald-800',
  'bg-violet-200 border-violet-400 text-violet-800',
  'bg-amber-200 border-amber-400 text-amber-800',
  'bg-rose-200 border-rose-400 text-rose-800',
  'bg-cyan-200 border-cyan-400 text-cyan-800',
];

const Cell = ({ index, label }: { index: number; label?: string }) => (
  <div
    className={`${colors[index % colors.length]} border rounded p-4 text-sm font-medium text-center`}
  >
    {label ?? `Cell ${index + 1}`}
  </div>
);

export const TwoColumns: Story = {
  args: {
    cols: 2,
    gap: 'md',
  },
  render: (args) => (
    <Grid {...args}>
      {Array.from({ length: 4 }, (_, i) => (
        <Cell key={i} index={i} />
      ))}
    </Grid>
  ),
};

export const ThreeColumns: Story = {
  args: {
    cols: 3,
    gap: 'md',
  },
  render: (args) => (
    <Grid {...args}>
      {Array.from({ length: 6 }, (_, i) => (
        <Cell key={i} index={i} />
      ))}
    </Grid>
  ),
};

export const FourColumns: Story = {
  args: {
    cols: 4,
    gap: 'md',
  },
  render: (args) => (
    <Grid {...args}>
      {Array.from({ length: 8 }, (_, i) => (
        <Cell key={i} index={i} />
      ))}
    </Grid>
  ),
};

export const ResponsiveGap: Story = {
  args: {
    cols: 3,
    gap: 'xl',
  },
  render: (args) => (
    <Grid {...args}>
      {Array.from({ length: 6 }, (_, i) => (
        <Cell key={i} index={i} label={`gap-xl · Cell ${i + 1}`} />
      ))}
    </Grid>
  ),
};
