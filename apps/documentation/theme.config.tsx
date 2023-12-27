import React from 'react';
import { DocsThemeConfig } from 'nextra-theme-docs';
import { Logo, WordLogo } from '@commonalityco/ui-core';

const config: DocsThemeConfig = {
  logo: (
    <span className="flex gap-3 items-center">
      <Logo />
      <WordLogo />
    </span>
  ),
  project: {
    link: 'https://github.com/commonalityco/commonality',
  },
  docsRepositoryBase:
    'https://github.com/commonalityco/commonality/tree/main/apps/documentation',
  footer: {
    text: 'Nextra Docs Template',
  },
  // primaryHue: 180,
  // primarySaturation: 40,
};

export default config;
