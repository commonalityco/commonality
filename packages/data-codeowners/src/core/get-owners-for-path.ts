import { minimatch } from 'minimatch';

export const getOwnersForPath = ({
  path,
  codeowners,
}: {
  path: string;
  codeowners: Record<string, string[]>;
}): string[] => {
  const patterns = Object.keys(codeowners);
  const matchingPatterns = [];

  for (const pattern of patterns) {
    console.log({ path, pattern });
    const isMatch = minimatch(path, pattern);

    if (isMatch) {
      matchingPatterns.push(pattern);
    }
  }

  const allPatterns = matchingPatterns
    .flatMap((pattern) => codeowners[pattern])
    .filter((str): str is string => Boolean(str));

  return [...new Set(allPatterns)];
};
