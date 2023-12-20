import React from 'react';
import { DocsThemeConfig } from 'nextra-theme-docs';
import { Logo } from './logo';

const config: DocsThemeConfig = {
  logo: (
    <span>
      <Logo />
      Commonality
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
