import { getPackagesData } from 'data/packages';
import { getTagsData } from 'data/tags';
import { getProject } from 'data/project';
import {
  FeatureGraphOverlays,
  FeatureGraphLayout,
  GraphProvider,
  FeatureGraphPackageTooltip,
  FeatureGraphDependencySheet,
  FeatureGraphPackageSheet,
} from '@commonalityco/feature-graph';
import StudioGraph from './StudioGraph';
import { StudioSidebar } from './StudioSidebar';
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
import { getCreateTagsButton } from './CreateTagsButton';

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
      <FeatureGraphOverlays>
        <FeatureGraphPackageSheet
          getTagsData={getTagsData}
          getDocumentsData={getDocumentsData}
          getCodeownersData={getCodeownersData}
          getCreateTagsButton={getCreateTagsButton}
        />
        <FeatureGraphDependencySheet
          getViolations={getViolationsData}
          getConstraints={getConstraintsData}
          getTagsData={getTagsData}
        />
        <FeatureGraphPackageTooltip />
      </FeatureGraphOverlays>
    </GraphProvider>
  );
}

export default GraphPage;
