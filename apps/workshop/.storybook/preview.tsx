import React from 'react';
import { Preview } from '@storybook/react';

import './globals.css';

const preview: Preview = {
  decorators: [
    (Story) => (
      <div className="relative antialiased">
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

export const decorators = [];

export default preview;
