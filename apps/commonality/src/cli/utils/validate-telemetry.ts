import prompts from 'prompts';
import { initializeTelemetry, telemetryStatus } from '@commonalityco/telemetry';
import packageJson from '../../../package.json';

const release = `commonality@${packageJson.version}`;

export const validateTelemetry = async () => {
  const status = telemetryStatus.get();

  if (status === 'enabled') {
    initializeTelemetry({ release });
  } else if (status === 'unset') {
    const { enable } = await prompts({
      type: 'toggle',
      name: 'enable',
      message:
        'Would you like to enable anonymous telemetry? This will help us fix bugs faster.',
    });

    if (enable) {
      initializeTelemetry({ release });

      telemetryStatus.set('enabled');
    } else {
      telemetryStatus.set('disabled');
    }
  }
};
