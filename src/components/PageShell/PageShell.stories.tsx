import type { Meta, StoryObj } from '@storybook/react-vite';
import { PageShell } from './PageShell';
import { Button } from '../Button';
import { Input } from '../Input';

const meta = {
  title: 'Layout/PageShell',
  component: PageShell,
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
} satisfies Meta<typeof PageShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Page Title',
    actions: (
      <div className="flex items-center gap-4">
        <Button variant="secondary" size="sm">Action</Button>
        <Button variant="primary" size="sm">Primary Action</Button>
      </div>
    ),
    children: (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Page Content</h2>
        <p className="text-neutral-600 mb-6">
          The PageShell provides a simple page layout with a header and content area.
          It's perfect for pages that don't need a sidebar.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-neutral-200">
            <h3 className="font-semibold mb-3">Section 1</h3>
            <p className="text-sm text-neutral-600 mb-4">
              Content for the first section goes here.
            </p>
            <Button variant="ghost" size="sm">Learn More</Button>
          </div>
          <div className="bg-white p-6 rounded-lg border border-neutral-200">
            <h3 className="font-semibold mb-3">Section 2</h3>
            <p className="text-sm text-neutral-600 mb-4">
              Content for the second section goes here.
            </p>
            <Button variant="ghost" size="sm">Learn More</Button>
          </div>
        </div>
      </div>
    ),
  },
};