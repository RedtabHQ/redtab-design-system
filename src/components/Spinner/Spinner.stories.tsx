import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spinner } from './Spinner';

const meta: Meta<typeof Spinner> = {
  title: 'Components/Feedback/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'white'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
    label: { control: 'text', description: 'Optional text label beneath the spinner' },
  },
  args: { variant: 'primary', size: 'md' },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Primary: Story = { args: { variant: 'primary' } };
export const Secondary: Story = { args: { variant: 'secondary' } };
export const White: Story = {
  args: { variant: 'white' },
  parameters: { backgrounds: { default: 'dark' } },
  decorators: [(Story) => <div className="p-8 bg-neutral-800 rounded"><Story /></div>],
};

export const WithLabel: Story = {
  args: { variant: 'primary', size: 'lg', label: 'Loading data...' },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Spinner size={size} />
          <span className="text-xs text-neutral-500">{size}</span>
        </div>
      ))}
    </div>
  ),
};
