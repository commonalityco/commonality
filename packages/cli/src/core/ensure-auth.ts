import type { Command } from 'commander';
import { loginAction } from '../commands/login.js';
import { getStore } from './store.js';

export const ensureAuth = async (action: Command): Promise<boolean> => {
	const store = await getStore();

	const accessToken = store.get('auth:accessToken') as string;
	const expires = store.get('auth:expires') as string;
	const hasExpiredToken = new Date(expires) < new Date();
	const hasNoAccessToken = !accessToken;

	if (hasExpiredToken || hasNoAccessToken) {
		await loginAction({}, action);
	}

	return true;
};
