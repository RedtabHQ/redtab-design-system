import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './Card';
import { Button } from '../Button/Button';
import { Text } from '../Typography/Typography';

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '380px' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'surface'],
      description: 'Visual style of the card. "default" includes a shadow, "surface" is flat.',
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
      description: 'Internal padding of the card',
    },
  },
  args: {
    variant: 'default',
    padding: 'md',
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <Text>This is a default card with medium padding and a subtle drop shadow.</Text>
    ),
  },
};

export const Surface: Story = {
  args: {
    variant: 'surface',
    children: (
      <Text>This is a surface card. It has no shadow — useful for content nested inside other containers.</Text>
    ),
  },
};

export const WithHeader: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
      </CardHeader>
      <CardContent>
        <Text>Card body content goes here. This area is separated from the header by a border.</Text>
      </CardContent>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: (args) => (
    <Card {...args}>
      <Text>Card body content with a footer below.</Text>
      <CardFooter>
        <Text variant="caption" className="text-neutral-500">
          Last updated: April 1, 2026
        </Text>
      </CardFooter>
    </Card>
  ),
};

export const CompleteCard: Story = {
  name: 'Complete Card (Header + Content + Footer)',
  render: (args) => (
    <Card {...args} padding="none">
      <div className="p-4">
        <CardHeader>
          <CardTitle>Confirm Deletion</CardTitle>
        </CardHeader>
        <CardContent>
          <Text>
            Are you sure you want to delete this item? This action cannot be undone and all associated
            data will be permanently removed.
          </Text>
        </CardContent>
        <CardFooter className="gap-2 justify-end">
          <Button variant="secondary" size="sm">
            Cancel
          </Button>
          <Button variant="danger" size="sm">
            Delete
          </Button>
        </CardFooter>
      </div>
    </Card>
  ),
};

export const NoPadding: Story = {
  args: {
    padding: 'none',
    children: (
      <img
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop"
        alt="Mountain landscape"
        style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '0.5rem' }}
      />
    ),
  },
};
