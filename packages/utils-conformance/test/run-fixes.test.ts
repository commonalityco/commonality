import { describe, expect, it, vi } from 'vitest';
import { runFixes } from '../src/run-fixes';
import {
  Workspace,
  FileCreatorFactory,
  JsonFileCreator,
  TextFileCreator,
  ConformanceResult,
} from '@commonalityco/types';

describe('runFixes', () => {
  it('should only run fixes on invalid and fixable results', async () => {
    const fix = vi.fn();
    const conformanceResults: ConformanceResult[] = [
      {
        name: 'Invalid workspace',
        level: 'error',
        pattern: '*',
        workspace: {
          path: '/path/to/workspace',
          tags: ['tag1', 'tag2'],
          codeowners: ['codeowner1', 'codeowner2'],
          packageJson: { name: 'valid' },
        },
        message: { title: 'Invalid workspace' },
        fix,
        isValid: false,
      },
      {
        name: 'Valid workspace',
        level: 'warning',
        pattern: '*',
        workspace: {
          path: '/path/to/workspace',
          tags: ['tag1', 'tag2'],
          codeowners: ['codeowner1', 'codeowner2'],
          packageJson: { name: 'valid' },
        },
        message: { title: 'Valid workspace' },
        isValid: true,
      },
      {
        name: 'Valid workspace',
        level: 'warning',
        pattern: '*',
        workspace: {
          path: '/path/to/workspace',
          tags: ['tag1', 'tag2'],
          codeowners: ['codeowner1', 'codeowner2'],
          packageJson: { name: 'valid' },
        },
        message: { title: 'Valid workspace' },
        fix,
        isValid: true,
      },
    ];
    const rootDirectory = '';
    const workspaces: Workspace[] = [
      {
        path: '/path/to/workspace',
        tags: ['tag1', 'tag2'],
        codeowners: ['codeowner1', 'codeowner2'],
        packageJson: { name: 'valid' },
      },
    ];
    const createJson: FileCreatorFactory<JsonFileCreator> = vi.fn();
    const createText: FileCreatorFactory<TextFileCreator> = vi.fn();
    const createYaml: FileCreatorFactory<YamlFileCreator> = vi.fn();

    await runFixes({
      conformanceResults,
      rootDirectory,
      workspaces,
      createJson,
      createText,
      createYaml,
    });

    expect(fix).toHaveBeenCalledTimes(1);
  });

  it('should run fixes and return results', async () => {
    const conformanceResults: ConformanceResult[] = [
      {
        name: 'Valid workspace',
        level: 'warning',
        pattern: '*',
        workspace: {
          path: '/path/to/workspace',
          tags: ['tag1', 'tag2'],
          codeowners: ['codeowner1', 'codeowner2'],
          packageJson: { name: 'valid' },
        },
        message: { title: 'Valid workspace' },
        fix: async () => {},
        isValid: false,
      },
    ];
    const rootDirectory = '';
    const workspaces: Workspace[] = [
      {
        path: '/path/to/workspace',
        tags: ['tag1', 'tag2'],
        codeowners: ['codeowner1', 'codeowner2'],
        packageJson: { name: 'valid' },
      },
    ];
    const createJson: FileCreatorFactory<JsonFileCreator> = vi.fn();
    const createText: FileCreatorFactory<TextFileCreator> = vi.fn();
    const createYaml: FileCreatorFactory<YamlFileCreator> = vi.fn();

    const results = await runFixes({
      conformanceResults,
      rootDirectory,
      workspaces,
      createJson,
      createText,
      createYaml,
    });

    expect(results).toHaveLength(1);
    expect(results[0].isFixed).toBe(true);
    expect(results[0].workspace).toEqual(workspaces[0]);
  });

  it('should handle errors when running fixes', async () => {
    const conformanceResults: ConformanceResult[] = [
      {
        name: 'Invalid workspace',
        level: 'error',
        pattern: '*',
        workspace: {
          path: '/path/to/workspace',
          tags: ['tag1', 'tag2'],
          codeowners: ['codeowner1', 'codeowner2'],
          packageJson: { name: 'valid' },
        },
        message: { title: 'Invalid workspace' },
        fix: async () => {
          throw new Error('Fix failed');
        },
        isValid: false,
      },
    ];
    const rootDirectory = '';
    const workspaces: Workspace[] = [
      {
        path: '/path/to/workspace',
        tags: ['tag1', 'tag2'],
        codeowners: ['codeowner1', 'codeowner2'],
        packageJson: { name: 'valid' },
      },
    ];

    const results = await runFixes({
      conformanceResults,
      rootDirectory,
      workspaces,
    });

    expect(results).toHaveLength(1);
    expect(results[0].isFixed).toBe(false);
    expect(results[0].error).toBeDefined();
    expect(results[0].error?.message).toBe('Fix failed');
    expect(results[0].workspace).toEqual(workspaces[0]);
  });
});
