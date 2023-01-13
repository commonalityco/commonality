/* eslint-disable @typescript-eslint/naming-convention */
import process from 'node:process';
import { Command } from 'commander';
import open from 'open';
import chalk from 'chalk';
import ora from 'ora';
import got from 'got';
import { config } from '../core/config.js';

type DeviceCodeResponse = {
	device_code: string;
	user_code: string;
	verification_uri: string;
	verification_uri_complete: string;
	expires_in: number;
	interval: number;
};

const program = new Command();
const clientId = 'ZftTZnwNfBjnaf1Zj97z7IPmhy0LjuSu';
const authOrigin = 'https://commonality-production.us.auth0.com';

export const loginAction = async (
	_options: Record<string, unknown>,
	action: Command
) => {
	try {
		const data = await got
			.post(
				`${
					process.env['COMMONALITY_AUTH_ORIGIN'] ?? authOrigin
				}/oauth/device/code`,
				{
					headers: { 'content-type': 'application/x-www-form-urlencoded' },
					form: {
						client_id: clientId,
						scope: 'openid profile email',
					},
				}
			)
			.json<DeviceCodeResponse>();

		await open(data.verification_uri_complete);

		console.log(
			chalk.bold('Verification code: '),
			chalk.blueBright(data.user_code)
		);

		const verificationSpinner = ora('Waiting for verification...').start();

		const requestTokenResponse = await got
			.post(
				`${process.env['COMMONALITY_AUTH_ORIGIN'] ?? authOrigin}/oauth/token`,
				{
					form: {
						grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
						device_code: data.device_code,
						client_id: clientId,
					},
					retry: {
						limit: 30,
						noise: 0,
						calculateDelay: () => data.interval * 1000,
						backoffLimit: data.interval * 1000,
					},
				}
			)
			.json<{
				access_token: string;
				expires_in: number;
				token_type: string;
			}>();

		const expires = new Date();
		expires.setSeconds(expires.getSeconds() + requestTokenResponse.expires_in);

		config.set('accessToken', requestTokenResponse.access_token);
		config.set('expires', expires.toString());
		config.set('tokenType', requestTokenResponse.token_type);

		verificationSpinner.succeed('Successfully logged in');
	} catch (error: unknown) {
		console.log(error);
		action.error('Failed to login');
	}
};

export const login = program
	.name('login')
	.description('Authenticate with the Commonality API')
	.action(loginAction);
