import { Command } from 'commander';
import fetch from 'node-fetch';
import open from 'open';
import chalk from 'chalk';
import ora from 'ora';
import retry from 'async-retry';
import { config } from '../core/config';

const program = new Command();
const client_id = 'UvPsnzlLPsQnaO2QQ5On9k9Jb9cSIM1F';

export const loginAction = async () => {
  const res = await fetch(
    'https://commonality-development.us.auth0.com/oauth/device/code',
    {
      method: 'POST',
      body: new URLSearchParams({
        client_id: 'UvPsnzlLPsQnaO2QQ5On9k9Jb9cSIM1F',
        scope: 'openid profile email',
      }),
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    }
  );

  const data = (await res.json()) as {
    device_code: string;
    user_code: string;
    verification_uri: string;
    verification_uri_complete: string;
    expires_in: number;
    interval: number;
  };

  open(data.verification_uri_complete);

  console.log(
    chalk.bold('Verification code: '),
    chalk.blueBright(data.user_code)
  );
  console.log();
  console.log(chalk.dim(data.verification_uri_complete));
  const verificationSpinner = ora('Waiting for verification...').start();

  const final = await retry<{
    access_token: string;
    expires_in: number;
    token_type: string;
  }>(
    async () => {
      const requestTokenResponse = await fetch(
        'https://commonality-development.us.auth0.com/oauth/token',
        {
          method: 'POST',
          body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
            device_code: data.device_code,
            client_id,
          }),
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
        }
      );

      if (!requestTokenResponse.ok) {
        throw new Error('authorization_pending');
      }

      return (await requestTokenResponse.json()) as {
        access_token: string;
        expires_in: number;
        token_type: string;
      };
    },
    {
      factor: 1,
      minTimeout: data.interval,
      maxTimeout: data.interval,
      retries: 100,
    }
  );

  var expires = new Date();
  expires.setSeconds(expires.getSeconds() + final.expires_in);

  config.set('accessToken', final.access_token);
  config.set('expires', expires.toString());
  config.set('tokenType', final.token_type);

  verificationSpinner.stopAndPersist({
    symbol: chalk.green('✔'),
    text: chalk.green('Successfully logged in'),
  });
};

export const login = program
  .name('login')
  .description('Authenticate with the Commonality API')
  .action(loginAction);
