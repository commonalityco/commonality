import React from 'react';
import type { Preview } from '@storybook/react';
import { withThemeByDataAttribute } from '@storybook/addon-styling';
import '../src/tailwind.css';

const preview: Preview = {
  decorators: [
    (Story) => (
      <div className="antialiased">
        <Story />
      </div>
    ),
  ],
  parameters: {
    backgrounds: {
      default: 'light/primary',
      values: [
        {
          name: 'light/primary',
          value: '#fff',
        },
        {
          name: 'light/secondary',
          value: '#f4f4f5',
        },
        {
          name: 'dark/primary',
          value: '#18181b',
        },
        {
          name: 'dark/secondary',
          value: '#27272a',
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
