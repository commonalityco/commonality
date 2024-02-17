import { getDependenciesData } from '@/data/dependencies';
import { getPackagesData } from '@/data/packages';
import StudioChart from './studio-chart';
import { getProjectData } from '@/data/project';
import { getConstraintsData } from '@/data/constraints';
import { getTagsData } from '@/data/tags';

async function ChartPage() {
  const [packages, dependencies, results, project, tagsData] =
    await Promise.all([
      getPackagesData(),
      getDependenciesData(),
      getConstraintsData(),
      getProjectData(),
      getTagsData(),
    ]);

  return (
    <StudioChart
      tagsData={tagsData}
      dependencies={dependencies}
      results={results}
      packages={packages}
      constraints={project.config?.config.constraints ?? {}}
    />
  );
}

export default ChartPage;
