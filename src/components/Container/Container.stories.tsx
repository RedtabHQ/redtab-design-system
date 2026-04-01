import type { Meta, StoryObj } from '@storybook/react-vite';
import { Container } from './Container';

const meta: Meta<typeof Container> = {
  title: 'Components/Layout/Container',
  component: Container,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    maxWidth: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', '2xl', 'full'],
      description: 'Controls the maximum width of the container',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Container>;

const ContainerContent = () => (
  <div className="bg-blue-100 border border-blue-300 rounded p-4 text-blue-800 text-sm font-medium text-center">
    Container content — width is constrained by the maxWidth prop
  </div>
);

export const Default: Story = {
  args: {
    maxWidth: 'xl',
  },
  render: (args) => (
    <div className="bg-gray-50 py-8">
      <Container {...args}>
        <ContainerContent />
      </Container>
    </div>
  ),
};

export const Small: Story = {
  args: {
    maxWidth: 'sm',
  },
  render: (args) => (
    <div className="bg-gray-50 py-8">
      <Container {...args}>
        <ContainerContent />
      </Container>
    </div>
  ),
};

export const Large: Story = {
  args: {
    maxWidth: '2xl',
  },
  render: (args) => (
    <div className="bg-gray-50 py-8">
      <Container {...args}>
        <ContainerContent />
      </Container>
    </div>
  ),
};

export const Full: Story = {
  args: {
    maxWidth: 'full',
  },
  render: (args) => (
    <div className="bg-gray-50 py-8">
      <Container {...args}>
        <ContainerContent />
      </Container>
    </div>
  ),
};
