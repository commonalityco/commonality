import React from 'react';
import Link from 'next/link';
import { Button } from '@commonalityco/ui-design-system';
import Balancer from 'react-wrap-balancer';

export function CallToActionSection() {
  return (
    <div className="flex justify-center w-full pb-24 md:pb-48 flex-col items-center bg-interactive px-6">
      <h2 className="text-4xl md:text-5xl font-semibold text-primary mb-4 leading-none text-center">
        <Balancer>Get started in seconds</Balancer>
      </h2>
      <p className="text-muted-foreground text-base md:text-lg mb-6 text-center md:text-left font-medium">
        <Balancer>
          Commonality is designed to be incrementally adoptable with zero
          lock-in.
        </Balancer>
      </p>
      <Button size="xl" asChild>
        <Link href="/docs/getting-started">Get started</Link>
      </Button>
    </div>
  );
}
