import React from 'react';
import Link from 'next/link';
import { Button } from '@commonalityco/ui-design-system';
import { Grid } from './images/grid';
import { Cube } from './images/cube';
import Balancer from 'react-wrap-balancer';

export function HeroSection() {
  return (
    <div className="px-6 relative noise pt-6 pb-20 md:pb-32">
      <div className="py-8 md:py-16 px-6 md:px-20 rounded-2xl bg-interactive border container relative overflow-hidden">
        <div className="absolute top-0 right-0 bottom-0 left-0">
          <div className="absolute top-0 right-0 bottom-0 left-0 bg-gradient-to-t md:bg-gradient-to-r from-interactive" />
          <Grid className="object-cover w-full h-full rounded-2xl" />
        </div>
        <div className="flex flex-col-reverse md:flex-row gap-6 md:items-stretch">
          <div className="max-w-[550px] relative z-10 flex text-center md:text-left items-center justify-center md:justify-start self-center md:self-auto">
            <div>
              <h1 className="font-serif text-5xl md:text-8xl font-semibold text-primary mb-6 leading-none">
                Build bigger
              </h1>
              <p className="text-muted-foreground text-base md:text-lg mb-3 font-medium">
                <Balancer>
                  Commonality helps you scale JavaScript monorepos and
                  ecosystems with the tools you already love.
                </Balancer>
              </p>
              <p className="text-muted-foreground text-base md:text-lg mb-6 font-medium">
                <Balancer>No wrappers. No lock-in. Open-source.</Balancer>
              </p>

              <Button size="lg" asChild className="w-full md:w-auto">
                <Link href="/docs/overview">Get started</Link>
              </Button>
            </div>
          </div>

          <div className="flex justify-center grow h-full">
            <Cube className="z-10 relative max-w-[300px] md:max-w-[400px] min-w-[200px] w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
