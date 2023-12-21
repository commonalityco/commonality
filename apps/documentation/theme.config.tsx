import React from 'react';
import { DocsThemeConfig } from 'nextra-theme-docs';
import { Logo } from '@commonalityco/ui-core';

const config: DocsThemeConfig = {
  logo: (
    <span className="flex gap-3 items-center">
      <Logo />
      <span className="font-serif text-xl font-semibold">commonality</span>
    </span>
  ),
  project: {
    link: 'https://github.com/commonalityco/commonality',
  },
  docsRepositoryBase: 'https://github.com/shuding/nextra-docs-template',
  footer: {
    text: 'Nextra Docs Template',
  },
};

export default config;
