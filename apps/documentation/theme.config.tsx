import React from 'react';
import { DocsThemeConfig } from 'nextra-theme-docs';
import { Logo } from '@commonalityco/ui-core';

const config: DocsThemeConfig = {
  logo: (
    <span className="flex gap-3 items-center">
      <Logo />
      <span className="font-serif font-semibold text-2xl">commonality</span>
    </span>
  ),
  project: {
    link: 'https://github.com/commonalityco/commonality',
  },
  docsRepositoryBase: 'https://github.com/shuding/nextra-docs-template',
  footer: {
    text: 'Nextra Docs Template',
  },
  primaryHue: 180,
  primarySaturation: 40,
};

export default config;
