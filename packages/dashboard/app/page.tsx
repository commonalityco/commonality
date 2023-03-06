import { getElements } from 'data/graph';
import GraphSidebar from './GraphSidebar';
import GraphNavigationButtons from './GraphNavigationButtons';
import { getPackagesData } from 'data/packages';
import { getTagsData } from 'data/tags';
import { getOwners } from '@commonalityco/codeowners';
import Graph from './Graph';

export default async function Home() {
  const graphLayout = await getElements();
  const packages = await getPackagesData();
  const tags = await getTagsData();
  const teams = await getOwners();
  console.log({ teams });
  return (
    <main style={{ height: 'calc(100% - 56px)' }} className="flex flex-nowrap">
      <GraphSidebar packages={packages} tags={tags} teams={teams} />
      <div className="relative shrink-0 grow bg-zinc-100 dark:bg-zinc-800">
        <GraphNavigationButtons />
        <Graph elements={graphLayout} />
      </div>
    </main>
  );
}
