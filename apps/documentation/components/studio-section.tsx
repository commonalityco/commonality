import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@commonalityco/ui-design-system';
import { Copy, Check } from 'lucide-react';
import Balancer from 'react-wrap-balancer';
import { CopySnippet } from './copy-snippet';

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    navigator.clipboard.writeText(value);

    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  return (
    <Button
      onClick={handleClick}
      variant="outline"
      size="icon"
      aria-label="Copy command"
      className="cursor-pointer z-10"
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
    </Button>
  );
}

const STUDIO_COMMAND = 'npx commonality studio';

export function StudioSection() {
  return (
    <div className="flex items-center flex-col bg-interactive pt-48">
      <div className="px-6">
        <div className="w-full mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 leading-none text-center">
            <Balancer>Visualize any codebase</Balancer>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg mb-12 text-center max-w-[600px] mx-auto font-medium">
            <Balancer>
              Explore your dependency graph, categorize packages with tags, view
              conformance health and more with Commonality Studio.
            </Balancer>
          </p>
          <div className="relative mx-auto block">
            <div className="border rounded-t-md shadow inset-shadow">
              <div className="bg-muted flex items-center rounded-t-md p-2 gap-1 border-b relative">
                <div className="h-2 w-2 rounded-full bg-success" />
                <div className="h-2 w-2 rounded-full bg-warning" />
                <div className="h-2 w-2 rounded-full bg-destructive" />
              </div>
              <div className="aspect-[15/10] max-w-[800px] w-full relative block">
                <Image
                  alt="A visualization of a dependency graph in Commonality Studio with a light theme"
                  src="/commonality-light.png"
                  width={1200}
                  height={800}
                  className="dark:hidden"
                />
                <Image
                  alt="A visualization of a dependency graph in Commonality Studio with a dark theme"
                  src="/commonality-dark.png"
                  width={1200}
                  height={800}
                  className="hidden dark:block"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative w-full flex items-end justify-center pt-12">
        <div className="max-w-[500px] z-10 w-full text-center">
          <p className="text-primary mb-4 font-medium">
            Explore any JavaScript project with a single command
          </p>
          <div className="inline-block px-6">
            <div className="relative">
              <CopySnippet>{STUDIO_COMMAND}</CopySnippet>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
