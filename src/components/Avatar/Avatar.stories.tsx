import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from './Avatar';

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Size of the avatar',
    },
    src: {
      control: 'text',
      description: 'URL of the image to display',
    },
    alt: {
      control: 'text',
      description: 'Accessible alt text for the image',
    },
    initials: {
      control: 'text',
      description: 'Up to 2 characters shown when no image is available',
    },
  },
  args: {
    size: 'md',
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithImage: Story = {
  args: {
    src: 'https://i.pravatar.cc/150',
    alt: 'User avatar',
    size: 'md',
  },
};

export const WithInitials: Story = {
  args: {
    initials: 'TN',
    size: 'md',
  },
};

export const Fallback: Story = {
  name: 'Fallback (no src, no initials)',
  args: {
    size: 'md',
  },
};

export const Small: Story = {
  args: {
    src: 'https://i.pravatar.cc/150',
    alt: 'Small avatar',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    src: 'https://i.pravatar.cc/150',
    alt: 'Large avatar',
    size: 'xl',
  },
};

export const AllSizes: Story = {
  name: 'All Sizes',
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Avatar src="https://i.pravatar.cc/150?img=1" alt="Small" size="sm" />
      <Avatar src="https://i.pravatar.cc/150?img=2" alt="Medium" size="md" />
      <Avatar src="https://i.pravatar.cc/150?img=3" alt="Large" size="lg" />
      <Avatar src="https://i.pravatar.cc/150?img=4" alt="Extra large" size="xl" />
    </div>
  ),
};
