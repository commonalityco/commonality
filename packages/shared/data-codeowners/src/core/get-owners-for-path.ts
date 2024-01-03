import { minimatch } from 'minimatch';

export const getOwnersForPath = ({
  path,
  codeowners,
}: {
  path: string;
  codeowners: Record<string, string[]>;
}): string[] => {
  const patterns = Object.keys(codeowners);
  let matchingPattern: undefined | string = undefined;

  for (const pattern of patterns) {
    const isMatch = minimatch(path, pattern);

    if (isMatch) {
      matchingPattern = pattern;
    }
  }

  if (!matchingPattern) {
    return [];
  }

  return codeowners[matchingPattern];
};
