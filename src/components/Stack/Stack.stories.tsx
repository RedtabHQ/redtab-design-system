import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from './Stack';

const meta: Meta<typeof Stack> = {
  title: 'Components/Layout/Stack',
  component: Stack,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    direction: {
      control: 'select',
      options: ['vertical', 'horizontal'],
      description: 'Primary axis direction of the stack',
    },
    gap: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Gap between stacked children',
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch'],
      description: 'Cross-axis alignment (items-*)',
    },
    justify: {
      control: 'select',
      options: ['start', 'center', 'end', 'between'],
      description: 'Main-axis justification (justify-*)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Stack>;

const Box = ({ label, wide }: { label: string; wide?: boolean }) => (
  <div
    className={`bg-blue-100 border border-blue-300 rounded px-4 py-3 text-blue-800 text-sm font-medium ${wide ? 'w-full' : ''}`}
  >
    {label}
  </div>
);

export const Vertical: Story = {
  args: {
    direction: 'vertical',
    gap: 'md',
  },
  render: (args) => (
    <Stack {...args}>
      <Box label="Item 1" />
      <Box label="Item 2" />
      <Box label="Item 3" />
    </Stack>
  ),
};

export const Horizontal: Story = {
  args: {
    direction: 'horizontal',
    gap: 'md',
  },
  render: (args) => (
    <Stack {...args}>
      <Box label="Item 1" />
      <Box label="Item 2" />
      <Box label="Item 3" />
    </Stack>
  ),
};

export const Centered: Story = {
  args: {
    direction: 'horizontal',
    gap: 'md',
    align: 'center',
    justify: 'center',
  },
  render: (args) => (
    <div className="border border-dashed border-gray-300 rounded p-2 h-32">
      <Stack className="h-full" {...args}>
        <Box label="Centered A" />
        <Box label="Centered B" />
        <Box label="Centered C" />
      </Stack>
    </div>
  ),
};

export const SpaceBetween: Story = {
  args: {
    direction: 'horizontal',
    gap: 'none',
    align: 'center',
    justify: 'between',
  },
  render: (args) => (
    <div className="border border-dashed border-gray-300 rounded p-2">
      <Stack {...args}>
        <Box label="Left" />
        <Box label="Middle" />
        <Box label="Right" />
      </Stack>
    </div>
  ),
};

export const WithGap: Story = {
  args: {
    direction: 'vertical',
    gap: 'xl',
  },
  render: (args) => (
    <Stack {...args}>
      <Box label="gap-xl · Item 1" wide />
      <Box label="gap-xl · Item 2" wide />
      <Box label="gap-xl · Item 3" wide />
    </Stack>
  ),
};
