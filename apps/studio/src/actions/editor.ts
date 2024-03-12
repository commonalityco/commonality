'use server';
import openEditor from 'open-editor';
import path from 'node:path';
import { getProjectData } from '@/data/project';
import fs from 'fs-extra';

export async function openEditorAction(filePath: string) {
  const fullPath = path.join(
    process.env.COMMONALITY_ROOT_DIRECTORY ?? './',
    filePath,
  );

  await openEditor([{ file: fullPath }]);
}

export async function openPackageJson(packageDirectory: string) {
  const fullPath = path.join(
    process.env.COMMONALITY_ROOT_DIRECTORY ?? './',
    packageDirectory,
    'package.json',
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

    const fileContent =
      "import { defineConfig } from 'commonality';\n\nexport default defineConfig({\n  // Add checks and constraints here\n  // Check out https://commonality.co/docs/get-started to get started.\n});\n";

    await fs.outputFile(defaultPath, fileContent);

    await openEditor([{ file: defaultPath }]);
  }
}
