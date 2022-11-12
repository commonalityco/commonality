import { Command } from 'commander';
import fetch from 'node-fetch';
import prompts from 'prompts';
import open from 'open';
import chalk from 'chalk';
import configstore from 'configstore';
import { config } from '../core/config';
const program = new Command();

const CONNECT_URL = 'http://localhost:3000/cli/connect';

const DEVICE_URL = 'http://localhost:3000/api/cli/device';

const client_id = '2lBOfeQyL86Bv5vixQ6NG5O+dpFq/qnNjBG/bCBPEcs=';

export const login = program
  .name('login')
  .description('Authenticate with the Commonality API')
  .action(async () => {
    open(CONNECT_URL);

    console.log(chalk.bold('Open the the URL below in your browser:'));
    console.log(chalk.underline.blueBright(CONNECT_URL));
    console.log('\n');
    console.log('After logging in, paste the code verification code below.');

    const response = await prompts([
      {
        type: 'text',
        name: 'verificationToken',
        message: 'Verification code',
      },
    ]);

    const res = await fetch(
      'http://localhost:3000/api/cli/registration/verify',
      {
        method: 'POST',
        body: JSON.stringify({
          token: response.verificationToken,
          identifier: 'device',
        }),
        headers: { 'Content-Type': 'application/json' },
      }
    );

    config.set('token', response.verificationToken);

    console.log(`${chalk.cyan('Congratulations!')} `);
  });
