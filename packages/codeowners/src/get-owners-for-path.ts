import micromatch from 'micromatch';
import { getCodeOwners } from './get-code-owners';

export const getOwnersForPath = ({
	path,
	rootDirectory,
}: {
	path: string;
	rootDirectory: string;
}): string[] => {
	const owners = getCodeOwners({ rootDirectory });

	const globs = Object.keys(owners);

	const ownersForPath: string[] = [];

	for (const glob of globs) {
		const ownersForGlob = owners[glob];
		if (micromatch.isMatch(path, glob) && ownersForGlob) {
			ownersForPath.push(...ownersForGlob);
		}
	}

	return ownersForPath;
};
