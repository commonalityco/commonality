import execa from 'execa';

export const getCurrentBranch = async () => {
  const { stdout } = await execa('git', ['rev-parse', '--abbrev-ref', 'HEAD']);

  return stdout?.toString()?.replace(/\s+$/, '') || '';
};
