import { type LucideIcon } from 'lucide-react';
import { StatsCard as DSStatsCard, type StatsCardProps as DSStatsCardProps } from '@redtabhq/design-system';

type LegacyColor = 'blue' | 'green' | 'red' | 'amber' | 'gray';
type DSColor = DSStatsCardProps['color'];

const colorMap: Record<LegacyColor, DSColor> = {
  blue:  'info',
  green: 'success',
  red:   'error',
  amber: 'warning',
  gray:  'neutral',
};

interface StatsCardProps extends Omit<DSStatsCardProps, 'color' | 'icon'> {
  icon?: LucideIcon;
  color?: LegacyColor | DSColor;
}

export function StatsCard({ icon: Icon, color, ...props }: StatsCardProps) {
  const resolvedColor: DSColor = color
    ? (colorMap[color as LegacyColor] ?? (color as DSColor))
    : undefined;

  return (
    <DSStatsCard
      icon={Icon ? <Icon size={20} /> : undefined}
      color={resolvedColor}
      {...props}
    />
  );
}
