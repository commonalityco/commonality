'use client';
import { useState } from 'react';
import { Package } from '@commonalityco/types';
import { Button } from '@commonalityco/ui-button';
import { TextInput } from '@commonalityco/ui-text-input';
import * as Accordion from '@commonalityco/ui-accordion';

function PackagesFilterSection({ packages }: { packages: Package[] }) {
  const [search, setSearch] = useState('');

  const filteredPackages = search
    ? packages.filter((pkg) => pkg.name.includes(search))
    : packages;

  return (
    <Accordion.Item value="packages">
      <Accordion.Trigger>Packages</Accordion.Trigger>
      <Accordion.Content>
        <TextInput
          className="mb-3"
          search
          placeholder="Search for a package"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        {filteredPackages.map((pkg) => {
          return (
            <Button
              key={pkg.name}
              use="ghost"
              className="w-full justify-start"
              onClick={() => {}}
            >
              {pkg.name}
            </Button>
          );
        })}
      </Accordion.Content>
    </Accordion.Item>
  );
}

export default PackagesFilterSection;
