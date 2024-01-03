import React from 'react';
import type { DocsThemeConfig } from 'nextra-theme-docs';
import { Logo, WordLogo } from '@commonalityco/ui-core';
import { useRouter } from 'next/router';
import { useConfig } from 'nextra-theme-docs';
import path from 'node:path';
import packageJson from '../commonality/package.json';

const config: DocsThemeConfig = {
  logo: (
    <span className="flex gap-3 items-center">
      <Logo />
      <WordLogo />
      <span className="text-xs font-mono font-medium hidden md:block">
        {packageJson.version}
      </span>
      <div className="uppercase text-xs bg-gradient-to-r from-[#839996] to-[#496767] px-3 py-1 rounded-full font-bold text-white hidden md:block">
        Beta
      </div>
    </span>
  ),
  project: {
    link: 'https://github.com/commonalityco/commonality',
  },
  docsRepositoryBase:
    'https://github.com/commonalityco/commonality/tree/main/apps/documentation',
  footer: {
    text: (
      <div className="flex flex-col md:flex-row gap-4 items-center md:justify-between w-full">
        <span className="flex gap-3 items-center text-primary">
          <Logo />
          <WordLogo />
        </span>
        <div className="text-center md:text-left">
          <p className="text-xs mb-2">
            MPL-2.0 {new Date().getFullYear()} ©{' '}
            <a href="https://commonality.co" target="_blank">
              Commonality
            </a>
            .
          </p>
          <p className="block text-xs">
            Created by{' '}
            <a
              className="text-primary"
              href="https://twitter.com/alecchernicki"
              target="_blank"
            >
              Alec Chernicki
            </a>
          </p>
        </div>
      </div>
    ),
  },
  banner: {
    key: '0-beta',
    text: '🎉 Commonality is now in Beta',
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
