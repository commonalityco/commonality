import prompts from 'prompts';

export const getUseTypeScript = async (): Promise<boolean> => {
  const { typescript } = await prompts([
    {
      type: 'toggle',
      name: 'typescript',
      initial: true,
      message: `Would you like to use TypeScript?`,
      active: 'yes',
      inactive: 'no',
    },
  ]);

  return typescript;
};
