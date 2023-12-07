import { getDependencies, getPackages } from '@commonalityco/data-packages';
import { getProjectConfig } from '@commonalityco/data-project';
import { getTagsData } from '@commonalityco/data-tags';
import { getConstraintResults } from '@commonalityco/data-violations';

export const getConstraintsData = async () => {
  const projectConfig = await getProjectConfig({
    rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
  });
  const packages = await getPackages({
    rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
  });
  const dependencies = await getDependencies({
    rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
  });
  const tagsData = await getTagsData({
    rootDirectory: process.env.COMMONALITY_ROOT_DIRECTORY,
    packages,
  });

  return getConstraintResults({
    tagsData,
    dependencies,
    constraints: projectConfig?.config.constraints,
  });
};
