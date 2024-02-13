#!/usr/bin/env node
import { Command } from 'commander';
import { telemetryStatus } from '@commonalityco/telemetry';

const command = new Command();

export const telemetry = command.name('telemetry');

telemetry.command('list').action(() => {
  const status = telemetryStatus.get();
  console.log({ status });
});
