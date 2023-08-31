import React from 'react';
import type { Preview } from '@storybook/react';
import { withThemeByDataAttribute } from '@storybook/addon-styling';
import '@commonalityco/config-tailwind/globals.css';

const preview: Preview = {
  decorators: [
    (Story) => (
      <div className="antialiased relative">
        <Story />
      </div>
    ),
  ],
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#fff',
        },
        {
          name: 'dark',
          value: 'hsl(240 6% 8.5%)',
        },
      ],
    },
    // actions: { argTypesRegex: '^on.*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export const decorators = [
  withThemeByDataAttribute({
    themes: {
      light: 'light',
      dark: 'dark',
    },
    defaultTheme: 'light',
    attributeName: 'data-mode',
  }),
];

export default preview;
