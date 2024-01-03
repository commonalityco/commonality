#!/usr/bin/env node
// @ts-check
import updateNotifier from 'update-notifier';
import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageJsonPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  './package.json',
);

const packageJson = fs.readJsonSync(packageJsonPath);
const notifier = updateNotifier({ pkg: packageJson });

notifier.notify({ isGlobal: true });

import('./dist/cli/cli.js');
