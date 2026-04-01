import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Radio, RadioGroup } from './Radio';

const meta = {
  title: 'Components/Form/Radio',
  component: RadioGroup,
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
      description: 'Legend label for the radio group',
    },
    error: {
      control: 'text',
      description: 'Error message displayed below the group',
    },
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal'],
      description: 'Layout direction of the radio options',
    },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'plan',
    label: 'Billing Plan',
    children: (
      <>
        <Radio name="plan" value="monthly" label="Monthly" defaultChecked />
        <Radio name="plan" value="annual" label="Annual (save 20%)" />
        <Radio name="plan" value="lifetime" label="Lifetime" />
      </>
    ),
  },
};

export const Horizontal: Story = {
  args: {
    name: 'size',
    label: 'T-shirt Size',
    orientation: 'horizontal',
    children: (
      <>
        <Radio name="size" value="sm" label="S" />
        <Radio name="size" value="md" label="M" defaultChecked />
        <Radio name="size" value="lg" label="L" />
        <Radio name="size" value="xl" label="XL" />
      </>
    ),
  },
};

export const WithError: Story = {
  args: {
    name: 'contact',
    label: 'Preferred Contact Method',
    error: 'Please select how you would like to be contacted.',
    children: (
      <>
        <Radio name="contact" value="email" label="Email" />
        <Radio name="contact" value="phone" label="Phone" />
        <Radio name="contact" value="sms" label="SMS" />
      </>
    ),
  },
};

export const WithDisabledOption: Story = {
  args: {
    name: 'shipping',
    label: 'Shipping Method',
    children: (
      <>
        <Radio name="shipping" value="standard" label="Standard (5–7 days)" defaultChecked />
        <Radio name="shipping" value="express" label="Express (2–3 days)" />
        <Radio name="shipping" value="overnight" label="Overnight (unavailable)" disabled />
      </>
    ),
  },
};

// Controlled example using render function
export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('email');
    return (
      <div className="flex flex-col gap-3">
        <RadioGroup
          name="contact-controlled"
          label="Preferred Contact"
          value={value}
          onChange={setValue}
        >
          <Radio
            name="contact-controlled"
            value="email"
            label="Email"
            checked={value === 'email'}
            onChange={() => setValue('email')}
          />
          <Radio
            name="contact-controlled"
            value="phone"
            label="Phone"
            checked={value === 'phone'}
            onChange={() => setValue('phone')}
          />
          <Radio
            name="contact-controlled"
            value="sms"
            label="SMS"
            checked={value === 'sms'}
            onChange={() => setValue('sms')}
          />
        </RadioGroup>
        <p className="text-sm text-neutral-500">
          Selected: <strong>{value}</strong>
        </p>
      </div>
    );
  },
};
