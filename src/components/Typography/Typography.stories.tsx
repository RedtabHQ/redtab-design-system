import type { Meta, StoryObj } from '@storybook/react-vite';
import { Heading, Text } from './Typography';

// Use the Heading component as the primary export default for the meta
const meta = {
  title: 'Components/Typography',
  component: Heading,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    level: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      description: 'Controls the visual size/weight style applied',
    },
    as: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      description: 'The HTML element to render. Defaults to the `level` value when omitted.',
    },
    children: {
      control: 'text',
      description: 'Text content',
    },
  },
  args: {
    children: 'The quick brown fox jumps over the lazy dog',
    level: 'h2',
  },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllHeadings: Story = {
  name: 'All Headings (H1–H6)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <Heading level="h1">H1 — Display Heading</Heading>
      <Heading level="h2">H2 — Section Heading</Heading>
      <Heading level="h3">H3 — Sub-section Heading</Heading>
      <Heading level="h4">H4 — Card Title</Heading>
      <Heading level="h5">H5 — Sub-title</Heading>
      <Heading level="h6">H6 — Small Heading</Heading>
    </div>
  ),
};

export const H1: Story = {
  args: {
    level: 'h1',
    children: 'H1 — The largest heading level',
  },
};

export const H2: Story = {
  args: {
    level: 'h2',
    children: 'H2 — Section heading',
  },
};

export const Body: Story = {
  render: () => (
    <Text variant="body">
      Body text uses a 16px base size with a normal weight and comfortable line-height for reading longer
      paragraphs. It defaults to a neutral-700 colour for good contrast on light backgrounds.
    </Text>
  ),
};

export const Caption: Story = {
  render: () => (
    <Text variant="caption">
      Caption text is smaller (14px) and is suitable for supporting copy, timestamps, or supplementary
      information beneath other content.
    </Text>
  ),
};

export const CustomTag: Story = {
  name: 'Custom Tag (visual H2 rendered as H3)',
  render: () => (
    <Heading level="h2" as="h3">
      Styled as H2 but rendered as an &lt;h3&gt; element — useful for maintaining document outline
      without breaking visual hierarchy.
    </Heading>
  ),
};
