#!/usr/bin/env node
/* eslint-disable no-undef */
// @ts-check
import fs from 'fs-extra';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import resolve from 'resolve';

resolve(
  '@commonalityco/studio' + '/package.json',
  async (error, packagePath) => {
    if (error || !packagePath) {
      console.error(`Package @commonalityco/studio not found.`);
      process.exit(1);
    } else {
      const packageDirectory = path.dirname(packagePath);
      const __dirname = path.dirname(fileURLToPath(import.meta.url));
      const destinationFolder = path.join(__dirname, '../dist/studio');

      try {
        await fs.copy(
          path.join(packageDirectory, '.next'),
          path.join(destinationFolder, '.next'),
          {
            overwrite: false,
            errorOnExist: true,
            dereference: true,
            filter: (source) => {
              if (source.includes('cache')) {
                return false;
              }
              return true;
            },
          },
        );

        await fs.copy(
          path.join(packageDirectory, 'next.config.js'),
          path.join(destinationFolder, 'next.config.js'),
          { overwrite: false, errorOnExist: true, dereference: true },
        );

        await fs.copy(
          path.join(packageDirectory, 'server.js'),
          path.join(destinationFolder, 'server.js'),
          { overwrite: false, errorOnExist: true, dereference: true },
        );

        await fs.copy(
          path.join(packageDirectory, 'package.json'),
          path.join(destinationFolder, 'package.json'),
          { overwrite: false, errorOnExist: true, dereference: true },
        );

        console.log('Successfully copied Commonality Studio');
      } catch (error) {
        console.log(error);
        process.exit(1);
      }
    }
  },
);
