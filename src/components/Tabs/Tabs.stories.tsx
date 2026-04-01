import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs } from './Tabs';

const sampleTabs = [
  { id: 'overview', label: 'Overview', content: <p>Overview content for this section.</p> },
  { id: 'features', label: 'Features', content: <p>Feature list and descriptions go here.</p> },
  { id: 'pricing', label: 'Pricing', content: <p>Pricing plans and comparison table.</p> },
];

const meta = {
  title: 'Components/Interactive/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  args: {
    tabs: sampleTabs,
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDefaultTab: Story = {
  args: {
    defaultTab: 'features',
  },
};

export const TwoTabs: Story = {
  args: {
    tabs: [
      { id: 'tab1', label: 'First', content: <p>First tab content.</p> },
      { id: 'tab2', label: 'Second', content: <p>Second tab content.</p> },
    ],
  },
};

export const ManyTabs: Story = {
  args: {
    tabs: [
      { id: 'general', label: 'General', content: <p>General settings.</p> },
      { id: 'security', label: 'Security', content: <p>Security options.</p> },
      { id: 'billing', label: 'Billing', content: <p>Billing information.</p> },
      { id: 'notifications', label: 'Notifications', content: <p>Notification preferences.</p> },
      { id: 'integrations', label: 'Integrations', content: <p>Connected integrations.</p> },
    ],
  },
};
