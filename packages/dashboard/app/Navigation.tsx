import { Section } from '@commonalityco/ui-section';
import { Logo } from '@/images/logo';
import ThemeButton from './ThemeButton';
import { getProject } from '@/data/project';
import { Heading } from '@commonalityco/ui-heading';

async function Navigation() {
  const project = await getProject();

  return (
    <Section className="p-3 h-14 border-b border-zinc-300 dark:border-zinc-600 flex items-center justify-between relative z-10">
      <div className="flex flex-nowrap items-center gap-4">
        <Logo width={28} height={28} />
        <Heading size="md">{project.name}</Heading>
      </div>
      <ThemeButton />
    </Section>
  );
}

export default Navigation;
