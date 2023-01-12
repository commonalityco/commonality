import fs from 'fs-extra';
import glob from 'glob';
import { getIsTeam } from './get-is-team.js';
import { getIsEmail } from './get-is-email.js';

const isValidOwner = (owner: string) => {
	const isTeamHandle = getIsTeam(owner);
	const isEmail = getIsEmail(owner);

	return isTeamHandle || isEmail;
};

export const getCodeOwners = ({ rootDirectory }: { rootDirectory: string }) => {
	const filePaths = glob.sync('CODEOWNERS', {
		cwd: rootDirectory,
	});

	const filePath = filePaths[0];

	if (!filePath) {
		return {};
	}

	if (fs.lstatSync(filePath).isDirectory()) {
		throw new Error(`Found CODEOWNERS but it's a directory: ${filePath}`);
	}

	const lines = fs
		.readFileSync(filePath)
		.toString()
		.split(/\r\n|\r|\n/)
		.map((line) => line.trim())
		.filter((line) => Boolean(line) && !line.startsWith('#'));

	const linesWithParts = lines.map((line) => line.split(/\s+/));

	const globalOwners = linesWithParts
		.filter((lineWithParts) =>
			lineWithParts.every((lintWithPart) => isValidOwner(lintWithPart))
		)
		.flat();

	const linesWithoutGlobalOwners = linesWithParts.filter((lineWithParts) => {
		const firstPart = lineWithParts[0];

		return firstPart && !isValidOwner(firstPart);
	});

	const ownerEntries: Record<string, string[]> = {};

	for (const line of linesWithoutGlobalOwners) {
		const [pathString, ...usernames] = line;

		if (pathString) {
			ownerEntries[pathString] = [...usernames, ...globalOwners];
		}
	}

	return ownerEntries;
};
