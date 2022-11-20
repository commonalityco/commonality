import { loginAction } from '../commands/login';
import { config } from './config';

export const ensureAuth = async () => {
  const accessToken = config.get('accessToken');
  const expires = config.get('expires');
  const hasExpiredToken = new Date(expires) < new Date();
  const hasNoAccessToken = !accessToken;

  if (hasExpiredToken || hasNoAccessToken) {
    await loginAction();
  }

  return true;
};
