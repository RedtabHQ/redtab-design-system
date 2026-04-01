import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Components/Form/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Label displayed next to the checkbox',
    },
    description: {
      control: 'text',
      description: 'Secondary description text below the label',
    },
    error: {
      control: 'text',
      description: 'Error message displayed below the label',
    },
    indeterminate: {
      control: 'boolean',
      description: 'Sets the checkbox to an indeterminate (mixed) state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the checkbox',
    },
    defaultChecked: {
      control: 'boolean',
      description: 'Initial checked state (uncontrolled)',
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Accept terms and conditions',
  },
};

export const Checked: Story = {
  args: {
    label: 'Subscribe to newsletter',
    defaultChecked: true,
  },
};

export const WithDescription: Story = {
  args: {
    label: 'Marketing emails',
    description: 'Receive emails about new features, promotions, and product updates.',
    defaultChecked: true,
  },
};

export const Indeterminate: Story = {
  args: {
    label: 'Select all',
    indeterminate: true,
  },
};

export const WithError: Story = {
  args: {
    label: 'I agree to the terms and conditions',
    error: 'You must accept the terms to continue.',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Two-factor authentication',
    description: 'Contact your administrator to change this setting.',
    defaultChecked: true,
    disabled: true,
  },
};
