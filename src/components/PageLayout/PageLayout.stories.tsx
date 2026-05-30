import type { Meta, StoryObj } from '@storybook/react-vite';
import { PageLayout } from './PageLayout';
import { Header } from '../Header';
import { Sidebar } from '../Sidebar';
import { SidebarBrand, SidebarSection, SidebarItem } from '../SidebarComponents';
import { Button } from '../Button';
import { Input } from '../Input';
import { Home, Users, Settings, BarChart3, Menu, Search, Bell, User } from 'lucide-react';

const meta = {
  title: 'Layout/PageLayout',
  component: PageLayout,
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
} satisfies Meta<typeof PageLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    header: (
      <Header
        sidebarToggle={
          <Button variant="ghost" size="sm">
            <Menu className="h-5 w-5" />
          </Button>
        }
        search={
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              placeholder="Search..."
              className="pl-10 w-full"
            />
          </div>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <User className="h-5 w-5" />
            </Button>
          </div>
        }
      />
    ),
    sidebar: (
      <Sidebar
        brand={
          <SidebarBrand>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">R</span>
              </div>
              <span className="font-semibold text-lg">RedTab</span>
            </div>
          </SidebarBrand>
        }
        sections={
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

            <SidebarSection title="Management">
              <SidebarItem icon={<Settings className="h-5 w-5" />}>
                Settings
              </SidebarItem>
            </SidebarSection>
          </>
        }
      />
    ),
    content: (
      <main className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
          <p className="text-neutral-600 mt-2">Welcome back! Here's what's happening today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-neutral-200">
            <h3 className="font-semibold text-lg mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-primary-600">1,234</p>
            <p className="text-sm text-neutral-600 mt-1">+12% from last month</p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-neutral-200">
            <h3 className="font-semibold text-lg mb-2">Revenue</h3>
            <p className="text-3xl font-bold text-green-600">$45,678</p>
            <p className="text-sm text-neutral-600 mt-1">+8% from last month</p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-neutral-200">
            <h3 className="font-semibold text-lg mb-2">Active Sessions</h3>
            <p className="text-3xl font-bold text-blue-600">892</p>
            <p className="text-sm text-neutral-600 mt-1">+5% from last hour</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-neutral-200">
          <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-primary-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">New user registered</p>
                <p className="text-sm text-neutral-600">john.doe@example.com joined 2 minutes ago</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Report generated</p>
                <p className="text-sm text-neutral-600">Monthly analytics report completed</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    ),
  },
};

export const WithFooter: Story = {
  args: {
    header: (
      <Header
        sidebarToggle={
          <Button variant="ghost" size="sm">
            <Menu className="h-5 w-5" />
          </Button>
        }
        actions={
          <Button variant="ghost" size="sm">
            <User className="h-5 w-5" />
          </Button>
        }
      />
    ),
    sidebar: (
      <Sidebar
        brand={
          <SidebarBrand>
            <span className="font-semibold text-lg">App</span>
          </SidebarBrand>
        }
        sections={
          <SidebarSection>
            <SidebarItem icon={<Home className="h-5 w-5" />} active>Home</SidebarItem>
            <SidebarItem icon={<Settings className="h-5 w-5" />}>Settings</SidebarItem>
          </SidebarSection>
        }
      />
    ),
    footer: (
      <footer className="bg-white border-t border-neutral-200 px-6 py-4">
        <div className="flex items-center justify-between text-sm text-neutral-600">
          <span>© 2024 Your Company. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-neutral-900">Privacy</a>
            <a href="#" className="hover:text-neutral-900">Terms</a>
            <a href="#" className="hover:text-neutral-900">Support</a>
          </div>
        </div>
      </footer>
    ),
    content: (
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">Page with Footer</h1>
        <p className="text-neutral-600">
          This layout includes a footer section at the bottom of the page.
        </p>
      </main>
    ),
  },
};

export const Minimal: Story = {
  args: {
    header: (
      <Header
        actions={
          <Button variant="primary" size="sm">Action</Button>
        }
      />
    ),
    content: (
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">Minimal Layout</h1>
        <p className="text-neutral-600">
          A simple layout with just header and content, no sidebar.
        </p>
      </main>
    ),
  },
};