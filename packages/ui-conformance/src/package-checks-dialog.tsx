'use client';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
  ScrollArea,
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from '@commonalityco/ui-design-system';
import { ComponentProps } from 'react';
import { Package } from '@commonalityco/types';
import { CheckContent, CheckTitle } from './conformance-results-list';
import { ConformanceResult } from '@commonalityco/utils-conformance';
import { getIconForPackage } from '@commonalityco/ui-core';
import { GradientFade } from '@commonalityco/ui-core';
import { ConformanceOnboardingCard } from './conformance-onboarding-card';

export function PackageChecksDialog({
  pkg,
  results,
  children,
  ...props
}: {
  pkg: Package;
  results: ConformanceResult[];
} & ComponentProps<typeof Dialog>) {
  const PackageIcon = getIconForPackage(pkg.type);

  return (
    <Dialog {...props}>
      {children}
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="items-center gap-2 overflow-hidden grid grid-flow-col auto-cols-auto justify-start">
            <PackageIcon className="min-w-0 shrink-0" />
            <span className="min-w-0 leading-6 break-words">{pkg.name}</span>
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex flex-col max-h-[450px]">
          {results.length > 0 ? (
            <GradientFade
              placement="top"
              className="absolute top-0 left-0 right-0"
            />
          ) : undefined}
          <div className="grid flex-col">
            {results.length > 0 ? (
              results.map((result, index) => {
                return (
                  <Accordion
                    key={index}
                    type="multiple"
                    className="w-full overflow-hidden"
                  >
                    <AccordionItem value={`${result.id}-${index}`}>
                      <AccordionTrigger>
                        <CheckTitle result={result} />
                      </AccordionTrigger>
                      <AccordionContent>
                        <CheckContent result={result} />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                );
              })
            ) : (
              <ConformanceOnboardingCard />
            )}
          </div>
          {results.length > 0 ? (
            <GradientFade
              placement="bottom"
              className="absolute bottom-0 left-0 right-0"
            />
          ) : undefined}
        </ScrollArea>
        <DialogFooter>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => props.onOpenChange?.(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
