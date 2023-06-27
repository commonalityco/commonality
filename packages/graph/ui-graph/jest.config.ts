import config from '@commonalityco/config-jest';

export default { ...config, setupFilesAfterEnv: ['<rootDir>/test/setup.ts'] };
