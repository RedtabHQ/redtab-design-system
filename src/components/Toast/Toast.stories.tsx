import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Toast } from './Toast';

const meta: Meta<typeof Toast> = {
  title: 'Components/Interactive/Toast',
  component: Toast,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'warning', 'error', 'info'],
    },
    autoClose: {
      control: 'number',
      description: 'Auto-close delay in milliseconds',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const Info: Story = {
  args: {
    variant: 'info',
    title: 'Information',
    description: 'This is an informational message with additional context.',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Success!',
    description: 'Your changes have been saved successfully.',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Warning',
    description: 'Please review your input before proceeding.',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    title: 'Error',
    description: 'Something went wrong. Please try again.',
  },
};

export const TitleOnly: Story = {
  args: {
    variant: 'info',
    title: 'Simple notification with no description.',
  },
};

export const WithCloseButton: Story = {
  render: (args) => {
    const [visible, setVisible] = useState(true);
    if (!visible) {
      return (
        <button
          type="button"
          onClick={() => { setVisible(true); }}
          className="rounded bg-primary-600 px-3 py-1.5 text-sm text-white"
        >
          Show Toast
        </button>
      );
    }
    return <Toast {...args} onClose={() => { setVisible(false); }} />;
  },
  args: {
    variant: 'success',
    title: 'Dismissible Toast',
    description: 'Click the X button to dismiss this notification.',
  },
};

export const AutoClose: Story = {
  render: (args) => {
    const [visible, setVisible] = useState(true);
    const [count, setCount] = useState(0);
    if (!visible) {
      return (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-neutral-600">Toast auto-closed ({count} time{count !== 1 ? 's' : ''})</p>
          <button
            type="button"
            onClick={() => { setVisible(true); }}
            className="w-fit rounded bg-primary-600 px-3 py-1.5 text-sm text-white"
          >
            Show Again
          </button>
        </div>
      );
    }
    return (
      <Toast
        {...args}
        onClose={() => {
          setVisible(false);
          setCount((c) => c + 1);
        }}
      />
    );
  },
  args: {
    variant: 'info',
    title: 'Auto-closing Toast',
    description: 'This toast will automatically close after 3 seconds.',
    autoClose: 3000,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-3 max-w-sm">
      <Toast variant="info" title="Info" description="Informational message." />
      <Toast variant="success" title="Success" description="Operation completed." />
      <Toast variant="warning" title="Warning" description="Proceed with caution." />
      <Toast variant="error" title="Error" description="Something failed." />
    </div>
  ),
};
