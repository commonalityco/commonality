import { loginAction } from '../commands/login.js';
import { config } from './config.js';

export const ensureAuth = async () => {
	const accessToken = config.get('accessToken') as string;
	const expires = config.get('expires') as string;
	const hasExpiredToken = new Date(expires) < new Date();
	const hasNoAccessToken = !accessToken;

	if (hasExpiredToken || hasNoAccessToken) {
		await loginAction();
	}

	return true;
};
