import { defineCheck, json } from 'commonality';

export const hasScript = defineCheck((name: string, value: string) => {
  return {
    name: 'internal/has-script',
    message: `Missing script "${name}" with value "${value}"`,
    validate: async (ctx) => {
      const packageJson = await json<{ scripts?: Record<string, string> }>(
        ctx.package.path,
        'package.json',
      ).get();

      if (!packageJson) return false;

      return packageJson.scripts && packageJson.scripts[name] === value;
    },
    fix: async (ctx) => {
      await json<{ scripts?: Record<string, string> }>(
        ctx.package.path,
        'package.json',
      ).merge({ scripts: { [name]: value } });
    },
  };
});
