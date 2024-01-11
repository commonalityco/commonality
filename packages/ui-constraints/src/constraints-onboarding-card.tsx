import {
  Button,
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@commonalityco/ui-design-system';
import { ExternalLink, Network } from 'lucide-react';

export function ConstraintsOnboardingCard({
  title = 'Organize your dependency graph',
}: {
  title?: string;
}) {
  return (
    <Card variant="secondary">
      <CardHeader>
        <div className="bg-background mb-3 flex h-10 w-10 items-center justify-center rounded-full border">
          <div className="bg-secondary rounded-full p-1.5">
            <Network className="h-5 w-5" />
          </div>
        </div>

        <CardTitle>{title}</CardTitle>
        <CardDescription>
          Prevent endless dependency debugging by limiting the which packages
          can depend on each other.
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
