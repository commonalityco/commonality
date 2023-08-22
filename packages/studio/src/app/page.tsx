import { getPackagesData } from 'data/packages';
import { getTagsData } from 'data/tags';
import { getProject } from 'data/project';
import { FeatureGraphLayout } from '@commonalityco/feature-graph';
import StudioGraph from './studio-graph';
import { StudioSidebar } from './studio-sidebar';
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
import { getDependenciesData } from 'data/dependencies';
import { getConstraintsData } from 'data/constraints';
import { StudioGraphProvider } from './studio-graph-provider';
import dynamic from 'next/dynamic';

const StudioGraphOverlays = dynamic(
  () => import('./studio-graph-overlays'),
  {},
);

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
        getConstraints={getConstraintsData}
        getViolations={getViolationsData}
        getCodeownersData={getCodeownersData}
        getTagsData={getTagsData}
        getDocumentsData={getDocumentsData}
      />
    </StudioGraphProvider>
  );
}

export default GraphPage;
