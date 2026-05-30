import type { Meta, StoryObj } from '@storybook/react-vite';
import { Header } from './Header';
import { Button } from '../Button';
import { Input } from '../Input';
import { Menu, Search, Bell, User } from 'lucide-react';

const meta = {
  title: 'Layout/Header',
  component: Header,
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
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    sidebarToggle: (
      <Button variant="ghost" size="sm">
        <Menu className="h-5 w-5" />
      </Button>
    ),
    contextControl: (
      <div className="text-sm font-medium text-neutral-700">Global View</div>
    ),
    search: (
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <Input
          placeholder="Search..."
          className="pl-10 w-full"
        />
      </div>
    ),
    userDropdown: (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="sm">
          <User className="h-5 w-5" />
        </Button>
      </div>
    ),
  },
};

export const WithBreadcrumbs: Story = {
  args: {
    sidebarToggle: (
      <Button variant="ghost" size="sm">
        <Menu className="h-5 w-5" />
      </Button>
    ),
    search: (
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <Input
          placeholder="Search..."
          className="pl-10 w-full"
        />
      </div>
    ),
    actions: (
      <div className="flex items-center gap-3">
        <nav className="hidden md:flex items-center gap-2 text-sm text-neutral-600">
          <a href="#" className="hover:text-neutral-900">Dashboard</a>
          <span>/</span>
          <a href="#" className="hover:text-neutral-900">Users</a>
          <span>/</span>
          <span className="text-neutral-900 font-medium">Profile</span>
        </nav>
        <Button variant="ghost" size="sm">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="primary" size="sm">Save</Button>
      </div>
    ),
  },
};

export const Minimal: Story = {
  args: {
    sidebarToggle: (
      <Button variant="ghost" size="sm">
        <Menu className="h-5 w-5" />
      </Button>
    ),
    actions: (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm">
          <User className="h-5 w-5" />
        </Button>
      </div>
    ),
  },
};

export const WithLogo: Story = {
  args: {
    sidebarToggle: (
      <Button variant="ghost" size="sm">
        <Menu className="h-5 w-5" />
      </Button>
    ),
    search: (
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <Input
          placeholder="Search..."
          className="pl-10 w-full"
        />
      </div>
    ),
    actions: (
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="font-semibold text-neutral-900">RedTab</span>
        </div>
        <Button variant="ghost" size="sm">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="sm">
          <User className="h-5 w-5" />
        </Button>
      </div>
    ),
  },
};