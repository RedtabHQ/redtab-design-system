import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './Card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Content</Card>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies default variant with shadow', () => {
    render(<Card>Card</Card>);
    expect(screen.getByText('Card').className).toContain('shadow-base');
  });

  it('applies surface variant without shadow', () => {
    render(<Card variant="surface">Surface</Card>);
    expect(screen.getByText('Surface').className).toContain('shadow-none');
  });

  it('applies padding variants', () => {
    const { rerender } = render(<Card padding="sm">Small</Card>);
    expect(screen.getByText('Small').className).toContain('p-3');

    rerender(<Card padding="lg">Large</Card>);
    expect(screen.getByText('Large').className).toContain('p-6');
  });

  it('renders composed card with subcomponents', () => {
    render(
      <Card padding="none">
        <CardHeader>
          <CardTitle>Title</CardTitle>
        </CardHeader>
        <CardContent>Body</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });
});
