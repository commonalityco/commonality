import type { File as FileType, Workspace } from '@commonalityco/types';
import fs from 'fs-extra';
import path from 'node:path';

export class File implements FileType {
  workspace: Workspace;
  rootDirectory: string;
  filename: string;
  filepath: string;

  constructor(workspace: Workspace, rootDirectory: string, filename: string) {
    this.workspace = workspace;
    this.rootDirectory = rootDirectory;
    this.filename = filename;
    this.filepath = path.join(
      this.rootDirectory,
      this.workspace.path,
      this.filename,
    );
  }

  async delete(): Promise<void> {
    try {
      await fs.remove(this.filepath);
    } catch (error) {
      console.error(`Error deleting file: ${error}`);
    }
  }

  async exists(): Promise<boolean> {
    try {
      return await fs.pathExists(this.filepath);
    } catch (error) {
      console.error(`Error checking if file exists: ${error}`);
      return false;
    }
  }
}
