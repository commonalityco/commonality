'use server';
import 'server-only';
import openEditor from 'open-editor';
import path from 'node:path';

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
