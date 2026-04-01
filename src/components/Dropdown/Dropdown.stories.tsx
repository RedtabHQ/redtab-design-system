import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dropdown, DropdownItem } from './Dropdown';
import { Button } from '../Button/Button';

const meta = {
  title: 'Components/Interactive/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    align: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Alignment of the menu relative to the trigger',
    },
  },
  args: {
    align: 'left',
  },
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Dropdown {...args} trigger={<Button variant="secondary">Options</Button>}>
      <DropdownItem onClick={() => alert('Edit clicked')}>Edit</DropdownItem>
      <DropdownItem onClick={() => alert('Duplicate clicked')}>Duplicate</DropdownItem>
      <DropdownItem onClick={() => alert('Archive clicked')}>Archive</DropdownItem>
      <DropdownItem onClick={() => alert('Delete clicked')}>Delete</DropdownItem>
    </Dropdown>
  ),
};

export const RightAligned: Story = {
  render: () => (
    <Dropdown align="right" trigger={<Button variant="secondary">Account</Button>}>
      <DropdownItem>Profile</DropdownItem>
      <DropdownItem>Settings</DropdownItem>
      <DropdownItem>Billing</DropdownItem>
      <DropdownItem>Sign out</DropdownItem>
    </Dropdown>
  ),
};

export const WithDisabledItem: Story = {
  render: () => (
    <Dropdown trigger={<Button>Actions</Button>}>
      <DropdownItem>View details</DropdownItem>
      <DropdownItem disabled>Export (unavailable)</DropdownItem>
      <DropdownItem>Download</DropdownItem>
    </Dropdown>
  ),
};

export const IconTrigger: Story = {
  render: () => (
    <Dropdown
      trigger={
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-neutral-200 bg-neutral-0 text-neutral-600 hover:bg-neutral-50"
          aria-label="More options"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <circle cx="12" cy="5" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>
      }
    >
      <DropdownItem>Rename</DropdownItem>
      <DropdownItem>Move to folder</DropdownItem>
      <DropdownItem>Share</DropdownItem>
      <DropdownItem>Delete</DropdownItem>
    </Dropdown>
  ),
};
