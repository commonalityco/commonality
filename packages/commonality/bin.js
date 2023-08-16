#!/usr/bin/env node
import updateNotifier from 'update-notifier';
import fs from 'fs-extra';

const packageJson = fs.readJsonSync('./package.json');

updateNotifier({ pkg: packageJson }).notify();

import('./dist/index.js');
