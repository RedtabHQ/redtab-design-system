import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppShell } from './AppShell';
import { Button } from '../Button';
import { Input } from '../Input';

const meta = {
  title: 'Layout/AppShell',
  component: AppShell,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: () => (
    <AppShell>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Dashboard Content</h2>
        <p className="text-neutral-600 mb-4">
          This is the main content area. The AppShell provides a simple layout structure
          with sidebar and header areas that are rendered by separate components.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-neutral-200">
            <h3 className="font-semibold mb-2">Card 1</h3>
            <p className="text-sm text-neutral-600">Content for card 1</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-neutral-200">
            <h3 className="font-semibold mb-2">Card 2</h3>
            <p className="text-sm text-neutral-600">Content for card 2</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-neutral-200">
            <h3 className="font-semibold mb-2">Card 3</h3>
            <p className="text-sm text-neutral-600">Content for card 3</p>
          </div>
        </div>
      </div>
    </AppShell>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <AppShell>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Content with Footer</h2>
        <p className="text-neutral-600">
          This AppShell can include footer content rendered by separate components.
        </p>
      </div>
    </AppShell>
  ),
};

export const WithAside: Story = {
  render: () => (
    <AppShell>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Content with Aside</h2>
        <p className="text-neutral-600">
          This AppShell can include aside panels rendered by separate components.
        </p>
      </div>
    </AppShell>
  ),
};