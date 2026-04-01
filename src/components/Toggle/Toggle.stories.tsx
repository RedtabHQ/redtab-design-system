import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toggle } from './Toggle';

const meta = {
  title: 'Components/Form/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Whether the toggle is on',
    },
    label: {
      control: 'text',
      description: 'Label displayed next to the toggle',
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: 'Size variant of the toggle',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the toggle',
    },
  },
  args: {
    checked: false,
    size: 'md',
    disabled: false,
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    checked: false,
  },
};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Enable notifications',
    checked: false,
  },
};

export const WithLabelChecked: Story = {
  args: {
    label: 'Dark mode',
    checked: true,
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    label: 'Compact toggle',
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Managed by organisation',
    checked: true,
    disabled: true,
  },
};

export const DisabledUnchecked: Story = {
  args: {
    label: 'Feature unavailable',
    checked: false,
    disabled: true,
  },
};

// Controlled interactive example
export const Controlled: Story = {
  render: () => {
    const [enabled, setEnabled] = useState(false);
    return (
      <div className="flex flex-col gap-4">
        <Toggle
          checked={enabled}
          onChange={setEnabled}
          label={enabled ? 'Notifications on' : 'Notifications off'}
        />
        <p className="text-sm text-neutral-500">
          Status: <strong>{enabled ? 'Enabled' : 'Disabled'}</strong>
        </p>
      </div>
    );
  },
};

export const SizesComparison: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Toggle size="sm" checked label="Small toggle" onChange={() => {}} />
      <Toggle size="md" checked label="Medium toggle" onChange={() => {}} />
    </div>
  ),
};
