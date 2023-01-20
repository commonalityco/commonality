export const getCurrentBranch = async () => {
	const { execa } = await import('execa');
	const { stdout } = await execa('git', ['rev-parse', '--abbrev-ref', 'HEAD']);

	return stdout?.toString()?.replace(/[\n\r\s]+$/, '') || '';
};
