import fs from 'fs-extra';
import path from 'node:path';

// Replace single asterisks with a pattern that matches any character except for a slash
const convertPattern = (pattern: string): string => {
  // If the pattern is a lone asterisk, it matches everything
  if (pattern === '*') {
    return '**';
  }

  // If the pattern starts with a wildcard and has no slashes (e.g., *.js), match all directory levels
  if (pattern.startsWith('*') && !pattern.includes('/')) {
    return '**/' + pattern;
  }

  // If the pattern doesn't start with a slash, match it anywhere in the directory structure
  if (!pattern.startsWith('/')) {
    pattern = '**/' + pattern;
  }

  // Remove leading slash to match from the repository root
  if (pattern.startsWith('/')) {
    pattern = pattern.slice(1);
  }

  // Escape special characters that are not meaningful in CODEOWNERS
  pattern = pattern.replaceAll(/([$()+.?[\\\]^{|}])/g, '\\$1');

  // If the pattern ends with a slash, match directories recursively
  if (pattern.endsWith('/')) {
    pattern += '**';
  } else {
    // If the pattern represents a directory without a trailing slash or wildcard, match all files within that directory
    const lastSlashIndex = pattern.lastIndexOf('/');
    if (
      lastSlashIndex !== -1 &&
      !pattern.includes('.', lastSlashIndex) &&
      !pattern.includes('*', lastSlashIndex)
    ) {
      pattern += '/*';
    }
  }

  return pattern;
};

const getCodeowners = async ({ rootDirectory }: { rootDirectory: string }) => {
  // Define the possible paths for the CODEOWNERS file
  const paths = [
    path.join(rootDirectory, 'CODEOWNERS'),
    path.join(rootDirectory, '.github/CODEOWNERS'),
    path.join(rootDirectory, '.gitlab/CODEOWNERS'),
    path.join(rootDirectory, 'docs/CODEOWNERS'),
  ];

  // Try to find and read the CODEOWNERS file from one of the paths
  let codeownersContent = '';
  for (const filePath of paths) {
    if (await fs.pathExists(filePath)) {
      codeownersContent = await fs.readFile(filePath, 'utf8');
      break;
    }
  }

  // If no CODEOWNERS file is found, return an empty object
  if (!codeownersContent) return {};

  // Process the content of the CODEOWNERS file
  const lines = codeownersContent.split('\n');
  const codeOwnersMap: Record<string, string[]> = {};

  for (let line of lines) {
    // Ignore empty lines and comments
    if (!line.trim() || line.startsWith('#')) continue;

    // Strip inline comments
    line = line.split('#')[0].trim();

    // Split the line into pattern and owners
    const [pattern, ...ownerParts] = line.split(/\s+/);

    // Skip if pattern is not defined
    if (!pattern) continue;

    // Convert pattern into a micromatch-compatible pattern
    const globPattern = convertPattern(pattern);

    // Set owners as empty array if not defined, else use ownerParts
    const owners = ownerParts.length === 0 ? [] : ownerParts;

    // Overwrite the existing value for the pattern with the new definition
    codeOwnersMap[globPattern] = owners;
  }

  return codeOwnersMap;
};

export { getCodeowners };
