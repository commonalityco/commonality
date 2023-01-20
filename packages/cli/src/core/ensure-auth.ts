import type { Command } from 'commander';
import { loginAction } from '../commands/login';
import { store } from './store';

export const ensureAuth = async (action: Command): Promise<boolean> => {
  const accessToken = store.get('auth:accessToken') as string;
  const expires = store.get('auth:expires') as string;
  const hasExpiredToken = new Date(expires) < new Date();
  const hasNoAccessToken = !accessToken;

  if (hasExpiredToken || hasNoAccessToken) {
    await loginAction({}, action);
  }

  return true;
};
