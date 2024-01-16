import { installPackage } from '@antfu/install-pkg';
import { getAdditionalInstallArgs } from '../utilities/get-additional-install-args';

export const installChecks = async ({
  rootDirectory,
  verbose,
}: {
  rootDirectory: string;
  verbose?: boolean;
}): Promise<void> => {
  await installPackage('commonality-checks-recommended@latest', {
    cwd: rootDirectory,
    silent: verbose === undefined ? true : !verbose,
    additionalArgs: await getAdditionalInstallArgs({ rootDirectory }),
  });
};
