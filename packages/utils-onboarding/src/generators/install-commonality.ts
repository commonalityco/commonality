import { installPackage } from '@antfu/install-pkg';
import { getAdditionalInstallArgs } from '../utilities/get-additional-install-args';

export const installCommonality = async ({
  rootDirectory,
}: {
  rootDirectory: string;
}): Promise<void> => {
  await installPackage('commonality@latest', {
    cwd: rootDirectory,
    silent: true,
    additionalArgs: await getAdditionalInstallArgs({ rootDirectory }),
  });
};
