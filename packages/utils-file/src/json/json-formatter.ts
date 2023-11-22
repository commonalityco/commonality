import isMatch from 'lodash-es/isMatch';
import { matchKeys } from '../utils/match-keys';
import { diff as jestDiff } from 'jest-diff';
import chalk from 'chalk';
import isEqual from 'lodash-es/isEqual';
import fs from 'fs-extra';
import { JsonFile } from '@commonalityco/types';

export const jsonFormatter = (
  filepath: string,
  options: { defaultSource?: Record<string, unknown> } = {},
): Pick<JsonFile, 'diff' | 'diffAdded' | 'diffRemoved'> => {
  const getSource = async () => {
    return options.defaultSource ?? (await fs.readJSON(filepath)) ?? {};
  };

  return {
    async diff(value) {
      const sourceData = await getSource();
      const isValueSuperset = isMatch(value, sourceData);
      const source = isValueSuperset
        ? sourceData
        : matchKeys(sourceData, value);

      if (!source || Object.keys(source).length === 0) {
        return chalk.dim(`No match found`);
      }

      if (isEqual(source, value)) {
        return chalk.dim(chalk.green(JSON.stringify(source, undefined, 2)));
      }

      if (isMatch(sourceData, value)) {
        return chalk.dim(chalk.green(JSON.stringify(source, undefined, 2)));
      }

      if (isEqual(source, value)) {
        return chalk.dim(chalk.green(JSON.stringify(value, undefined, 2)));
      }

      const result = jestDiff(source, value, {
        omitAnnotationLines: true,
        aColor: chalk.dim,
        bColor: chalk.red,
        changeColor: chalk.red,
        commonColor: chalk.green.dim,
        aIndicator: ' ',
        bIndicator: '+',
      });

      return result || undefined;
    },

    async diffAdded(value) {
      const json = await getSource();

      if (isEqual(json, value)) {
        return chalk.dim(chalk.green(JSON.stringify(json, undefined, 2)));
      }

      const result = jestDiff(json, value, {
        omitAnnotationLines: true,
        aColor: chalk.dim,
        bColor: chalk.red,
        changeColor: chalk.red,
        commonColor: chalk.green.dim,
        aIndicator: ' ',
        bIndicator: '+',
      });

      return result || undefined;
    },

    async diffRemoved(value) {
      const json = await getSource();

      if (isEqual(json, value)) {
        return chalk.dim(chalk.green(JSON.stringify(json, undefined, 2)));
      }

      const result = jestDiff(json, value, {
        omitAnnotationLines: true,
        aColor: chalk.dim,
        bColor: chalk.red,
        changeColor: chalk.red,
        commonColor: chalk.green.dim,
        aIndicator: ' ',
        bIndicator: '-',
      });

      return result || undefined;
    },
  };
};
