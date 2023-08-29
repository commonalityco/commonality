'use server';
import 'server-only';
import openEditor from 'open-editor';
import { Document } from '@commonalityco/types';
import path from 'node:path';

export async function openEditorAction(document: Document) {
  await openEditor([
    { file: path.join(process.env.COMMONALITY_ROOT_DIRECTORY, document.path) },
  ]);
}
