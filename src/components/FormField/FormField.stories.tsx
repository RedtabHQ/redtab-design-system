import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormField } from './FormField';
import { Input } from '../Input/Input';

const meta = {
  title: 'Components/Form/FormField',
  component: FormField,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '320px' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label displayed above the field content',
    },
    error: {
      control: 'text',
      description: 'Error message shown below the field content',
    },
    hint: {
      control: 'text',
      description: 'Hint text shown below the field content (hidden when error is set)',
    },
    required: {
      control: 'boolean',
      description: 'Appends a required asterisk to the label',
    },
    htmlFor: {
      control: 'text',
      description: 'Associates the label with a form control via id',
    },
  },
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Email Address',
    htmlFor: 'email',
    children: <Input id="email" placeholder="you@example.com" type="email" />,
  },
};

export const WithHint: Story = {
  args: {
    label: 'Username',
    htmlFor: 'username',
    hint: 'Must be 3–20 characters. Letters, numbers, and underscores only.',
    children: <Input id="username" placeholder="john_doe" />,
  },
};

export const WithError: Story = {
  args: {
    label: 'Email Address',
    htmlFor: 'email-error',
    error: 'Please enter a valid email address.',
    children: (
      <Input
        id="email-error"
        defaultValue="not-an-email"
        type="email"
        error="Please enter a valid email address."
      />
    ),
  },
};

export const Required: Story = {
  args: {
    label: 'Full Name',
    htmlFor: 'full-name',
    required: true,
    hint: 'Enter your first and last name.',
    children: <Input id="full-name" placeholder="Jane Smith" />,
  },
};

export const RequiredWithError: Story = {
  args: {
    label: 'Password',
    htmlFor: 'password',
    required: true,
    error: 'Password must be at least 8 characters.',
    children: <Input id="password" type="password" defaultValue="123" />,
  },
};
