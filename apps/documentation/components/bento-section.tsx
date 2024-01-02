import React from 'react';
import { PackageCheck } from 'lucide-react';
import { TurboLogo } from './turbo-logo';
import { Codeowners } from './images/codeowners';
import { Constraints } from './images/constraints';
import Image from 'next/image';
import Link from 'next/link';
import { Button, cn } from '@commonalityco/ui-design-system';
import { Logo } from '@commonalityco/ui-core';
import Balancer from 'react-wrap-balancer';

function CheckCard({
  title,
  icon,
  status = 'pass',
}: {
  title: string;
  icon?: React.ReactNode;
  status?: 'pass' | 'fail';
}) {
  return (
    <div className="rounded-md bg-interactive border py-3 px-5 flex items-center gap-4">
      <div className="shrink-0">
        {icon ?? (
          <PackageCheck className="w-6 h-6" aria-label="Generic check logo" />
        )}
      </div>
      <p className="font-mono font-medium grow text-xs">{title}</p>
      <p
        className={cn('font-mono text-success text-xs font-medium', {
          'text-success': status === 'pass',
          'text-destructive': status !== 'pass',
        })}
      >
        {status}
      </p>
    </div>
  );
}

export function BentoSection() {
  return (
    <div className="py-20 md:py-32 w-full bg-interactive relative px-6 z-10">
      <div className="mx-auto text-center mb-12">
        <h2 className="font-serif text-4xl md:text-5xl font-semibold text-primary mb-4 leading-none text-center">
          <Balancer>
            Discover <span className="italic">frustration-free</span> monorepos
          </Balancer>
        </h2>
        <p className="max-w-xl mx-auto text-muted-foreground text-base md:text-lg font-medium">
          <Balancer>
            Commonality helps you tame the chaos that comes with multi-package
            workspaces and growing package ecosystems.
          </Balancer>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-screen-xl mx-auto">
        <div className="noise border rounded-2xl p-6 md:p-9 col-span-1 md:col-span-2 grid md:grid-cols-2 shadow gap-6 md:gap-9 overflow-hidden relative">
          <div className="flex md:items-center order-2 md:order-1">
            <div>
              <p className="font-semibold mb-2 text-3xl text-primary font-serif">
                Checks
              </p>
              <p className="text-muted-foreground mb-6">
                Scale a consistently amazing developer experience with dynamic
                conformance checks that are run like tests and shared like lint
                rules.
              </p>
              <Button asChild className="w-full md:w-auto">
                <Link href="/docs/checks">Learn more</Link>
              </Button>
            </div>
          </div>
          <div className="relative min-h-[280px] order-1 md:order-2">
            <div className="md:absolute md:-right-12 md:top-0 bottom-0 md:bottom-0 my-auto grid gap-4">
              <CheckCard
                title={`The "build" script must have a matching pipeline`}
                icon={<TurboLogo />}
              />
              <CheckCard
                title={`ESLint configuration must extend "react"`}
                icon={
                  <Image
                    src="/eslint.svg"
                    height={24}
                    width={24}
                    alt="ESLint logo"
                  />
                }
                status="fail"
              />
              <CheckCard
                title={`Package must have a codeowner`}
                icon={<Logo height={24} width={24} />}
              />
              <CheckCard title="Package must to publish to private registry" />
            </div>
          </div>
        </div>

        <div className="border rounded-2xl col-span-1 shadow overflow-hidden grid noise">
          <div className="p-6 md:p-9 mb-4">
            <p className="font-semibold mb-2 text-3xl text-primary font-serif">
              Tags
            </p>
            <p className="text-muted-foreground">
              Categorize packages by domain or concern or anything you can think
              of.
            </p>
          </div>
          <Image
            src="/tags.svg"
            width={365}
            height={194}
            className="w-full self-end"
            alt="Various tags describing categories of packages"
          />
        </div>

        <div className="noise border rounded-2xl p-6 md:p-9 col-span-1 shadow flex flex-col">
          <p className="font-semibold mb-2 text-3xl text-primary font-serif">
            Codeowners
          </p>
          <p className="text-muted-foreground">
            View ownership for all your packages based on your CODEOWNERS file.
          </p>
          <div className="flex grow items-end pt-4">
            <Codeowners className="w-full self-end" />
          </div>
        </div>

        <div className="noise border rounded-2xl p-6 md:p-9 col-span-1 md:col-span-2 shadow grid overflow-hidden md:grid-cols-2 gap-6 md:gap-9">
          <div className="flex md:items-center order-2 md:order-1">
            <div>
              <p className="font-semibold mb-2 text-3xl text-primary font-serif">
                Constraints
              </p>
              <p className="text-muted-foreground mb-6">
                Maintain a dependency graph that's easy to reason about by
                limiting which packages can depend on each other.
              </p>
              <Button asChild className="w-full md:w-auto">
                <Link href="/docs/constraints">Learn more</Link>
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-center order-1 md:order-2">
            <Constraints className="w-full h-full self-end " />
          </div>
        </div>
      </div>
    </div>
  );
}
