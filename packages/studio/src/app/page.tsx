import { getPackagesData } from 'data/packages';
import { getTagsData } from 'data/tags';
import { getProject } from 'data/project';
import { FeatureGraphLayout } from '@commonalityco/feature-graph';
import { getCodeownersData } from 'data/codeowners';
import { getDocumentsData } from 'data/documents';
import { getDependenciesData } from 'data/dependencies';
import { getConstraintsData } from 'data/constraints';
import { getViolationsData } from 'data/violations';
import StudioSidebar from './studio-sidebar';
import StudioGraphProvider from './studio-graph-provider';
import StudioGraphOverlays from './studio-graph-overlays';
import { StudioGraph } from './studio-graph';

async function GraphPage() {
  const project = await getProject();

  return (
    <div className="bg-secondary h-full">
      <StudioGraphProvider>
        <FeatureGraphLayout>
          <StudioSidebar />
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
        />
      </StudioGraphProvider>
    </div>
  );
}

export default GraphPage;
