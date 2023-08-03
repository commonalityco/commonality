import { getPackagesData } from 'data/packages';
import { getTagsData } from 'data/tags';
import { getProject } from 'data/project';
import {
  FeatureGraphOverlays,
  FeatureGraphLayout,
  GraphProvider,
} from '@commonalityco/feature-graph';
import DashboardGraph from './DashboardGraph';
import { DashboardSidebar } from './DashboardSidebar';
import { getCodeownersData } from 'data/codeowners';
import { getViolationsData } from 'data/violations';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { getDocumentsData } from 'data/documents';
import {
  codeownersKeys,
  constraintsKeys,
  dependenciesKeys,
  documentsKeys,
  packagesKeys,
  tagsKeys,
  violationsKeys,
} from '@commonalityco/utils-graph';
import { setTagsAction } from 'actions/metadata';
import { getDependenciesData } from 'data/dependencies';
import { getConstraintsData } from 'data/constraints';

async function GraphPage() {
  const project = await getProject();

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(packagesKeys, getPackagesData);
  await queryClient.prefetchQuery(dependenciesKeys, getDependenciesData);
  await queryClient.prefetchQuery(tagsKeys, getTagsData);
  await queryClient.prefetchQuery(codeownersKeys, getCodeownersData);

  await queryClient.prefetchQuery(violationsKeys, getViolationsData);
  await queryClient.prefetchQuery(documentsKeys, getDocumentsData);
  await queryClient.prefetchQuery(constraintsKeys, getConstraintsData);

  return (
    <GraphProvider dehydratedState={dehydrate(queryClient)}>
      <FeatureGraphLayout>
        <DashboardSidebar
          getCodeownersData={getCodeownersData}
          getTags={getTagsData}
          getPackages={getPackagesData}
        />
        <DashboardGraph
          getDependencies={getDependenciesData}
          packageManager={project.packageManager}
          getViolations={getViolationsData}
          getPackages={getPackagesData}
          getConstraints={getConstraintsData}
        />
      </FeatureGraphLayout>
      <FeatureGraphOverlays
        getConstraints={getConstraintsData}
        getViolations={getViolationsData}
        getDocumentsData={getDocumentsData}
        getCodeownersData={getCodeownersData}
        getTagsData={getTagsData}
        onSetTags={setTagsAction}
      />
    </GraphProvider>
  );
}

export default GraphPage;
