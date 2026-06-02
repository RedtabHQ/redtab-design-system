import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { Card } from './Card';

describe('Card', () => {
  describe('Rendering', () => {
    it('should render children content', () => {
      render(
        <Card>
          <p>Card content</p>
        </Card>
      );
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('should render with title', () => {
      render(
        <Card title="Test Title">
          <p>Content</p>
        </Card>
      );
      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('should render with subtitle', () => {
      render(
        <Card title="Title" subtitle="Test Subtitle">
          <p>Content</p>
        </Card>
      );
      expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    });

    it('should render subtitle without title', () => {
      render(
        <Card subtitle="Subtitle Only">
          <p>Content</p>
        </Card>
      );
      expect(screen.getByText('Subtitle Only')).toBeInTheDocument();
    });

    it('should render footer', () => {
      render(
        <Card footer={<button>Footer Button</button>}>
          <p>Content</p>
        </Card>
      );
      expect(screen.getByRole('button', { name: /footer button/i })).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should apply default card className', () => {
      const { container } = render(
        <Card>
          <p>Content</p>
        </Card>
      );
      const cardElement = container.firstChild as HTMLElement;
      expect(cardElement).toHaveClass('card');
    });

    it('should apply custom className', () => {
      const { container } = render(
        <Card className="custom-class">
          <p>Content</p>
        </Card>
      );
      const cardElement = container.firstChild as HTMLElement;
      expect(cardElement).toHaveClass('card', 'custom-class');
    });

    it('should show header border when title or subtitle is present', () => {
      const { container } = render(
        <Card title="Title">
          <p>Content</p>
        </Card>
      );
      const header = container.querySelector('.border-b');
      expect(header).toBeInTheDocument();
    });

    it('should not show header border when no title or subtitle', () => {
      const { container } = render(
        <Card>
          <p>Content</p>
        </Card>
      );
      const header = container.querySelector('.border-b');
      expect(header).not.toBeInTheDocument();
    });

    it('should show footer border when footer is present', () => {
      const { container } = render(
        <Card footer={<div>Footer</div>}>
          <p>Content</p>
        </Card>
      );
      const footer = container.querySelector('.border-t');
      expect(footer).toBeInTheDocument();
    });
  });

  describe('Layout', () => {
    it('should render title and subtitle in header section', () => {
      const { container } = render(
        <Card title="Card Title" subtitle="Card Subtitle">
          <p>Content</p>
        </Card>
      );
      const header = container.querySelector('.mb-4.pb-4');
      expect(header).toBeInTheDocument();
      expect(header).toContainElement(screen.getByText('Card Title'));
      expect(header).toContainElement(screen.getByText('Card Subtitle'));
    });

    it('should render children in content section with proper spacing', () => {
      const { container } = render(
        <Card>
          <div data-testid="content">Content</div>
        </Card>
      );
      const content = container.querySelector('.space-y-4');
      expect(content).toBeInTheDocument();
      expect(content).toContainElement(screen.getByTestId('content'));
    });

    it('should render footer in footer section with proper spacing', () => {
      const { container } = render(
        <Card footer={<div data-testid="footer">Footer</div>}>
          <p>Content</p>
        </Card>
      );
      const footer = container.querySelector('.mt-6.pt-4');
      expect(footer).toBeInTheDocument();
      expect(footer).toContainElement(screen.getByTestId('footer'));
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(
        <Card title="Card Title">
          <p>Content</p>
        </Card>
      );
      const heading = screen.getByText('Card Title');
      expect(heading.tagName).toBe('H3');
    });
  });
});
