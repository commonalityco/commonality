import { Section } from '@commonalityco/ui-section';
import { Logo } from 'images/logo';
import { getProject } from 'data/project';
import { Heading } from '@commonalityco/ui-heading';
import { NavigationButton } from 'app/NavigationButtons';
import Link from 'next/link';

async function Navigation() {
  const project = await getProject();

  return (
    <Section className="relative z-10 flex h-14 shrink-0 items-center justify-between">
      <div className="flex flex-nowrap items-center gap-4">
        <Link href="/graph">
          <Logo width={28} height={28} />
        </Link>
        <Heading size="md">{project.name}</Heading>
      </div>
      <div className="relative">
        <div className="relative z-20 flex flex-nowrap items-center gap-2 justify-self-center">
          <NavigationButton href="/graph">Graph</NavigationButton>
          <NavigationButton href="/learn">Documentation</NavigationButton>
        </div>
      </div>
      <div className="" />
    </Section>
  );
}

export default Navigation;
