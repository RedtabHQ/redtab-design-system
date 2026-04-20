import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Alert } from './Alert';

const meta: Meta<typeof Alert> = {
  title: 'Components/Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'error', 'warning', 'info'],
    },
    dismissible: { control: 'boolean' },
    title: { control: 'text' },
    message: { control: 'text' },
  },
  args: {
    variant: 'info',
    message: 'This is an informational message.',
    dismissible: false,
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Info: Story = {
  args: { variant: 'info', message: 'Your session will expire in 5 minutes.' },
};

export const Success: Story = {
  args: { variant: 'success', title: 'Payment successful', message: 'Your transaction has been processed.' },
};

export const Warning: Story = {
  args: { variant: 'warning', title: 'Low balance', message: 'Your account balance is below the minimum threshold.' },
};

export const Error: Story = {
  args: { variant: 'error', title: 'Upload failed', message: 'The file could not be uploaded. Please try again.' },
};

export const Dismissible: Story = {
  render: (args) => {
    const [visible, setVisible] = useState(true);
    return visible ? (
      <Alert {...args} dismissible onClose={() => setVisible(false)} />
    ) : (
      <button
        type="button"
        className="text-sm text-primary-600 underline"
        onClick={() => setVisible(true)}
      >
        Show alert again
      </button>
    );
  },
  args: {
    variant: 'warning',
    title: 'Action required',
    message: 'Please verify your email address to continue.',
    dismissible: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-3 max-w-lg">
      <Alert variant="info" message="Informational message." />
      <Alert variant="success" title="Success!" message="Your changes were saved." />
      <Alert variant="warning" title="Warning" message="Review before proceeding." />
      <Alert variant="error" title="Error" message="Something went wrong." />
    </div>
  ),
};
