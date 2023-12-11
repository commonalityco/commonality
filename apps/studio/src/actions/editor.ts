'use server';
import 'server-only';
import openEditor from 'open-editor';
import path from 'node:path';
import { getProjectData } from '@/data/project';
import { text } from 'commonality';

export async function openEditorAction(filePath: string) {
  const fullPath = path.join(process.env.COMMONALITY_ROOT_DIRECTORY, filePath);

  await openEditor([{ file: fullPath }]);
}

export async function openPackageJson(packageDirectory: string) {
  const fullPath = path.join(
    process.env.COMMONALITY_ROOT_DIRECTORY,
    packageDirectory,
    'package.json',
  );

  await openEditor([{ file: fullPath }]);
}

export async function openPackageConfig(packageDirectory: string) {
  const fullPath = path.join(
    process.env.COMMONALITY_ROOT_DIRECTORY,
    packageDirectory,
    'commonality.json',
  );

  await openEditor([{ file: fullPath }]);
}

export async function openProjectConfig() {
  const projectConfig = await getProjectData();

  if (projectConfig.config?.filepath) {
    await openEditor([{ file: projectConfig.config?.filepath }]);
  } else {
    const defaultPath = path.join(
      process.env.COMMONALITY_ROOT_DIRECTORY,
      'commonality.config.js',
    );

    await text(defaultPath).set([
      "import { defineConfig } from 'commonality';",
      '',
      'export default defineConfig({',
      '  // Add checks and constraints here',
      '  // Check out https://commonality.co/docs/reference/configuration for more all options.',
      '});',
    ]);

    await openEditor([{ file: defaultPath }]);
  }
}
