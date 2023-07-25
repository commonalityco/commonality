import { render, screen } from '@testing-library/react';
import { ConstraintAccordionTrigger } from './constraint-accordion-trigger';
import { describe, test, expect } from 'vitest';
import { Constraint } from '@commonalityco/types';
import { Accordion, AccordionItem } from '@commonalityco/ui-design-system';

describe('<ConstraintAccordionTrigger />', () => {
  test('renders the given constraint.applyTo value', () => {
    const constraint = {
      applyTo: 'test-tag',
      allow: [],
      disallow: [],
    } satisfies Constraint;

    render(
      <Accordion type="multiple">
        <AccordionItem value="test-tag">
          <ConstraintAccordionTrigger constraint={constraint} variant="pass" />
        </AccordionItem>
      </Accordion>
    );

    expect(screen.getByText('#test-tag')).toBeInTheDocument();
  });

  test('displays "All packages" when constraint.applyTo is "*"', () => {
    const constraint = { applyTo: '*', allow: [], disallow: [] };

    render(
      <Accordion type="multiple">
        <AccordionItem value="test-tag">
          <ConstraintAccordionTrigger constraint={constraint} variant="pass" />
        </AccordionItem>
      </Accordion>
    );

    expect(screen.getByText('All packages')).toBeInTheDocument();
    expect(screen.queryByText('#*')).not.toBeInTheDocument();
  });
});
