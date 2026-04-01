import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from './Textarea';

const meta = {
  title: 'Components/Form/Textarea',
  component: Textarea,
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
      description: 'Label displayed above the textarea',
    },
    error: {
      control: 'text',
      description: 'Error message displayed below the textarea',
    },
    helperText: {
      control: 'text',
      description: 'Helper text displayed below the textarea (hidden when error is set)',
    },
    autoExpand: {
      control: 'boolean',
      description: 'Automatically grows the textarea to fit content',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the textarea',
    },
    rows: {
      control: 'number',
      description: 'Initial visible row count',
    },
  },
  args: {
    placeholder: 'Enter text...',
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Write something...',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Message',
    placeholder: 'Type your message here...',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Bio',
    placeholder: 'Tell us about yourself...',
    helperText: 'Maximum 500 characters. Will be shown on your public profile.',
  },
};

export const WithError: Story = {
  args: {
    label: 'Description',
    defaultValue: 'Too short.',
    error: 'Description must be at least 50 characters.',
  },
};

export const AutoExpand: Story = {
  args: {
    label: 'Notes',
    placeholder: 'Start typing — the textarea will grow as you type...',
    autoExpand: true,
    helperText: 'This textarea expands automatically to fit your content.',
  },
};

export const AutoExpandWithContent: Story = {
  args: {
    label: 'Pre-filled Notes',
    autoExpand: true,
    defaultValue:
      'This textarea starts with several lines of pre-filled content.\n\nParagraph two begins here and adds additional height.\n\nParagraph three demonstrates that the auto-expand works on initial render too.',
  },
};

export const Disabled: Story = {
  args: {
    label: 'System Notes',
    defaultValue: 'This field is managed by the system and cannot be edited.',
    disabled: true,
  },
};
