import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider } from './Divider';

const meta: Meta<typeof Divider> = {
  title: 'Components/Layout/Divider',
  component: Divider,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Direction of the divider line',
    },
    spacing: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
      description: 'Margin applied on the axis perpendicular to the divider',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Divider>;

const TextBlock = ({ children }: { children: React.ReactNode }) => (
  <p className="text-gray-600 text-sm">{children}</p>
);

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
    spacing: 'md',
  },
  render: (args) => (
    <div>
      <TextBlock>Content above the divider.</TextBlock>
      <Divider {...args} />
      <TextBlock>Content below the divider.</TextBlock>
    </div>
  ),
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    spacing: 'md',
  },
  render: (args) => (
    <div className="flex items-center h-12">
      <TextBlock>Left side</TextBlock>
      <Divider {...args} />
      <TextBlock>Right side</TextBlock>
    </div>
  ),
};

export const NoSpacing: Story = {
  args: {
    orientation: 'horizontal',
    spacing: 'none',
  },
  render: (args) => (
    <div>
      <TextBlock>No margin is applied around this divider.</TextBlock>
      <Divider {...args} />
      <TextBlock>The divider sits flush against the adjacent content.</TextBlock>
    </div>
  ),
};

export const LargeSpacing: Story = {
  args: {
    orientation: 'horizontal',
    spacing: 'lg',
  },
  render: (args) => (
    <div>
      <TextBlock>There is a large margin above and below this divider.</TextBlock>
      <Divider {...args} />
      <TextBlock>The extra spacing gives content room to breathe.</TextBlock>
    </div>
  ),
};
