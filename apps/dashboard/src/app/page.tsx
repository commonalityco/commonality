import { getPackagesData } from 'data/packages';
import { getTagsData } from 'data/tags';
import { getProject } from 'data/project';
import { FeatureGraphLayout } from '@commonalityco/feature-graph';
import DashboardGraph from './DashboardGraph';
import { DashboardSidebar } from './DashboardSidebar';
import { getTeamsData } from 'data/teams';
import { getViolationsData } from 'data/violations';

async function GraphPage() {
  const packages = await getPackagesData();
  const tags = await getTagsData();
  const teams = await getTeamsData();
  const project = await getProject();
  const violations = await getViolationsData();

  return (
    <FeatureGraphLayout>
      <DashboardSidebar packages={packages} tags={tags} teams={teams} />
      <DashboardGraph
        violations={violations}
        allTags={tags}
        packages={packages}
        packageManager={project.packageManager}
      />
    </FeatureGraphLayout>
  );
}

export default GraphPage;
