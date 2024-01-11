'use client';
import React from 'react';
import { useState } from 'react';
import { Package } from '@commonalityco/types';
import {
  Button,
  Input,
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from '@commonalityco/ui-design-system';

function PackagesFilterSection({ packages }: { packages: Package[] }) {
  const [search, setSearch] = useState('');

  const filteredPackages = search
    ? packages.filter((package_) => package_.name.includes(search))
    : packages;

  return (
    <Accordion type="single">
      <AccordionItem value="packages">
        <AccordionTrigger>Packages</AccordionTrigger>
        <AccordionContent>
          <Input
            className="mb-3"
            placeholder="Search for a package"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          {filteredPackages.map((package_) => {
            return (
              <Button
                key={package_.name}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {}}
              >
                {package_.name}
              </Button>
            );
          })}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default PackagesFilterSection;
