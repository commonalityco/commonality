import prompts from 'prompts';
import packageJson from '../../../package.json';
import { initializeTelemetry } from './initialize-telemetry';
import { telemetryStatus } from './telemetry-status';

const release = `commonality@${packageJson.version}`;

export const validateTelemetry = async () => {
  const status = telemetryStatus.get();

  if (status === 'disabled') {
    return;
  }

  if (status === 'enabled') {
    initializeTelemetry({ release });
  } else if (status === 'unset') {
    const { enable } = await prompts({
      type: 'toggle',
      name: 'enable',
      message:
        'Would you like to help us fix bugs faster and enable anonymous telemetry?',
      initial: true,
      active: 'yes',
      inactive: 'no',
    });

    if (enable === true) {
      initializeTelemetry({ release });

      telemetryStatus.set('enabled');
    } else if (enable === false) {
      telemetryStatus.set('disabled');
    }
  }
};
