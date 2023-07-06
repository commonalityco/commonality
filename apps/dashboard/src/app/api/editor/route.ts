import { NextResponse } from 'next/server';
import { z } from 'zod';
import launch from 'launch-editor';
import { getRootDirectory } from '@commonalityco/data-project';
import path from 'path';

const requestBodySchema = z.object({
  path: z.string(),
});

export async function POST(request: Request) {
  const json = await request.json();
  const data = requestBodySchema.parse(json);
  const rootPath = await getRootDirectory();
  const filepath = path.join(rootPath, data.path, 'package.json');

  launch(filepath);

  return NextResponse.json({});
}
