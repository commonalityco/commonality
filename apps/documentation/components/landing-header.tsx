import { Button } from '@commonalityco/ui-design-system';
import Link from 'next/link';
import React from 'react';
import Balancer from 'react-wrap-balancer';

export function LandingHeader() {
  return (
    <div className="mt-6 px-20 py-24 rounded-2xl bg-secondary container">
      <div className="max-w-[500px]">
        <h1 className="text-7xl font-semibold text-primary mb-6 leading-none">
          Build bigger
        </h1>
        <p className="text-muted-foreground text-lg mb-3">
          <Balancer>
            Commonality helps you scale JavaScript monorepos and ecosystems with
            the tools you already love.
          </Balancer>
        </p>
        <p className="text-muted-foreground text-lg mb-6">
          <Balancer>No wrappers. No lock-in. Open-source.</Balancer>
        </p>

        <Button size="lg" asChild>
          <Link href="/docs/overview">Get started</Link>
        </Button>
      </div>
    </div>
  );
}
