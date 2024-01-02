import React from 'react';
import type { DocsThemeConfig } from 'nextra-theme-docs';
import { Logo, WordLogo } from '@commonalityco/ui-core';
import { useRouter } from 'next/router';
import { useConfig } from 'nextra-theme-docs';

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
    text: 'Commonality',
  },
  banner: {
    key: '0-beta',
    text: 'Commonality is now in beta 🎉',
  },
  useNextSeoProps() {
    const { asPath } = useRouter();

    if (asPath !== '/') {
      return {
        titleTemplate: '%s – Commonality',
      };
    }
  },
  head: function useHead() {
    const { title } = useConfig();
    const { route } = useRouter();
    const socialCard =
      route === '/' || !title
        ? 'https://commonality.co/og.png'
        : `https://commonality.co/api/og?title=${title}`;

    return (
      <>
        <meta name="msapplication-TileColor" content="#fff" />
        <meta name="theme-color" content="#fff" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Language" content="en" />
        <meta
          name="description"
          content="Commonality helps you scale JavaScript monorepos and package ecosystems with the tools you already love."
        />
        <meta
          name="og:description"
          content="Commonality helps you scale JavaScript monorepos and package ecosystems with the tools you already love."
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={socialCard} />
        <meta name="twitter:site:domain" content="commonality.co" />
        <meta name="twitter:url" content="https://commonality.co" />
        <meta
          name="og:title"
          content={
            title && title !== 'Commonality'
              ? title + ' – Commonality'
              : 'Commonality'
          }
        />
        <meta name="og:image" content={socialCard} />
        <meta name="apple-mobile-web-app-title" content="Commonality" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link
          rel="icon"
          href="/favicon-dark.svg"
          type="image/svg+xml"
          media="(prefers-color-scheme: dark)"
        />
        <link
          rel="icon"
          href="/favicon-dark.png"
          type="image/png"
          media="(prefers-color-scheme: dark)"
        />
      </>
    );
  },
};

export default config;
