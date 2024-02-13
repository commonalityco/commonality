import { beforeEach, describe, expect, it, vi } from 'vitest';
import { validateTelemetry } from './validate-telemetry';
import Conf from 'conf';
import prompts from 'prompts';
import * as telemetry from './initialize-telemetry';

vi.mock('conf', () => {
  const Conf = vi.fn();
  Conf.prototype.get = vi.fn();
  Conf.prototype.set = vi.fn();

  return { default: Conf };
});

vi.mock('./initialize-telemetry.ts', () => ({
  initializeTelemetry: vi.fn(),
}));

describe('validateTelemetry', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.unstubAllEnvs();
  });

  it('does not initialize telemetry if process.env.DO_NOT_TRACK is set', async () => {
    vi.stubEnv('DO_NOT_TRACK', '1');

    await validateTelemetry();

    expect(telemetry.initializeTelemetry).not.toHaveBeenCalled();
  });

  it('initializes telemetry if config value is enabled', async () => {
    vi.mocked(Conf.prototype.get).mockReturnValue('enabled');

    await validateTelemetry();

    expect(telemetry.initializeTelemetry).toHaveBeenCalled();
  });

  it('does not initialize telemetry if config value is disabled', async () => {
    vi.mocked(Conf.prototype.get).mockReturnValue('disabled');

    await validateTelemetry();

    expect(telemetry.initializeTelemetry).not.toHaveBeenCalled();
  });

  it('prompts the user if config value is not set and initializes telemetry if user enables it', async () => {
    prompts.inject([true]);

    await validateTelemetry();

    expect(telemetry.initializeTelemetry).toHaveBeenCalled();
  });

  it('sets the config value to enabled if the user enables telemetry', async () => {
    prompts.inject([true]);

    await validateTelemetry();

    expect(Conf.prototype.set).toHaveBeenCalledWith(
      'telemetry-enabled',
      'enabled',
    );
  });

  it('sets the config value to disabled if the user disables telemetry', async () => {
    prompts.inject([false]);

    await validateTelemetry();

    expect(Conf.prototype.set).toHaveBeenCalledWith(
      'telemetry-enabled',
      'disabled',
    );
  });
});
