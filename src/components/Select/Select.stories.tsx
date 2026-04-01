import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './Select';

const meta = {
  title: 'Components/Form/Select',
  component: Select,
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
      description: 'Label displayed above the select',
    },
    error: {
      control: 'text',
      description: 'Error message displayed below the select',
    },
    helperText: {
      control: 'text',
      description: 'Helper text displayed below the select (hidden when error is set)',
    },
    placeholder: {
      control: 'text',
      description: 'Disabled placeholder option shown first',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the select',
    },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const countryOptions = [
  { value: 'au', label: 'Australia' },
  { value: 'ca', label: 'Canada' },
  { value: 'nz', label: 'New Zealand' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'us', label: 'United States' },
];

const groupedOptions = [
  { value: 'apples', label: 'Apples', group: 'Fruit' },
  { value: 'bananas', label: 'Bananas', group: 'Fruit' },
  { value: 'carrots', label: 'Carrots', group: 'Vegetables' },
  { value: 'broccoli', label: 'Broccoli', group: 'Vegetables' },
  { value: 'milk', label: 'Milk', group: 'Dairy' },
  { value: 'cheese', label: 'Cheese', group: 'Dairy' },
];

export const Default: Story = {
  args: {
    options: countryOptions,
    placeholder: 'Select a country...',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Country',
    options: countryOptions,
    placeholder: 'Select a country...',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Country',
    options: countryOptions,
    placeholder: 'Select a country...',
    helperText: 'Your country determines your tax region.',
  },
};

export const WithError: Story = {
  args: {
    label: 'Country',
    options: countryOptions,
    error: 'Please select a country to continue.',
  },
};

export const Grouped: Story = {
  args: {
    label: 'Grocery Item',
    options: groupedOptions,
    placeholder: 'Choose an item...',
    helperText: 'Options are grouped by category.',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Region',
    options: countryOptions,
    defaultValue: 'au',
    disabled: true,
    helperText: 'Region cannot be changed after account creation.',
  },
};
