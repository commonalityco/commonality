import { configStore } from './config-store';
import { isCI } from 'std-env';

const CONFIG_KEY = 'telemetry-enabled';
const ENABLED_VALUE = 'enabled' as const;
const DISABLED_VALUE = 'disabled' as const;

type Status = 'enabled' | 'disabled' | 'unset';

export const telemetryStatus = {
  get: (): Status => {
    if (process.env.DO_NOT_TRACK || isCI) {
      return 'disabled';
    }

    const value = configStore.get(CONFIG_KEY);

    if (value === undefined) {
      return 'unset';
    }

    if (value === ENABLED_VALUE) {
      return ENABLED_VALUE;
    }

    return DISABLED_VALUE;
  },

  set: (status: 'enabled' | 'disabled'): void =>
    configStore.set(CONFIG_KEY, status),
};
