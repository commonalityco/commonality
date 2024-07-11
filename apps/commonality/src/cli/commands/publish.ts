import { getRootDirectory } from '@commonalityco/data-project';
import { getCodeownersData } from './../../../../../packages/data-codeowners/src/get-codeowners-data';
import { Command } from 'commander';
import { z } from 'zod';
import { getDependencies, getPackages } from '@commonalityco/data-packages';
import ky, { HTTPError } from 'ky';
import * as prompts from '@clack/prompts';

const command = new Command();

export const createSnapshotSchema = z.object({
  publishKey: z.string(),
  projectId: z.string(),
  codeowners: z.array(
    z.object({
      packageName: z.string(),
      codeowners: z.array(z.string()),
    }),
  ),
  blocks: z.array(
    z.object({
      name: z.string(),
      description: z.string().optional(),
      path: z.string(),
      version: z.string(),
      type: z.enum(['REACT', 'NODE', 'NEXT']),
      churn: z.number(),
      complexity: z.number(),
    }),
  ),
  dependencies: z.array(
    z.object({
      source: z.string(),
      target: z.string(),
      type: z.enum(['PRODUCTION', 'DEVELOPMENT', 'PEER']),
    }),
  ),
});

const publishSpinner = prompts.spinner();

export const publish = command
  .name('publish')
  .description('Publish a snapshot of your project to Commonality')
  .option('--verbose', 'Show additional logging output')
  .option(
    '--api <apiUrl>',
    'The API URL to publish to',
    process.env.COMMONALITY_API_URL ?? 'http://app.commonality.co/api/publish',
  )
  .requiredOption('--project <projectId>', 'The project ID to publish to')
  .requiredOption('--key <publishKey>', 'The publish key to publish with')
  .action(async (options) => {
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
    };

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
        const errorJson = (await error.response.json()) as { message: string };
        publishSpinner.stop('Failed to publish snapshot');
        prompts.log.error(errorJson.message);
      } else {
        publishSpinner.stop('Failed to publish snapshot');
      }
    }
  });
