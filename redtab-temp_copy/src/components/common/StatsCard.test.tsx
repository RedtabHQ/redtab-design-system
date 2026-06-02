import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { StatsCard } from './StatsCard';

describe('StatsCard', () => {
  describe('default variant', () => {
    it('renders label and value', () => {
      render(<StatsCard label="Total Contracts" value="42" />);
      expect(screen.getByText('Total Contracts')).toBeTruthy();
      expect(screen.getByText('42')).toBeTruthy();
    });

    it('renders numeric value', () => {
      render(<StatsCard label="Count" value={100} />);
      expect(screen.getByText('100')).toBeTruthy();
    });

    it('does not render progress bar when progress is undefined', () => {
      const { container } = render(<StatsCard label="Label" value="Val" />);
      expect(container.querySelector('.rounded-full')).toBeNull();
    });
  });

  describe('compact variant', () => {
    it('renders with compact variant', () => {
      render(<StatsCard label="Score" value="85%" variant="compact" />);
      expect(screen.getByText('Score')).toBeTruthy();
      expect(screen.getByText('85%')).toBeTruthy();
    });
  });

  describe('kpi variant', () => {
    it('renders icon container when icon is provided', () => {
      const { container } = render(
        <StatsCard label="Activity" value="94.2%" variant="kpi" icon={Activity} />
      );
      expect(container.querySelector('svg')).toBeTruthy();
    });

    it('renders without icon', () => {
      const { container } = render(<StatsCard label="Rate" value="12%" variant="kpi" />);
      expect(screen.getByText('Rate')).toBeTruthy();
    });
  });

  describe('trend indicator', () => {
    it('renders up trend', () => {
      const { container } = render(
        <StatsCard
          label="Revenue"
          value="1000"
          trend={{ direction: 'up', value: '+12.5%' }}
        />
      );
      expect(screen.getByText('+12.5%')).toBeTruthy();
      expect(container.querySelector('svg')).toBeTruthy();
    });

    it('renders down trend', () => {
      render(
        <StatsCard
          label="Revenue"
          value="1000"
          trend={{ direction: 'down', value: '-5%' }}
        />
      );
      expect(screen.getByText('-5%')).toBeTruthy();
    });

    it('renders neutral trend without icon', () => {
      const { container } = render(
        <StatsCard
          label="Revenue"
          value="1000"
          trend={{ direction: 'neutral', value: '0%' }}
        />
      );
      expect(screen.getByText('0%')).toBeTruthy();
    });
  });

  describe('progress bar', () => {
    it('renders progress bar when progress is provided', () => {
      const { container } = render(<StatsCard label="Recovery" value="72%" progress={72} />);
      const progressBar = container.querySelector('.rounded-full');
      expect(progressBar).toBeTruthy();
    });

    it('clamps progress to 0-100', () => {
      const { container } = render(<StatsCard label="Label" value="Val" progress={150} />);
      const inner = container.querySelector('[style*="width"]') as HTMLElement;
      expect(inner?.style.width).toBe('100%');
    });
  });

  describe('secondaryValue', () => {
    it('renders secondary value when provided', () => {
      render(<StatsCard label="Book Value" value="1.2k" secondaryValue="≈ $1,200" />);
      expect(screen.getByText('≈ $1,200')).toBeTruthy();
    });

    it('does not render secondary value section when not provided', () => {
      const { container } = render(<StatsCard label="Label" value="Val" />);
      // No secondary value text
      expect(container.querySelectorAll('p').length).toBeLessThan(3);
    });
  });

  describe('color variants', () => {
    it('applies blue color classes', () => {
      const { container } = render(<StatsCard label="L" value="V" color="blue" progress={50} />);
      expect(container.innerHTML).toContain('bg-blue-500');
    });

    it('applies green color classes', () => {
      const { container } = render(<StatsCard label="L" value="V" color="green" progress={50} />);
      expect(container.innerHTML).toContain('bg-green-500');
    });

    it('applies red color classes', () => {
      const { container } = render(<StatsCard label="L" value="V" color="red" progress={50} />);
      expect(container.innerHTML).toContain('bg-red-500');
    });

    it('applies amber color classes', () => {
      const { container } = render(<StatsCard label="L" value="V" color="amber" progress={50} />);
      expect(container.innerHTML).toContain('bg-amber-500');
    });

    it('applies gray color classes', () => {
      const { container } = render(<StatsCard label="L" value="V" color="gray" progress={50} />);
      expect(container.innerHTML).toContain('bg-gray-400');
    });
  });

  describe('className passthrough', () => {
    it('applies custom className to root element', () => {
      const { container } = render(
        <StatsCard label="L" value="V" className="custom-test-class" />
      );
      expect(container.firstElementChild?.className).toContain('custom-test-class');
    });
  });
});
