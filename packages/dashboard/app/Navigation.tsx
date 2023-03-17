import { Section } from '@commonalityco/ui-section';
import { Logo } from 'images/logo';
import { getProject } from 'data/project';
import { Heading } from '@commonalityco/ui-heading';
import { NavigationButton, NavigationButtons } from 'app/NavigationButtons';

async function Navigation() {
  const project = await getProject();

  return (
    <Section className="relative z-10 flex h-14 items-center justify-between border-b border-zinc-300 p-3 dark:border-zinc-600">
      <div className="flex flex-nowrap items-center gap-4">
        <Logo width={28} height={28} />
        <Heading size="md">{project.name}</Heading>
      </div>
      <NavigationButtons>
        <NavigationButton href="/graph">Graph</NavigationButton>
        <NavigationButton href="/learn">Collaborate</NavigationButton>
      </NavigationButtons>
    </Section>
  );
}

export default Navigation;
