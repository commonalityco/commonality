import prompts from 'prompts';

export const getUseTypeScript = async (): Promise<boolean> => {
  const { typescript } = await prompts([
    {
      type: 'confirm',
      name: 'typescript',
      message: `Would you like to use TypeScript?`,
    },
  ]);

  return typescript;
};
