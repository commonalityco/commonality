import { getPackagesData } from 'data/packages';
import { getTagsData } from 'data/tags';
import { getProject } from 'data/project';
import { FeatureGraphLayout } from '@commonalityco/feature-graph';
import { getCodeownersData } from 'data/codeowners';
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
} from '@commonalityco/utils-graph/query-keys';
import { getDependenciesData } from 'data/dependencies';
import { getConstraintsData } from 'data/constraints';
import { getViolationsData } from 'data/violations';
import StudioSidebar from './studio-sidebar';
import StudioGraphProvider from './studio-graph-provider';
import StudioGraphOverlays from './studio-graph-overlays';
import { getCreateTagsButton } from './getCreateTagsButton';
import { StudioGraph } from './studio-graph';

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
    <StudioGraphProvider dehydratedState={dehydrate(queryClient)}>
      <FeatureGraphLayout>
        <StudioSidebar
          getCodeownersData={getCodeownersData}
          getTags={getTagsData}
          getPackages={getPackagesData}
        />
        <StudioGraph
          getDependencies={getDependenciesData}
          packageManager={project.packageManager}
          getViolations={getViolationsData}
          getPackages={getPackagesData}
          getConstraints={getConstraintsData}
        />
      </FeatureGraphLayout>
      <StudioGraphOverlays
        getCodeownersData={getCodeownersData}
        getConstraints={getConstraintsData}
        getDocumentsData={getDocumentsData}
        getTagsData={getTagsData}
        getViolations={getViolationsData}
        getCreateTagsButton={getCreateTagsButton}
      />
    </StudioGraphProvider>
  );
}

export default GraphPage;
