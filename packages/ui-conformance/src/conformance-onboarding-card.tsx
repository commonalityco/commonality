import {
  Button,
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@commonalityco/ui-design-system';
import { ExternalLink, PackageCheck } from 'lucide-react';

export function ConformanceOnboardingCard() {
  return (
    <Card variant="secondary">
      <CardHeader>
        <div className="bg-background mb-3 flex h-10 w-10 items-center justify-center rounded-full border">
          <div className="bg-secondary rounded-full p-1.5">
            <PackageCheck className="h-5 w-5" />
          </div>
        </div>

        <CardTitle>Codify your best practices</CardTitle>
        <CardDescription>
          Scale a consistently amazing developer experience with dynamic
          conformance checks that are run like tests and shared like lint rules.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button asChild variant="outline" size="sm">
          <a
            href="https://commonality.co/docs/checks"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more
            <ExternalLink className="ml-1 h-3 w-3 -translate-y-px" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
