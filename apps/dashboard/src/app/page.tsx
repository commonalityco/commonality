import { getPackagesData } from 'data/packages';
import { getTagsData } from 'data/tags';
import { getProject } from 'data/project';
import { FeatureGraphLayout } from '@commonalityco/feature-graph';
import DashboardGraph from './DashboardGraph';
import { DashboardSidebar } from './DashboardSidebar';
import { getCodeownersData } from 'data/codeowners';
import { getViolationsData } from 'data/violations';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { getProjectConfigData } from 'data/structure';
import { getDocumentsData } from 'data/documents';

async function GraphPage() {
  const packages = await getPackagesData();
  const codeownersData = await getCodeownersData();
  const project = await getProject();
  const violations = await getViolationsData();
  const projectConfig = await getProjectConfigData();
  const documentsData = await getDocumentsData();
  const codeowners = await getCodeownersData();

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(['packages'], getPackagesData);
  await queryClient.prefetchQuery(['tags'], getTagsData);
  await queryClient.prefetchQuery(['violations'], getViolationsData);

  return (
    <FeatureGraphLayout dehydratedState={dehydrate(queryClient)}>
      <DashboardSidebar
        packages={packages}
        codeownersData={codeownersData}
        stripScopeFromPackageNames={projectConfig?.stripScopeFromPackageNames}
        getTags={getTagsData}
      />
      <DashboardGraph
        codeownersData={codeowners}
        documentsData={documentsData}
        projectConfig={projectConfig}
        violations={violations}
        packages={packages}
        packageManager={project.packageManager}
        getTags={getTagsData}
        getViolations={getViolationsData}
      />
    </FeatureGraphLayout>
  );
}

export default GraphPage;
