import type { Meta, StoryObj } from '@storybook/react-vite';
import { AuthLayout } from './AuthLayout';
import { Button } from '../Button';
import { Input } from '../Input';
import { AuthHeroPanel } from '../AuthHeroPanel';

const meta = {
  title: 'Layout/AuthLayout',
  component: AuthLayout,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    hideLeftOnMobile: {
      control: 'boolean',
      description: 'Hide the left panel on mobile devices',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  args: {
    hideLeftOnMobile: false,
  },
} satisfies Meta<typeof AuthLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    leftPanel: (
      <AuthHeroPanel
        logo={<div className="text-2xl font-bold text-white">Logo</div>}
        title="Welcome Back"
        subtitle="Sign in to your account to continue"
      >
        <div className="mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2">Features</h3>
            <ul className="text-white/80 text-sm space-y-1">
              <li>• Secure authentication</li>
              <li>• Easy account management</li>
              <li>• 24/7 support</li>
            </ul>
          </div>
        </div>
      </AuthHeroPanel>
    ),
    children: (
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-neutral-900">Sign In</h2>
          <p className="text-neutral-600 mt-2">Enter your credentials to access your account</p>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="Enter your email"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Password
            </label>
            <Input
              type="password"
              placeholder="Enter your password"
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-neutral-300" />
              <span className="ml-2 text-sm text-neutral-600">Remember me</span>
            </label>
            <a href="#" className="text-sm text-primary-600 hover:text-primary-500">
              Forgot password?
            </a>
          </div>

          <Button variant="primary" size="lg" className="w-full">
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-neutral-600">
            Don't have an account?{' '}
            <a href="#" className="text-primary-600 hover:text-primary-500 font-medium">
              Sign up
            </a>
          </p>
        </div>
      </div>
    ),
  },
};

export const HideLeftOnMobile: Story = {
  args: {
    hideLeftOnMobile: true,
    leftPanel: (
      <AuthHeroPanel
        logo={<div className="text-2xl font-bold text-white">Logo</div>}
        title="Welcome Back"
        subtitle="Sign in to your account"
      />
    ),
    children: (
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-neutral-900">Sign In</h2>
          <p className="text-neutral-600 mt-2">Mobile-optimized layout</p>
        </div>

        <form className="space-y-6">
          <div>
            <Input
              type="email"
              placeholder="Email"
              className="w-full"
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password"
              className="w-full"
            />
          </div>
          <Button variant="primary" size="lg" className="w-full">
            Sign In
          </Button>
        </form>
      </div>
    ),
  },
};

export const Minimal: Story = {
  args: {
    leftPanel: (
      <div className="h-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-4xl font-bold mb-4">Logo</div>
          <p className="text-primary-100">Simple branding</p>
        </div>
      </div>
    ),
    children: (
      <div className="max-w-sm mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6">Welcome</h2>
        <form className="space-y-4">
          <Input type="email" placeholder="Email" />
          <Input type="password" placeholder="Password" />
          <Button variant="primary" className="w-full">Sign In</Button>
        </form>
      </div>
    ),
  },
};