#!/usr/bin/env node
import { Command } from 'commander';
import { telemetryStatus } from '@commonalityco/telemetry';
import { validateTelemetry } from '../utils/validate-telemetry';

const command = new Command();

export const telemetry = command.name('telemetry');

const enabledText = 'Telemetry is enabled';
const disabledText = 'Telemetry is disabled';
const unsetText = 'Telemetry is not set';

telemetry.command('list').action(async () => {
  await validateTelemetry();

  const status = telemetryStatus.get();

  if (status === 'enabled') {
    console.log(enabledText);
  } else if (status === 'disabled') {
    console.log(disabledText);
  } else {
    console.log(unsetText);
  }
});

telemetry.command('enable').action(async () => {
  telemetryStatus.set('enabled');

  console.log(enabledText);
});

telemetry.command('disable').action(async () => {
  telemetryStatus.set('disabled');

  console.log(disabledText);
});
