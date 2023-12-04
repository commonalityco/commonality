import { getDependencies, getPackages } from '@commonalityco/data-packages';
import {
  getProjectConfig,
  getRootDirectory,
} from '@commonalityco/data-project';
import { getTagsData } from '@commonalityco/data-tags';
import { getConstraintResults } from '@commonalityco/data-violations';

export const getConstraintsData = async () => {
  const rootDirectory = await getRootDirectory();
  const projectConfig = await getProjectConfig({ rootDirectory });
  const packages = await getPackages({ rootDirectory });
  const dependencies = await getDependencies({ rootDirectory });
  const tagsData = await getTagsData({ rootDirectory, packages });

  return getConstraintResults({
    tagsData,
    dependencies,
    constraints: projectConfig?.config.constraints,
  });
};
