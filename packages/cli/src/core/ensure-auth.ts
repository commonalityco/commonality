import type { Command } from 'commander';
import { loginAction } from '../commands/login.js';
import { config } from './config.js';

export const ensureAuth = async (action: Command): Promise<boolean> => {
	const accessToken = config.get('auth:accessToken') as string;
	const expires = config.get('auth:expires') as string;
	const hasExpiredToken = new Date(expires) < new Date();
	const hasNoAccessToken = !accessToken;

	if (hasExpiredToken || hasNoAccessToken) {
		await loginAction({}, action);
	}

	return true;
};
