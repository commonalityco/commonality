/* eslint-disable unicorn/no-process-exit */
import { getRootDirectory } from '@commonalityco/data-project';
import { getCodeownersData } from '@commonalityco/data-codeowners';
import { Command } from 'commander';
import {
  createSnapshotSchema,
  CreateSnapshotSchema as CreateSnapshotSchemaType,
} from '@commonalityco/utils-core';
import { getDependencies, getPackages } from '@commonalityco/data-packages';
import ky, { HTTPError } from 'ky';
import * as prompts from '@clack/prompts';

const command = new Command();

const publishSpinner = prompts.spinner();

export const publish = command
  .name('publish')
  .description('Publish a snapshot of your project to Commonality')
  .option('--verbose', 'Show additional logging output')
  .option(
    '--api <apiUrl>',
    'The API URL to publish to',
    process.env.COMMONALITY_API_URL ??
      'http://app.commonality.co/api/v1/publish',
  )
  .requiredOption(
    '--project <projectId>',
    'The project ID to publish to',
    process.env.COMMONALITY_PROJECT_ID,
  )
  .requiredOption(
    '--key <publishKey>',
    'The publish key to publish with',
    process.env.COMMONALITY_PUBLISH_KEY,
  )
  .action(async (options) => {
    try {
      publishSpinner.start('Publishing snapshot...');

      const { api, project, key } = options;

      const rootDirectory = await getRootDirectory();
      const blocks = await getPackages({ rootDirectory });

      const codeowners = await getCodeownersData({
        rootDirectory,
        packages: blocks,
      });
      const dependencies = await getDependencies({ rootDirectory });
      const data = {
        publishKey: key,
        projectId: project,
        codeowners,
        blocks,
        dependencies,
        gitBranch: '',
      } satisfies CreateSnapshotSchemaType;

      const result = createSnapshotSchema.safeParse(data);

      if (!result.success) {
        publishSpinner.stop('Failed to publish snapshot');
        prompts.log.error('Invalid snapshot data: ' + result.error);
        return;
      }

      try {
        const response = await ky
          .post(api, {
            json: result.data,
          })
          .json<{ message: string }>();

        publishSpinner.stop(response.message);
      } catch (error) {
        if (error instanceof HTTPError) {
          const errorJson = (await error.response.json()) as {
            message: string;
          };
          publishSpinner.stop('Failed to publish snapshot');
          prompts.log.error(errorJson.message);
        } else {
          publishSpinner.stop('Failed to publish snapshot');
        }

        process.exit(1);
      }
    } catch {
      publishSpinner.stop('Failed to publish snapshot');
      process.exit(1);
    }
  });
