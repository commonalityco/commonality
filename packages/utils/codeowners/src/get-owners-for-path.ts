import ignore from 'ignore';

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
    const ig = ignore({ allowRelativePaths: true }).add([pattern]);
    const result = ig.test(path);

    if (result.ignored && !result.unignored) {
      matchingPatterns.push(pattern);
    }
  }

  const allPatterns = matchingPatterns.flatMap(
    (pattern) => codeowners[pattern]
  );

  return [...new Set(allPatterns)];
};
