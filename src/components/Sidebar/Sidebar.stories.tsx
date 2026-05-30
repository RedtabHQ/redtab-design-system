import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sidebar } from './Sidebar';
import { SidebarBrand, SidebarSection, SidebarItem } from '../SidebarComponents';
import { Home, Users, Settings, BarChart3, FileText, HelpCircle } from 'lucide-react';

const meta = {
  title: 'Layout/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    collapsed: {
      control: 'boolean',
      description: 'Whether the sidebar is collapsed',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  args: {
    collapsed: false,
  },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    brand: (
      <SidebarBrand>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">R</span>
          </div>
          <span className="font-semibold text-lg">RedTab</span>
        </div>
      </SidebarBrand>
    ),
    sections: (
      <>
        <SidebarSection title="Main">
          <SidebarItem icon={<Home className="h-5 w-5" />} active>
            Dashboard
          </SidebarItem>
          <SidebarItem icon={<Users className="h-5 w-5" />}>
            Users
          </SidebarItem>
          <SidebarItem icon={<BarChart3 className="h-5 w-5" />}>
            Analytics
          </SidebarItem>
        </SidebarSection>

        <SidebarSection title="Content">
          <SidebarItem icon={<FileText className="h-5 w-5" />}>
            Documents
          </SidebarItem>
          <SidebarItem icon={<Settings className="h-5 w-5" />}>
            Settings
          </SidebarItem>
        </SidebarSection>
      </>
    ),
    footer: (
      <SidebarSection>
        <SidebarItem icon={<HelpCircle className="h-5 w-5" />}>
          Help & Support
        </SidebarItem>
      </SidebarSection>
    ),
  },
};

export const Collapsed: Story = {
  args: {
    collapsed: true,
    brand: (
      <SidebarBrand>
        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold">R</span>
        </div>
      </SidebarBrand>
    ),
    sections: (
      <>
        <SidebarSection>
          <SidebarItem icon={<Home className="h-5 w-5" />} active />
          <SidebarItem icon={<Users className="h-5 w-5" />} />
          <SidebarItem icon={<BarChart3 className="h-5 w-5" />} />
        </SidebarSection>

        <SidebarSection>
          <SidebarItem icon={<FileText className="h-5 w-5" />} />
          <SidebarItem icon={<Settings className="h-5 w-5" />} />
        </SidebarSection>
      </>
    ),
    footer: (
      <SidebarSection>
        <SidebarItem icon={<HelpCircle className="h-5 w-5" />} />
      </SidebarSection>
    ),
  },
};

export const WithActiveStates: Story = {
  args: {
    brand: (
      <SidebarBrand>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">R</span>
          </div>
          <span className="font-semibold text-lg">RedTab</span>
        </div>
      </SidebarBrand>
    ),
    sections: (
      <>
        <SidebarSection title="Navigation">
          <SidebarItem icon={<Home className="h-5 w-5" />}>
            Dashboard
          </SidebarItem>
          <SidebarItem icon={<Users className="h-5 w-5" />} active>
            Users
          </SidebarItem>
          <SidebarItem icon={<BarChart3 className="h-5 w-5" />}>
            Analytics
          </SidebarItem>
          <SidebarItem icon={<FileText className="h-5 w-5" />}>
            Reports
          </SidebarItem>
        </SidebarSection>

        <SidebarSection title="Management">
          <SidebarItem icon={<Settings className="h-5 w-5" />}>
            Settings
          </SidebarItem>
        </SidebarSection>
      </>
    ),
  },
};

export const Minimal: Story = {
  args: {
    brand: (
      <SidebarBrand>
        <span className="font-bold text-lg">App</span>
      </SidebarBrand>
    ),
    sections: (
      <SidebarSection>
        <SidebarItem icon={<Home className="h-5 w-5" />} active>Home</SidebarItem>
        <SidebarItem icon={<Settings className="h-5 w-5" />}>Settings</SidebarItem>
      </SidebarSection>
    ),
  },
};