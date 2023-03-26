import { getElements } from 'data/graph';
import GraphSidebar from './GraphSidebar';
import GraphNavigationButtons from './GraphNavigationButtons';
import { getPackagesData } from 'data/packages';
import { getTagsData } from 'data/tags';
import { getOwners } from '@commonalityco/codeowners';
import Graph from './Graph';
import { getProjectConfigData } from 'data/structure';

export const revalidate = 360000;

async function GraphPage() {
  const graphLayout = await getElements();
  const packages = await getPackagesData();
  const tags = await getTagsData();
  const teams = await getOwners();
  const projectConfig = await getProjectConfigData();

  const stripScopeFromPackageNames =
    projectConfig?.stripScopeFromPackageNames ?? true;

  return (
    <main
      style={{ height: 'calc(100% - 56px)' }}
      className="relative h-full w-full overflow-hidden"
    >
      <GraphSidebar
        packages={packages}
        tags={tags}
        teams={teams}
        stripScopeFromPackageNames={stripScopeFromPackageNames}
      />
      <div className="relative h-full w-full shrink-0 grow bg-zinc-100 dark:bg-zinc-800">
        <GraphNavigationButtons />
        <Graph
          elements={graphLayout}
          stripScopeFromPackageNames={stripScopeFromPackageNames}
        />
      </div>
    </main>
  );
}

export default GraphPage;
