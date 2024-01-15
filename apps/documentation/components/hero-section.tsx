import React from 'react';
import Link from 'next/link';
import { Button } from '@commonalityco/ui-design-system';
import { Grid } from './images/grid';
import { Cube } from './images/cube';
import Balancer from 'react-wrap-balancer';
import HeroFooter from './images/hero-footer';
import { CopySnippet } from './copy-snippet';

export function HeroSection() {
  return (
    <div className="px-6 relative pt-2 bg-zinc-100 dark:bg-zinc-900">
      <div className="absolute top-0 right-0 bottom-0 left-0 pointer-events-none z-[1] overflow-hidden">
        <div className="absolute top-0 right-0 bottom-0 left-0 noise z-40" />
        <div className="absolute h-[1300px] -bottom-[500px] left-1/2 -translate-x-1/2 w-[800px] md:w-[1300px] z-[35] glow" />
        <div className="absolute top-0 right-0 bottom-0 left-0 bg-gradient-to-b from-interactive z-30 from-15%" />
        <Grid className="object-cover object-center h-full rounded-2xl z-20 relative" />

        <div className="absolute top-0 right-0 bottom-0 left-0 bg-gradient-to-t from-background z-10" />
      </div>
      <div className="flex flex-col items-center justify-center pt-8 md:pt-16 gap-6 md:items-stretch relative z-[3]">
        <div className="max-w-[800px] relative z-10 flex text-center items-center justify-center md:justify-start self-center md:self-auto mx-auto mb-6 overflow-hidden">
          <div>
            <h1 className="text-7xl md:text-9xl font-bold text-primary mb-6 leading-none">
              Build bigger
            </h1>
            <p className="text-primary/70 text-base md:text-lg mb-3 font-medium">
              <Balancer>
                Commonality helps you structure growing JavaScript monorepos and
                package ecosystems with the tools you already love.
              </Balancer>
            </p>
            <p className="text-muted-foreground text-base md:text-lg mb-10 font-medium">
              <Balancer>No wrappers. No lock-in. Open-source.</Balancer>
            </p>
            <div className="flex md:flex-nowrap gap-2 mx-auto justify-center">
              <CopySnippet
                className="backdrop-blur-sm bg-background/50 border-muted-foreground/50 hidden md:flex"
                buttonClassName="hover:bg-muted-foreground/20"
              >
                npx commonality init
              </CopySnippet>
              <Button
                size="xl"
                asChild
                className="w-full max-w-[300px] md:w-auto"
              >
                <Link href="/docs/getting-started">Get started</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-center grow h-full pointer-events-none relative">
          <Cube className="z-10 relative max-w-[250px] md:max-w-[400px] min-w-[325px] w-full -mb-16" />
        </div>
      </div>
      <HeroFooter className="w-full pointer-events-none absolute left-0 right-0 -bottom-2 pt-1/3 z-[2]" />
    </div>
  );
}
