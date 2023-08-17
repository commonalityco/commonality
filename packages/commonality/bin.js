#!/usr/bin/env node
import updateNotifier from 'update-notifier';
import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageJsonPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  './package.json',
);

const packageJson = fs.readJsonSync(packageJsonPath);

updateNotifier({ pkg: packageJson }).notify();

import('./dist/index.js');
