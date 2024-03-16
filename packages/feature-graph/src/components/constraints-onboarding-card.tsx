import {
  Button,
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@commonalityco/ui-design-system';
import { ExternalLink, ShieldCheck } from 'lucide-react';

export function ConstraintsOnboardingCard() {
  return (
    <Card variant="secondary" className="bg-muted/30">
      <CardHeader>
        <div className="bg-background mb-3 flex h-10 w-10 items-center justify-center rounded-full border">
          <div className="bg-secondary rounded-full p-1.5">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </div>

        <CardTitle>Structure your dependency graph</CardTitle>
        <CardDescription>
          Create boundaries in your codebase by limiting which packages can
          depend on one another.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button asChild size="sm">
          <a
            href="https://docs.commonality.co/constraints"
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
