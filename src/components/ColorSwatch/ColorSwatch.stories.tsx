import type { Meta, StoryObj } from '@storybook/react-vite';
import { ColorSwatch } from './ColorSwatch';
import { colors } from '../../tokens';

const meta = {
  title: 'Design Tokens/ColorSwatch',
  component: ColorSwatch,
  tags: ['autodocs'],
  argTypes: {
    hex: { control: 'color' },
  },
} satisfies Meta<typeof ColorSwatch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    name: 'primary-500',
    hex: colors.primary[500],
  },
};

export const Neutral: Story = {
  args: {
    name: 'neutral-900',
    hex: colors.neutral[900],
  },
};

export const Success: Story = {
  args: {
    name: 'success-500',
    hex: colors.success[500],
  },
};

export const Error: Story = {
  args: {
    name: 'error-500',
    hex: colors.error[500],
  },
};

export const AllPrimaryColors: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-2">
      {Object.entries(colors.primary).map(([shade, hex]) => (
        <ColorSwatch key={shade} name={`primary-${shade}`} hex={hex} />
      ))}
    </div>
  ),
};

export const AllNeutralColors: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-2">
      {Object.entries(colors.neutral).map(([shade, hex]) => (
        <ColorSwatch key={shade} name={`neutral-${shade}`} hex={hex} />
      ))}
    </div>
  ),
};

export const SemanticColors: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      {Object.entries({ success: colors.success, warning: colors.warning, error: colors.error, info: colors.info }).map(
        ([category, shades]) => (
          <div key={category}>
            <h3 className="mb-2 text-sm font-semibold capitalize text-neutral-700">{category}</h3>
            {Object.entries(shades).map(([shade, hex]) => (
              <ColorSwatch key={shade} name={`${category}-${shade}`} hex={hex} />
            ))}
          </div>
        ),
      )}
    </div>
  ),
};
