import Conf from 'conf';
import prompts from 'prompts';
import { initializeTelemetry } from '@commonalityco/telemetry';
import packageJson from '../../../package.json';

const config = new Conf({ projectName: 'commonality' });

const CONFIG_KEY = 'telemetry-enabled';
const ENABLED_VALUE = 'enabled';
const DISABLED_VALUE = 'disabled';

const release = `commonality@${packageJson.version}`;

export const validateTelemetry = async () => {
  if (process.env.DO_NOT_TRACK) {
    return;
  }

  const value = config.get(CONFIG_KEY);

  if (value === ENABLED_VALUE) {
    initializeTelemetry({ release });
  } else if (value === undefined) {
    const { enable } = await prompts({
      type: 'toggle',
      name: 'enable',
      message:
        'Would you like to enable anonymous telemetry? This will help us fix bugs faster.',
    });

    if (enable) {
      initializeTelemetry({ release });

      config.set(CONFIG_KEY, ENABLED_VALUE);
    } else {
      config.set(CONFIG_KEY, DISABLED_VALUE);
    }
  }
};
