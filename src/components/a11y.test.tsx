import axe from 'axe-core';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from './Button/Button';
import { Input } from './Input/Input';
import { Tabs } from './Tabs/Tabs';

describe('Component accessibility', () => {
  it('has no critical a11y violations for core interactive components', async () => {
    const { container } = render(
      <div>
        <Button>Submit</Button>
        <Input label="Email" helperText="Use your work email" />
        <Tabs
          tabs={[
            { id: 'one', label: 'One', content: <div>First panel</div> },
            { id: 'two', label: 'Two', content: <div>Second panel</div> },
          ]}
        />
      </div>,
    );

    const results = await axe.run(container, {
      resultTypes: ['violations'],
      rules: {
        'color-contrast': { enabled: false },
      },
    });

    expect(results.violations).toHaveLength(0);
  });
});
