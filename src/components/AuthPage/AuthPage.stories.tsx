import type { Meta, StoryObj } from '@storybook/react-vite';
import { AuthPage } from './AuthPage';

const meta = {
  title: 'Pages/AuthPage',
  component: AuthPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof AuthPage>;

export default meta;
type Story = StoryObj<typeof AuthPage>;

export const Login: Story = {
  args: {},
};

export const SignUp: Story = {
  args: {
    hero: (
      <AuthHeroPanel
        logo={<div className="text-3xl font-bold text-white">RedTab</div>}
        title="Join Our Community"
        subtitle="Create your account and start your journey today"
      >
        <div className="mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2">Get started with:</h3>
            <ul className="text-white/80 text-sm space-y-1">
              <li>• Free trial period</li>
              <li>• No credit card required</li>
              <li>• Full feature access</li>
            </ul>
          </div>
        </div>
      </AuthHeroPanel>
    ),
    form: (
      <AuthCard>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-neutral-900">Create Account</h2>
          <p className="text-neutral-600 mt-2">Fill in your information to get started</p>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                First Name
              </label>
              <Input placeholder="John" className="w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Last Name
              </label>
              <Input placeholder="Doe" className="w-full" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Email Address
            </label>
            <Input type="email" placeholder="john@example.com" className="w-full" />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Password
            </label>
            <Input type="password" placeholder="Create a password" className="w-full" />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Confirm Password
            </label>
            <Input type="password" placeholder="Confirm your password" className="w-full" />
          </div>

          <div className="flex items-center">
            <input type="checkbox" className="rounded border-neutral-300" />
            <span className="ml-2 text-sm text-neutral-600">
              I agree to the{' '}
              <a href="#" className="text-primary-600 hover:text-primary-500">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary-600 hover:text-primary-500">
                Privacy Policy
              </a>
            </span>
          </div>

          <Button variant="primary" size="lg" className="w-full">
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-neutral-600">
            Already have an account?{' '}
            <a href="#" className="text-primary-600 hover:text-primary-500 font-medium">
              Sign in
            </a>
          </p>
        </div>
      </AuthCard>
    ),
  },
};

export const NoHero: Story = {
  args: {
    form: (
      <AuthCard className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-neutral-900">Welcome Back</h2>
          <p className="text-neutral-600 mt-2">Sign in to continue</p>
        </div>

        <form className="space-y-6">
          <Input type="email" placeholder="Email" />
          <Input type="password" placeholder="Password" />
          <Button variant="primary" className="w-full">Sign In</Button>
        </form>
      </AuthCard>
    ),
  },
};