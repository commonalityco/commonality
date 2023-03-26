import { Command } from 'commander';
import { start } from '@commonalityco/dashboard';
import getPort from 'get-port';
import openUrl, { apps } from 'open';

const program = new Command();

export const open = program
  .name('open')
  .description('Open the Commonality Dashboard')
  .action(async () => {
    const port = await getPort({ port: 8888 });
    console.log('starting');
    start(port);
    console.log('opening ');

    await openUrl(`http://localhost:${port}`);
  });
