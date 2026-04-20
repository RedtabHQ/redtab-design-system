import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Feedback/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['text', 'circular', 'rectangular'],
      description: 'Shape of the skeleton placeholder',
    },
    width: { control: 'text', description: 'CSS width (e.g. "200px", "100%")' },
    height: { control: 'text', description: 'CSS height (e.g. "40px")' },
  },
  args: { variant: 'text', width: '200px' },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Text: Story = {
  args: { variant: 'text', width: '80%' },
};

export const Circular: Story = {
  args: { variant: 'circular', width: 48, height: 48 },
};

export const Rectangular: Story = {
  args: { variant: 'rectangular', width: '100%', height: 120 },
};

export const ArticleLayout: Story = {
  render: () => (
    <div className="space-y-4 max-w-sm">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
      <Skeleton variant="rectangular" width="100%" height={160} />
      <div className="space-y-2">
        <Skeleton variant="text" />
        <Skeleton variant="text" width="90%" />
        <Skeleton variant="text" width="75%" />
      </div>
    </div>
  ),
};

export const TableLayout: Story = {
  render: () => (
    <div className="space-y-3 w-full max-w-lg">
      <div className="flex gap-4 pb-3 border-b border-neutral-200">
        {[60, 100, 80, 60].map((w, i) => (
          <Skeleton key={i} variant="text" width={w} />
        ))}
      </div>
      {Array.from({ length: 4 }).map((_, r) => (
        <div key={r} className="flex gap-4">
          {[60, 100, 80, 60].map((w, i) => (
            <Skeleton key={i} variant="text" width={w} />
          ))}
        </div>
      ))}
    </div>
  ),
};
